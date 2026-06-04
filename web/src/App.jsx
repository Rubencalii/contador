import { lazy, Suspense, useEffect, useRef, useState } from 'react'
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

  const primeraVez = useRef(true)
  useEffect(() => {
    const root = document.documentElement
    // Solo animamos el cambio de tema, no la carga inicial (evita parpadeo).
    if (!primeraVez.current) {
      root.classList.add('theme-transition')
      window.setTimeout(() => root.classList.remove('theme-transition'), 500)
    }
    primeraVez.current = false
    root.classList.toggle('dark', oscuro)
    localStorage.setItem('tema', oscuro ? 'oscuro' : 'claro')
  }, [oscuro])

  // Tamaños máximos para no colgar el navegador con archivos enormes o un
  // "zip bomb" (un .zip pequeño que se descomprime a varios GB de texto).
  const MAX_ARCHIVO = 15 * 1024 * 1024 * 1024 // 15 GB del archivo subido
  const MAX_TXT = 15 * 1024 * 1024 * 1024 // 15 GB del chat ya descomprimido

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
      setError('El archivo es demasiado grande (máximo 15 GB).')
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
    <div className="relative min-h-screen overflow-x-hidden bg-white dark:bg-[#030712] text-slate-800 dark:text-slate-200 transition-colors">
      {/* Fondo decorativo premium - gradiente radial sutil en el centro arriba */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.1),transparent)] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),transparent)]" />

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
