// Prueba de estrés: genera chats de WhatsApp grandes y los pasa por el mismo
// pipeline que usa la web (parseChat -> calcularEstadisticas), midiendo tiempo,
// memoria y, sobre todo, si el navegador podría siquiera crear el string.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { parseChat } from './src/lib/parser.js'
import { calcularEstadisticas } from './src/lib/stats.js'

const MB = 1024 * 1024
const tmp = path.join(os.tmpdir(), 'chat-stress')
fs.mkdirSync(tmp, { recursive: true })

const AUTORES = ['Ana', 'Bruno', 'Carla', 'David', 'Elena', 'Fer', 'Gabi', 'Hugo']
const TEXTOS = [
  'jajaja no me lo puedo creer 😂😂',
  'oye quedamos esta tarde?',
  'vale perfecto, nos vemos a las 7 👍',
  'mirad esto que fuerte',
  'imagen omitida',
  'audio omitido',
  'sticker omitido',
  'buenos dias a todos ☀️ que tal el finde',
  'yo creo que es mejor ir el sabado la verdad porque el domingo hay mucha gente y no me apetece nada',
  '😂😂😂😂',
  'video omitido',
  '<Multimedia omitido>',
  'q hacemos al final?',
  'me han dado el dia libre en el trabajo asi que puedo cuando querais',
]

function pad(n) { return String(n).padStart(2, '0') }

// Genera un .txt de ~targetMB megas en formato Android español.
function generar(targetMB) {
  const file = path.join(tmp, `chat-${targetMB}mb.txt`)
  const ws = fs.createWriteStream(file)
  const objetivo = targetMB * MB
  let escrito = 0
  let i = 0
  // Fecha de arranque: simula 13 años de historia repartiendo i en el tiempo.
  const inicio = new Date(2012, 0, 1).getTime()
  let buf = ''
  while (escrito < objetivo) {
    const autor = AUTORES[i % AUTORES.length]
    const texto = TEXTOS[(i * 7) % TEXTOS.length]
    // Avanzamos ~3 min por mensaje para cubrir años de historia.
    const d = new Date(inicio + i * 3 * 60 * 1000)
    const linea = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())} - ${autor}: ${texto}\n`
    buf += linea
    escrito += Buffer.byteLength(linea)
    i++
    if (buf.length > 4 * MB) { ws.write(buf); buf = '' }
  }
  if (buf) ws.write(buf)
  return new Promise((res) => ws.end(() => res({ file, mensajes: i })))
}

function rssMB() { return Math.round(process.memoryUsage().rss / MB) }

async function probar(targetMB) {
  console.log(`\n=== Chat objetivo: ${targetMB} MB ===`)
  const { file, mensajes } = await generar(targetMB)
  const sizeMB = (fs.statSync(file).size / MB).toFixed(1)
  console.log(`Generado: ${sizeMB} MB en disco, ${mensajes.toLocaleString('es')} mensajes`)

  // 1) Leer TODO como un único string (lo que hace el navegador con file.text()
  //    o JSZip.async('text')). Aquí es donde V8 puede reventar.
  let contenido
  const t0 = Date.now()
  try {
    contenido = fs.readFileSync(file, 'utf8')
  } catch (e) {
    console.log(`❌ NO se puede crear el string: ${e.message}`)
    console.log(`   -> En el navegador la pestaña falla aquí, sin importar el límite de 15 GB.`)
    fs.rmSync(file)
    return
  }
  console.log(`✅ String creado: ${(contenido.length / MB).toFixed(1)} M caracteres (${Date.now() - t0} ms) | RSS ${rssMB()} MB`)

  // 2) Parsear.
  const t1 = Date.now()
  const msgs = parseChat(contenido)
  console.log(`✅ parseChat: ${msgs.length.toLocaleString('es')} mensajes (${Date.now() - t1} ms) | RSS ${rssMB()} MB`)

  // 3) Calcular estadísticas.
  const t2 = Date.now()
  const stats = calcularEstadisticas(msgs)
  console.log(`✅ calcularEstadisticas (${Date.now() - t2} ms) | RSS ${rssMB()} MB`)
  console.log(`   total=${stats.totalMensajes.toLocaleString('es')} personas=${stats.numPersonas} dias=${stats.diasTotales}`)

  fs.rmSync(file)
}

const tamanos = process.argv.slice(2).map(Number)
for (const t of (tamanos.length ? tamanos : [100, 300, 600])) {
  await probar(t)
}
console.log('\nRSS pico final:', rssMB(), 'MB')
