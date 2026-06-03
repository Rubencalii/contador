import { lazy, Suspense, useEffect, useState } from 'react'
import { parseChat } from './lib/parser'
import { calcularEstadisticas } from './lib/stats'
import Header from './components/Header'
import FileUpload from './components/FileUpload'

// El Dashboard arrastra las librerías de gráficos (lo más pesado): lo cargamos
// solo cuando hay estadísticas, así la pantalla inicial pesa mucho menos.
const Dashboard = lazy(() => import('./components/Dashboard'))

export default function App() {
  const [stats, setStats] = useState(null)
  const [nombreArchivo, setNombreArchivo] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [oscuro, setOscuro] = useState(() => {
    const guardado = localStorage.getItem('tema')
    if (guardado) return guardado === 'oscuro'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', oscuro)
    localStorage.setItem('tema', oscuro ? 'oscuro' : 'claro')
  }, [oscuro])

  // Tamaños máximos para no colgar el navegador con archivos enormes o un
  // "zip bomb" (un .zip pequeño que se descomprime a varios GB de texto).
  const MAX_ARCHIVO = 300 * 1024 * 1024 // 300 MB del archivo subido
  const MAX_TXT = 200 * 1024 * 1024 // 200 MB del chat ya descomprimido

  // Abre el .zip exportado por WhatsApp y devuelve el texto del chat (.txt de dentro).
  async function leerTxtDeZip(file) {
    const { default: JSZip } = await import('jszip')
    const zip = await JSZip.loadAsync(file)
    const txts = Object.values(zip.files).filter(
      (f) => !f.dir && f.name.toLowerCase().endsWith('.txt')
    )
    if (!txts.length) {
      throw new Error('El .zip no contiene ningún archivo .txt del chat.')
    }
    // WhatsApp suele llamarlo "_chat.txt"; si no, cogemos el primero.
    const chat =
      txts.find((f) => f.name.toLowerCase().endsWith('_chat.txt')) || txts[0]
    // Comprobamos el tamaño ya descomprimido antes de cargarlo en memoria.
    const tam = chat._data?.uncompressedSize
    if (typeof tam === 'number' && tam > MAX_TXT) {
      throw new Error('El chat dentro del .zip es demasiado grande para procesarlo.')
    }
    return chat.async('text')
  }

  async function procesarArchivo(file) {
    setError('')
    if (file.size > MAX_ARCHIVO) {
      setError('El archivo es demasiado grande (máximo 300 MB).')
      return
    }
    setCargando(true)
    setNombreArchivo(file.name)
    try {
      const esZip =
        file.name.toLowerCase().endsWith('.zip') ||
        file.type === 'application/zip' ||
        file.type === 'application/x-zip-compressed'
      const texto = esZip ? await leerTxtDeZip(file) : await file.text()
      // Pequeño respiro para que se vea el estado de carga.
      await new Promise((r) => setTimeout(r, 50))
      const mensajes = parseChat(texto)
      if (!mensajes.length) {
        setError(
          'No se ha encontrado ningún mensaje. Asegúrate de subir el .txt (o el .zip) exportado desde WhatsApp.'
        )
        setStats(null)
      } else {
        setStats(calcularEstadisticas(mensajes))
      }
    } catch (e) {
      console.error(e)
      setError(e?.message || 'Ha ocurrido un error al leer el archivo.')
    } finally {
      setCargando(false)
    }
  }

  function reiniciar() {
    setStats(null)
    setNombreArchivo('')
    setError('')
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200 transition-colors">
      {/* Fondo decorativo con manchas de color */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-cyan-400/20 dark:bg-cyan-500/10 blur-3xl animate-blob [animation-delay:6s]" />
        <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-violet-400/15 dark:bg-violet-500/10 blur-3xl animate-blob [animation-delay:12s]" />
      </div>

      <Header oscuro={oscuro} onToggle={() => setOscuro((v) => !v)} onLogo={reiniciar} />
      <main className="mx-auto w-full max-w-6xl px-4 pb-20">
        {!stats ? (
          <FileUpload
            onArchivo={procesarArchivo}
            error={error}
            cargando={cargando}
          />
        ) : (
          <Suspense
            fallback={
              <div className="flex flex-col items-center gap-3 py-24">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-500" />
                <p className="font-medium text-slate-500">Preparando las gráficas…</p>
              </div>
            }
          >
            <Dashboard
              stats={stats}
              nombreArchivo={nombreArchivo}
              onReiniciar={reiniciar}
            />
          </Suspense>
        )}
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-sm text-slate-500">
        <p>
          Hecho con 💚 por{' '}
          <a
            href="https://mi-portfolio-black-eight.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            rubencalii
          </a>
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Tus datos nunca salen de tu navegador
        </p>
      </footer>
    </div>
  )
}
