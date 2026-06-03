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
  const t = texto
    .toLowerCase()
    .replace(/‎/g, '')
    .trim()
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
    const hora = normalizarHora(c.hh, c.ampm)
    const fecha = new Date(anio, mes - 1, dia, hora, c.mm, c.ss)
    if (isNaN(fecha.getTime())) continue
    mensajes.push({
      fecha,
      autor: c.autor,
      texto: c.texto,
      tipo: clasificar(c.texto),
    })
  }

  return mensajes
}
