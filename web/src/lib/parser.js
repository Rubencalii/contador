// Parser de chats exportados de WhatsApp (Android e iOS, español/inglés).
// Todo se procesa en el navegador: el archivo nunca sale del dispositivo.

// Línea de inicio de mensaje:
//   Android:  25/12/23, 14:30 - Nombre: mensaje
//   Android:  25/12/2023, 2:30 p. m. - Nombre: mensaje
//   iOS:      [25/12/23, 14:30:45] Nombre: mensaje
const RE_ANDROID =
  /^(\d{1,2})\/(\d{1,2})\/(\d{2,4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([ap]\.?\s?m\.?)?\s*-\s*([^:]+?):\s?([\s\S]*)$/i

const RE_IOS =
  /^\[(\d{1,2})\/(\d{1,2})\/(\d{2,4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([ap]\.?\s?m\.?)?\]\s*([^:]+?):\s?([\s\S]*)$/i

// Marcadores de multimedia (varían según idioma/versión).
const MARCADORES = {
  imagen: ['imagen omitida', 'image omitted'],
  video: ['video omitido', 'vídeo omitido', 'video omitted'],
  audio: ['audio omitido', 'audio omitted', 'ptt omitido'],
  sticker: ['sticker omitido', 'sticker omitted'],
  gif: ['gif omitido', 'gif omitted'],
  documento: ['documento omitido', 'document omitted'],
  contacto: ['contacto omitido', 'contact card omitted', 'tarjeta de contacto omitida'],
  ubicacion: ['ubicación:', 'location:', 'ubicacion en tiempo real'],
  eliminado: [
    'se eliminó este mensaje',
    'eliminaste este mensaje',
    'this message was deleted',
    'you deleted this message',
  ],
}
const MULTIMEDIA_GENERICO = ['<multimedia omitido>', '<media omitted>']

// Adjuntos cuando se exporta "Con archivos" (el .txt nombra cada fichero):
//   Android:  IMG-20231225-WA0001.jpg (archivo adjunto)
//   iOS:      ‎<adjunto: 00000042-PHOTO-2023-12-25-14-30-45.jpg>
const RE_ADJUNTO_IOS = /<(?:adjunto|attached):\s*(.+?)>/i
const RE_ADJUNTO_ANDROID = /^(.+?)\s*\((?:archivo adjunto|file attached)\)\s*$/i

// Clasificación de un adjunto según el prefijo o la extensión de su nombre.
const PREFIJO_TIPO = [
  [/^IMG[-_]/i, 'imagen'],
  [/^VID[-_]/i, 'video'],
  [/^(?:PTT|AUD)[-_]/i, 'audio'],
  [/^STK[-_]/i, 'sticker'],
  [/^GIF[-_]/i, 'gif'],
  [/^DOC[-_]/i, 'documento'],
  [/PHOTO/i, 'imagen'],
  [/VIDEO/i, 'video'],
  [/AUDIO/i, 'audio'],
  [/STICKER/i, 'sticker'],
]
const EXT_TIPO = {
  jpg: 'imagen', jpeg: 'imagen', png: 'imagen', heic: 'imagen', heif: 'imagen', bmp: 'imagen',
  webp: 'sticker',
  gif: 'gif',
  mp4: 'video', '3gp': 'video', mov: 'video', mkv: 'video', avi: 'video', webm: 'video',
  opus: 'audio', m4a: 'audio', mp3: 'audio', aac: 'audio', ogg: 'audio', amr: 'audio', wav: 'audio',
  pdf: 'documento', doc: 'documento', docx: 'documento', xls: 'documento', xlsx: 'documento',
  ppt: 'documento', pptx: 'documento', csv: 'documento', zip: 'documento',
  vcf: 'contacto',
}

function clasificarNombreArchivo(nombre) {
  const base = nombre.replace(/‎/g, '').trim()
  for (const [re, tipo] of PREFIJO_TIPO) if (re.test(base)) return tipo
  const ext = base.includes('.') ? base.split('.').pop().toLowerCase() : ''
  return EXT_TIPO[ext] || 'multimedia'
}

// Mensajes de sistema que NO son de una persona real.
const SISTEMA = [
  'los mensajes y las llamadas están cifrados',
  'messages and calls are end-to-end encrypted',
  'se añadió',
  'añadió a',
  'saliste del grupo',
  'cambió el asunto',
  'cambió la descripción',
  'cambió el ícono',
  'created group',
  'añadiste',
  'cambió su número de teléfono',
]

function detectarOrdenFechas(parejas) {
  // Devuelve true si el formato es DD/MM, false si es MM/DD.
  for (const [a, b] of parejas) {
    if (a > 12) return true // el primero no puede ser mes -> es día
    if (b > 12) return false // el segundo no puede ser mes -> es día
  }
  return true // por defecto DD/MM (formato España)
}

function normalizarHora(h, ampm) {
  if (!ampm) return h
  const esPM = /p/i.test(ampm)
  if (esPM && h < 12) return h + 12
  if (!esPM && h === 12) return 0
  return h
}

function clasificar(texto) {
  const limpio = texto.replace(/‎/g, '').trim()
  // Adjuntos reales (exportación "Con archivos"): clasificamos por el nombre.
  const adj = RE_ADJUNTO_IOS.exec(limpio) || RE_ADJUNTO_ANDROID.exec(limpio)
  if (adj) return clasificarNombreArchivo(adj[1])

  const t = limpio.toLowerCase()
  for (const [tipo, marcas] of Object.entries(MARCADORES)) {
    for (const marca of marcas) {
      if (t.includes(marca)) return tipo
    }
  }
  for (const marca of MULTIMEDIA_GENERICO) {
    if (t.includes(marca)) return 'multimedia'
  }
  return 'texto'
}

function esSistema(texto) {
  const t = texto.toLowerCase()
  return SISTEMA.some((s) => t.includes(s))
}

export function parseChat(contenido) {
  const lineas = contenido.split(/\r?\n/)
  const crudos = []

  let actual = null
  for (const linea of lineas) {
    const m = RE_ANDROID.exec(linea) || RE_IOS.exec(linea)
    if (m) {
      if (actual) crudos.push(actual)
      const [, d1, d2, anio, hh, mm, ss, ampm, autor, texto] = m
      actual = {
        d1: +d1,
        d2: +d2,
        anio: +anio,
        hh: +hh,
        mm: +mm,
        ss: ss ? +ss : 0,
        ampm,
        autor: autor.trim(),
        texto: texto || '',
      }
    } else if (actual) {
      // Continuación de un mensaje multilínea.
      actual.texto += '\n' + linea
    }
  }
  if (actual) crudos.push(actual)

  // Detectar orden de fechas con todos los mensajes.
  const ddmm = detectarOrdenFechas(crudos.map((c) => [c.d1, c.d2]))

  const mensajes = []
  for (const c of crudos) {
    if (esSistema(c.texto)) continue
    const dia = ddmm ? c.d1 : c.d2
    const mes = ddmm ? c.d2 : c.d1
    let anio = c.anio
    if (anio < 100) anio += 2000
    // Descartamos fechas imposibles: si no validamos, JS las "desborda"
    // (p. ej. 31/13 se convierte en una fecha real del año siguiente).
    if (mes < 1 || mes > 12 || dia < 1 || dia > 31) continue
    if (c.hh > 23 || c.mm > 59 || c.ss > 59) continue
    const hora = normalizarHora(c.hh, c.ampm)
    const fecha = new Date(anio, mes - 1, dia, hora, c.mm, c.ss)
    if (isNaN(fecha.getTime()) || fecha.getMonth() !== mes - 1) continue
    mensajes.push({
      fecha,
      autor: c.autor,
      texto: c.texto,
      tipo: clasificar(c.texto),
    })
  }

  return mensajes
}
