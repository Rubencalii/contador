import { useRef, useState } from 'react'

export default function FileUpload({ onArchivo, error, cargando }) {
  const inputRef = useRef(null)
  const [arrastrando, setArrastrando] = useState(false)

  function manejarFiles(files) {
    const file = files?.[0]
    if (file) onArchivo(file)
  }

  return (
    <div className="py-10 sm:py-16">
      {/* Hero */}
      <div className="mx-auto max-w-2xl text-center animate-fade-in-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/50 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300">
          🔒 100% privado · sin servidores
        </span>
        <h1 className="mt-5 text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Estadísticas de tu grupo de{' '}
          <span className="text-gradient">WhatsApp</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Descubre quién habla más, cuántas fotos y audios se mandan, los emojis
          favoritos del grupo y datos curiosos. Todo se procesa en tu navegador.
        </p>
      </div>

      {/* Zona de subida */}
      <div className="mx-auto mt-10 max-w-2xl">
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
          className={`group cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center transition
            ${
              arrastrando
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 scale-[1.01]'
                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-emerald-400'
            }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".txt,.zip"
            className="hidden"
            onChange={(e) => manejarFiles(e.target.files)}
          />
          {cargando ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-500" />
              <p className="font-medium">Analizando el chat…</p>
            </div>
          ) : (
            <>
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500 text-3xl text-white shadow-lg group-hover:scale-110 transition">
                ⬆️
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

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            ⚠️ {error}
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
