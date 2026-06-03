// Cálculo de estadísticas a partir de los mensajes parseados.

const TIPOS = [
  'texto',
  'imagen',
  'video',
  'audio',
  'sticker',
  'gif',
  'documento',
  'contacto',
  'ubicacion',
  'eliminado',
  'multimedia',
]

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

// Palabras vacías (no aportan info) que ignoramos en el ranking de palabras.
const STOPWORDS = new Set(
  `de la que el en y a los del se las por un para con no una su al lo como mas pero sus le ya o este si porque esta entre cuando muy sin sobre tambien me hasta hay donde quien desde todo nos durante todos uno les ni contra otros ese eso ante ellos e esto mi antes algunos que unos yo otro otras otra el tanto esa estos mucho quienes nada muchos cual poco ella estar estas algunas algo nosotros mi mis tu te ti tu tus ellas nosotras vosotros vosotras os mio mia mios mias tuyo tuya tuyos tuyas suyo suya suyos suyas nuestro nuestra nuestros nuestras vuestro vuestra vuestros vuestras esos esas esta estoy estas esta estamos estais estan este pues tan asi va ser son fue era ha he has han hace hacer voy vas vamos solo q d x pa xq porfa jaja jajaja jeje vale ok bien gracias hola buenas`
    .split(/\s+/)
    .filter(Boolean)
)

// Detección de risas.
const RE_RISA = /(?:j[aeiou]){2,}|(?:a?h){2,}|😂|🤣|\blol\b|\blmao\b|\bxd+\b/i

// Segmentador para contar emojis respetando secuencias (ZWJ, tonos de piel...).
const segmenter =
  typeof Intl !== 'undefined' && Intl.Segmenter
    ? new Intl.Segmenter('es', { granularity: 'grapheme' })
    : null

const RE_PICTO = /\p{Extended_Pictographic}/u

function extraerEmojis(texto) {
  const out = []
  if (segmenter) {
    for (const { segment } of segmenter.segment(texto)) {
      if (RE_PICTO.test(segment)) out.push(segment)
    }
  } else {
    const m = texto.match(/\p{Extended_Pictographic}/gu)
    if (m) out.push(...m)
  }
  return out
}

function nuevoContadorTipos() {
  const o = {}
  for (const t of TIPOS) o[t] = 0
  return o
}

export function calcularEstadisticas(mensajes) {
  if (!mensajes.length) return null

  // Usamos Object.create(null) en los mapas indexados por datos del chat
  // (autor, emoji, palabra...) para evitar "prototype pollution": un autor
  // llamado "__proto__" o "constructor" colisionaría con el prototipo de un
  // objeto normal y rompería el cálculo.
  const personas = Object.create(null) // autor -> stats
  const totalTipos = nuevoContadorTipos()
  const porHora = Array(24).fill(0)
  const porDiaSemana = Array(7).fill(0)
  const porFecha = Object.create(null) // 'YYYY-MM-DD' -> count
  const porMes = Object.create(null) // 'YYYY-MM' -> count
  const emojisGlobal = Object.create(null)
  const palabrasGlobal = Object.create(null)
  const heatmap = Array.from({ length: 7 }, () => Array(24).fill(0)) // [dia][hora]
  const parejas = Object.create(null) // 'A||B' -> nº de intercambios

  let totalEmojis = 0
  let totalPalabras = 0
  let totalRisas = 0
  let totalEliminados = 0
  const mensajeMasLargo = { autor: null, longitud: 0, texto: '' }

  // Ordenar por fecha para detectar inicios de conversación y respuestas.
  const orden = [...mensajes].sort((a, b) => a.fecha - b.fecha)
  const GAP_CONVERSACION = 6 * 60 * 60 * 1000 // 6 horas
  const GAP_RESPUESTA = 3 * 60 * 60 * 1000 // 3 horas (máx. para contar como respuesta)
  let anterior = null // mensaje anterior

  for (const msg of orden) {
    const { autor, tipo, texto, fecha } = msg

    if (!personas[autor]) {
      personas[autor] = {
        autor,
        total: 0,
        tipos: nuevoContadorTipos(),
        emojis: 0,
        palabras: 0,
        caracteres: 0,
        textos: 0,
        risas: 0,
        eliminados: 0,
        emojisTop: Object.create(null),
        palabrasTop: Object.create(null),
        iniciosConversacion: 0,
        horas: Array(24).fill(0),
        diasSemana: Array(7).fill(0),
        respSum: 0,
        respCount: 0,
        primeraFecha: fecha,
        ultimaFecha: fecha,
      }
    }
    const p = personas[autor]

    p.total += 1
    p.tipos[tipo] += 1
    totalTipos[tipo] += 1
    p.ultimaFecha = fecha
    if (tipo === 'eliminado') {
      p.eliminados += 1
      totalEliminados += 1
    }

    // Actividad temporal.
    const h = fecha.getHours()
    porHora[h] += 1
    p.horas[h] += 1
    // getDay(): 0=Dom..6=Sáb -> reordenamos a Lun..Dom (0..6)
    const ds = (fecha.getDay() + 6) % 7
    porDiaSemana[ds] += 1
    p.diasSemana[ds] += 1
    heatmap[ds][h] += 1

    const claveFecha = fechaISO(fecha)
    porFecha[claveFecha] = (porFecha[claveFecha] || 0) + 1
    const claveMes = claveFecha.slice(0, 7)
    porMes[claveMes] = (porMes[claveMes] || 0) + 1

    // Inicio de conversación / respuesta / quién habla con quién.
    if (!anterior || fecha - anterior.fecha > GAP_CONVERSACION) {
      p.iniciosConversacion += 1
    } else if (anterior.autor !== autor) {
      const gap = fecha - anterior.fecha
      if (gap <= GAP_RESPUESTA) {
        p.respSum += gap
        p.respCount += 1
        const clave = [autor, anterior.autor].sort().join('||')
        parejas[clave] = (parejas[clave] || 0) + 1
      }
    }
    anterior = msg

    // Solo analizamos texto real para emojis/palabras/risas/longitud.
    if (tipo === 'texto') {
      p.textos += 1
      p.caracteres += texto.length
      if (texto.length > mensajeMasLargo.longitud) {
        mensajeMasLargo.autor = autor
        mensajeMasLargo.longitud = texto.length
        mensajeMasLargo.texto = texto
      }

      if (RE_RISA.test(texto)) {
        p.risas += 1
        totalRisas += 1
      }

      const emojis = extraerEmojis(texto)
      p.emojis += emojis.length
      totalEmojis += emojis.length
      for (const e of emojis) {
        emojisGlobal[e] = (emojisGlobal[e] || 0) + 1
        p.emojisTop[e] = (p.emojisTop[e] || 0) + 1
      }

      const palabras = texto
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 2 && !STOPWORDS.has(w) && !/^\d+$/.test(w))
      p.palabras += palabras.length
      totalPalabras += palabras.length
      for (const w of palabras) {
        palabrasGlobal[w] = (palabrasGlobal[w] || 0) + 1
        p.palabrasTop[w] = (p.palabrasTop[w] || 0) + 1
      }
    }
  }

  // Procesar derivados por persona.
  const listaPersonas = Object.values(personas).sort((a, b) => b.total - a.total)
  for (const p of listaPersonas) {
    p.respMedio = p.respCount ? Math.round(p.respSum / p.respCount / 1000) : null // segundos
    p.mediaCaracteres = p.textos ? Math.round(p.caracteres / p.textos) : 0
    p.topEmojis = top(p.emojisTop, 8)
    p.topPalabras = top(p.palabrasTop, 10)
    p.multimedia =
      p.tipos.imagen +
      p.tipos.video +
      p.tipos.audio +
      p.tipos.sticker +
      p.tipos.gif +
      p.tipos.documento +
      p.tipos.multimedia
  }

  // Serie temporal por día (rellenando huecos para la gráfica).
  const serieDias = construirSerieDias(porFecha)
  const serieMeses = Object.entries(porMes)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([mes, n]) => ({ etiqueta: mes, valor: n }))

  const fechas = orden.map((m) => m.fecha)
  const primeraFecha = fechas[0]
  const ultimaFecha = fechas[fechas.length - 1]
  const diasTotales = Math.max(
    1,
    Math.round((ultimaFecha - primeraFecha) / (24 * 60 * 60 * 1000)) + 1
  )

  // Día récord.
  let diaRecord = { fecha: null, valor: 0 }
  for (const [f, n] of Object.entries(porFecha)) {
    if (n > diaRecord.valor) diaRecord = { fecha: f, valor: n }
  }

  // Racha más larga de días seguidos con mensajes.
  const { rachaMax, rachaInicio, rachaFin } = calcularRacha(porFecha)
  const diasActivos = Object.keys(porFecha).length

  // Pareja que más habla entre sí.
  let topPareja = null
  for (const [clave, valor] of Object.entries(parejas)) {
    if (!topPareja || valor > topPareja.valor) {
      const [a, b] = clave.split('||')
      topPareja = { a, b, valor }
    }
  }

  const medallas = calcularMedallas(listaPersonas)

  const curiosidades = construirCuriosidades(
    listaPersonas,
    diaRecord,
    mensajeMasLargo,
    diasTotales,
    mensajes.length
  )

  const maximosGrupo = {
    total: 1,
    imagen: 1,
    audio: 1,
    sticker: 1,
    emojis: 1,
    palabras: 1,
    risas: 1,
  }
  for (const p of listaPersonas) {
    if (p.total > maximosGrupo.total) maximosGrupo.total = p.total
    if (p.tipos.imagen > maximosGrupo.imagen) maximosGrupo.imagen = p.tipos.imagen
    if (p.tipos.audio > maximosGrupo.audio) maximosGrupo.audio = p.tipos.audio
    if (p.tipos.sticker > maximosGrupo.sticker) maximosGrupo.sticker = p.tipos.sticker
    if (p.emojis > maximosGrupo.emojis) maximosGrupo.emojis = p.emojis
    if (p.palabras > maximosGrupo.palabras) maximosGrupo.palabras = p.palabras
    if (p.risas > maximosGrupo.risas) maximosGrupo.risas = p.risas
  }

  return {
    totalMensajes: mensajes.length,
    totalTipos,
    totalEmojis,
    totalPalabras,
    totalRisas,
    totalEliminados,
    numPersonas: listaPersonas.length,
    personas: listaPersonas,
    porHora,
    porDiaSemana: porDiaSemana.map((v, i) => ({ etiqueta: DIAS_SEMANA[i], valor: v })),
    serieDias,
    serieMeses,
    porFecha,
    heatmap,
    topEmojis: top(emojisGlobal, 12),
    topPalabras: top(palabrasGlobal, 15),
    primeraFecha,
    ultimaFecha,
    diasTotales,
    diasActivos,
    mediaPorDia: Math.round(mensajes.length / diasTotales),
    diaRecord,
    rachaMax,
    rachaInicio,
    rachaFin,
    topPareja,
    medallas,
    curiosidades,
    maximosGrupo,
  }
}

function fechaISO(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

function construirSerieDias(porFecha) {
  const claves = Object.keys(porFecha).sort()
  if (!claves.length) return []
  const inicio = new Date(claves[0])
  const fin = new Date(claves[claves.length - 1])
  const serie = []
  const cur = new Date(inicio)
  const dias = Math.round((fin - inicio) / (24 * 60 * 60 * 1000))
  const agregarSemanal = dias > 400
  while (cur <= fin) {
    const clave = fechaISO(cur)
    serie.push({ etiqueta: clave, valor: porFecha[clave] || 0 })
    cur.setDate(cur.getDate() + 1)
  }
  if (!agregarSemanal) return serie
  const semanal = []
  for (let i = 0; i < serie.length; i += 7) {
    const trozo = serie.slice(i, i + 7)
    const valor = trozo.reduce((s, x) => s + x.valor, 0)
    semanal.push({ etiqueta: trozo[0].etiqueta, valor })
  }
  return semanal
}

function calcularRacha(porFecha) {
  const claves = Object.keys(porFecha).sort()
  if (!claves.length) return { rachaMax: 0, rachaInicio: null, rachaFin: null }
  let mejor = 1
  let actual = 1
  let mejorFin = claves[0]
  let inicioActual = claves[0]
  let mejorInicio = claves[0]
  for (let i = 1; i < claves.length; i++) {
    const prev = new Date(claves[i - 1])
    const cur = new Date(claves[i])
    const diff = Math.round((cur - prev) / (24 * 60 * 60 * 1000))
    if (diff === 1) {
      actual += 1
    } else {
      actual = 1
      inicioActual = claves[i]
    }
    if (actual > mejor) {
      mejor = actual
      mejorFin = claves[i]
      mejorInicio = inicioActual
    }
  }
  return { rachaMax: mejor, rachaInicio: mejorInicio, rachaFin: mejorFin }
}

function top(obj, n) {
  return Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([clave, valor]) => ({ clave, valor }))
}

// ---- Medallas / premios divertidos ----
function calcularMedallas(personas) {
  const medallas = []
  const varios = personas.length >= 2

  const maxPor = (fn) => {
    let mejor = null
    for (const p of personas) {
      const v = fn(p)
      if (v > 0 && (!mejor || v > mejor.v)) mejor = { p, v }
    }
    return mejor
  }
  const minPor = (fn, filtro = () => true) => {
    let mejor = null
    for (const p of personas) {
      if (!filtro(p)) continue
      const v = fn(p)
      if (!mejor || v < mejor.v) mejor = { p, v }
    }
    return mejor
  }

  const add = (icono, titulo, ganador, detalle) => {
    if (ganador) medallas.push({ icono, titulo, ganador: ganador.p.autor, detalle })
  }

  const masActivo = maxPor((p) => p.total)
  add('🔥', 'El más activo', masActivo, masActivo && `${masActivo.v.toLocaleString('es')} mensajes`)

  if (varios) {
    const fantasma = minPor((p) => p.total)
    add('👻', 'El fantasma', fantasma, fantasma && `solo ${fantasma.v.toLocaleString('es')} mensajes`)
  }

  const fotografo = maxPor((p) => p.tipos.imagen)
  add('📸', 'El fotógrafo', fotografo, fotografo && `${fotografo.v.toLocaleString('es')} imágenes`)

  const locutor = maxPor((p) => p.tipos.audio)
  add('🎙️', 'El locutor', locutor, locutor && `${locutor.v.toLocaleString('es')} audios`)

  const payaso = maxPor((p) => p.risas)
  add('🤡', 'El payaso', payaso, payaso && `se ríe en ${payaso.v.toLocaleString('es')} mensajes`)

  const emojiKing = maxPor((p) => p.emojis)
  add('😍', 'Rey del emoji', emojiKing, emojiKing && `${emojiKing.v.toLocaleString('es')} emojis`)

  const buho = maxPor((p) => p.horas.slice(0, 6).reduce((s, x) => s + x, 0))
  add('🦉', 'Búho nocturno', buho, buho && `${buho.v.toLocaleString('es')} mensajes de madrugada`)

  const madrugador = maxPor((p) => p.horas.slice(5, 9).reduce((s, x) => s + x, 0))
  add('🌅', 'Madrugador', madrugador, madrugador && `${madrugador.v.toLocaleString('es')} mensajes a primera hora`)

  const rompehielos = maxPor((p) => p.iniciosConversacion)
  add('🚀', 'Rompehielos', rompehielos, rompehielos && `inicia ${rompehielos.v.toLocaleString('es')} conversaciones`)

  const rapido = minPor((p) => p.respMedio, (p) => p.respMedio != null && p.respCount >= 5)
  add('⚡', 'El más rápido', rapido, rapido && `responde en ${formatearDuracion(rapido.v)}`)

  const lento = maxPor((p) => (p.respCount >= 5 ? p.respMedio : 0))
  if (lento && lento.p !== (rapido && rapido.p))
    add('🐢', 'Deja en visto', lento, `tarda ${formatearDuracion(lento.v)} en responder`)

  const escritor = maxPor((p) => (p.textos >= 5 ? p.mediaCaracteres : 0))
  add('📝', 'El escritor', escritor, escritor && `${escritor.v} caracteres por mensaje`)

  const arrepentido = maxPor((p) => p.eliminados)
  add('🗑️', 'El arrepentido', arrepentido, arrepentido && `${arrepentido.v.toLocaleString('es')} mensajes borrados`)

  const sticker = maxPor((p) => p.tipos.sticker)
  add('🩹', 'Rey del sticker', sticker, sticker && `${sticker.v.toLocaleString('es')} stickers`)

  return medallas
}

export function formatearDuracion(seg) {
  if (seg == null) return '—'
  if (seg < 60) return `${seg} s`
  const min = Math.round(seg / 60)
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} h ${m} min` : `${h} h`
}

function construirCuriosidades(personas, diaRecord, mensajeMasLargo, diasTotales, total) {
  const cur = []
  let buho = { autor: null, valor: 0 }
  let madrugador = { autor: null, valor: 0 }
  let parlanchin = personas[0]
  let emojiLover = { autor: null, valor: 0 }
  for (const p of personas) {
    const noche = p.horas.slice(0, 6).reduce((s, x) => s + x, 0)
    if (noche > buho.valor) buho = { autor: p.autor, valor: noche }
    const manana = p.horas.slice(5, 9).reduce((s, x) => s + x, 0)
    if (manana > madrugador.valor) madrugador = { autor: p.autor, valor: manana }
    const ratioEmoji = p.total ? p.emojis / p.total : 0
    if (ratioEmoji > emojiLover.valor) emojiLover = { autor: p.autor, valor: ratioEmoji }
  }
  const iniciador = [...personas].sort(
    (a, b) => b.iniciosConversacion - a.iniciosConversacion
  )[0]

  if (parlanchin)
    cur.push({ icono: '🗣️', titulo: 'El más hablador', valor: parlanchin.autor, detalle: `${parlanchin.total.toLocaleString('es')} mensajes` })
  if (buho.autor)
    cur.push({ icono: '🦉', titulo: 'Búho nocturno', valor: buho.autor, detalle: `${buho.valor} mensajes de 00:00 a 06:00` })
  if (madrugador.autor)
    cur.push({ icono: '🌅', titulo: 'Madrugador', valor: madrugador.autor, detalle: `${madrugador.valor} mensajes de 05:00 a 09:00` })
  if (iniciador)
    cur.push({ icono: '🚀', titulo: 'Rompe el hielo', valor: iniciador.autor, detalle: `inicia ${iniciador.iniciosConversacion} conversaciones` })
  if (emojiLover.autor)
    cur.push({ icono: '😍', titulo: 'Amante de los emojis', valor: emojiLover.autor, detalle: `${emojiLover.valor.toFixed(1)} emojis por mensaje` })
  if (diaRecord.fecha)
    cur.push({ icono: '🔥', titulo: 'Día récord', valor: formatearFecha(diaRecord.fecha), detalle: `${diaRecord.valor.toLocaleString('es')} mensajes en un día` })
  if (mensajeMasLargo.autor)
    cur.push({ icono: '📝', titulo: 'El testamento', valor: mensajeMasLargo.autor, detalle: `mensaje de ${mensajeMasLargo.longitud.toLocaleString('es')} caracteres` })
  cur.push({ icono: '📅', titulo: 'Media diaria', valor: `${Math.round(total / diasTotales).toLocaleString('es')} msg/día`, detalle: `durante ${diasTotales.toLocaleString('es')} días` })

  return cur
}

export function formatearFecha(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
