import { useRef, useState } from 'react'
import { Lock, UploadCloud } from 'lucide-react'

export default function FileUpload({ onArchivo, error, cargando }) {
  const inputRef = useRef(null)
  const [arrastrando, setArrastrando] = useState(false)

  const [avisoTipo, setAvisoTipo] = useState('')

  function manejarFiles(files) {
    const file = files?.[0]
    if (!file) return
    // El botón ya filtra por extensión, pero al arrastrar se puede soltar
    // cualquier cosa: validamos aquí para dar un aviso claro.
    const nombre = file.name.toLowerCase()
    if (!nombre.endsWith('.txt') && !nombre.endsWith('.zip')) {
      setAvisoTipo('Ese archivo no vale. Sube el .txt o el .zip que exporta WhatsApp.')
      return
    }
    setAvisoTipo('')
    onArchivo(file)
  }

  return (
    <div className="py-14 sm:py-24">
      {/* Hero */}
      <div className="relative mx-auto max-w-2xl text-center animate-fade-in-up">
        {/* Malla de gradiente animada de fondo */}
        <div
          aria-hidden
          className="hero-mesh pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[150%] w-[150%] opacity-70 dark:opacity-50"
        />
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-emerald-600 dark:text-emerald-400 backdrop-blur-md shadow-sm">
          <Lock className="h-4 w-4" /> 100% privado · sin servidores
        </span>
        <h1 className="mt-6 text-5xl sm:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
          Estadísticas de tu grupo de{' '}
          <span className="text-gradient drop-shadow-sm">WhatsApp</span>
        </h1>
        <p className="mt-5 text-lg text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto">
          Descubre quién habla más, cuántas fotos y audios se mandan, los emojis
          favoritos del grupo y datos curiosos. Todo se procesa en tu navegador.
        </p>
      </div>

      {/* Zona de subida */}
      <div className="mx-auto mt-12 max-w-2xl">
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setArrastrando(true)
          }}
          onDragLeave={() => setArrastrando(false)}
          onDrop={(e) => {
            e.preventDefault()
            setArrastrando(false)
            manejarFiles(e.dataTransfer.files)
          }}
          onClick={() => inputRef.current?.click()}
          className={`group cursor-pointer rounded-[2rem] border-2 border-dashed p-12 text-center transition-all duration-500 relative
            ${
              arrastrando
                ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 scale-[1.02] shadow-[0_0_40px_rgba(16,185,129,0.2)]'
                : 'border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 hover:border-emerald-400 hover:bg-white/80 dark:hover:bg-slate-900/80 backdrop-blur-xl'
            }`}
        >
          {arrastrando && <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_0_20px_rgba(16,185,129,0.2)] pointer-events-none" />}
          <input
            ref={inputRef}
            type="file"
            accept=".txt,.zip"
            className="hidden"
            onChange={(e) => manejarFiles(e.target.files)}
          />
          {cargando ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-500 relative">
                <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center"></div>
              </div>
              <p className="font-bold tracking-tight text-lg text-emerald-600 dark:text-emerald-400">Analizando el chat…</p>
            </div>
          ) : (
            <>
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-xl shadow-emerald-500/20 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500">
                <UploadCloud className="h-8 w-8" strokeWidth={2.5} />
              </div>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Arrastra aquí tu archivo <code className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-sm">.txt</code> o <code className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-sm">.zip</code>
              </p>
              <p className="mt-1 text-sm text-slate-500">
                o haz clic para seleccionarlo
              </p>
            </>
          )}
        </div>

        {(error || avisoTipo) && (
          <div className="mt-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            ⚠️ {avisoTipo || error}
          </div>
        )}
      </div>

      {/* Cómo exportar */}
      <div className="mx-auto mt-12 max-w-3xl">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-slate-500">
          Cómo conseguir el archivo
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            {
              n: '1',
              t: 'Abre el grupo',
              d: 'En WhatsApp, entra al grupo y pulsa el menú (⋮) o el nombre del grupo.',
            },
            {
              n: '2',
              t: 'Exportar chat',
              d: 'Elige “Exportar chat” → “Sin archivos” (.txt) o “Con archivos” (.zip). Las dos valen.',
            },
            {
              n: '3',
              t: 'Sube el archivo',
              d: 'Tráelo aquí y arrástralo a la zona de arriba: acepta tanto el .txt como el .zip.',
            },
          ].map((p) => (
            <div
              key={p.n}
              className="card card-hover p-5"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 dark:bg-emerald-950 font-bold text-emerald-600 dark:text-emerald-400">
                {p.n}
              </span>
              <h3 className="mt-3 font-semibold text-slate-800 dark:text-slate-100">
                {p.t}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
