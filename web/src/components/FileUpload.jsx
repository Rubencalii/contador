import { useRef, useState } from 'react'
import { Lock, UploadCloud, HelpCircle } from 'lucide-react'
import TutorialModal from './TutorialModal'

export default function FileUpload({ onArchivo, error, cargando }) {
  const inputRef = useRef(null)
  const [arrastrando, setArrastrando] = useState(false)
  const [avisoTipo, setAvisoTipo] = useState('')
  const [mostrarTutorial, setMostrarTutorial] = useState(false)

  function manejarFiles(files) {
    const file = files?.[0]
    if (!file) return
    const nombre = file.name.toLowerCase()
    if (!nombre.endsWith('.txt') && !nombre.endsWith('.zip')) {
      setAvisoTipo('Ese archivo no vale. Sube el .txt o el .zip que exporta WhatsApp.')
      return
    }
    setAvisoTipo('')
    onArchivo(file)
  }

  return (
    <div className="py-14 sm:py-24 relative">
      
      {/* 3D Assets Backgrounds */}
      <div className="absolute top-10 right-0 lg:right-20 w-64 lg:w-96 opacity-30 dark:opacity-60 pointer-events-none -z-10 animate-float">
        <img src="/orb.png" alt="" className="hidden dark:block w-full h-auto mix-blend-screen" />
        <img src="/orb_light.png" alt="" className="block dark:hidden w-full h-auto mix-blend-multiply opacity-30" />
      </div>
      <div className="absolute top-40 left-0 lg:left-20 w-48 lg:w-64 opacity-20 dark:opacity-40 pointer-events-none -z-10 animate-float-delayed">
        <img src="/shapes.png" alt="" className="hidden dark:block w-full h-auto mix-blend-screen" />
        <img src="/shapes_light.png" alt="" className="block dark:hidden w-full h-auto mix-blend-multiply opacity-30" />
      </div>

      {/* Hero */}
      <div className="relative mx-auto max-w-2xl text-center animate-fade-in-up">
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

        {/* Tutorial Button (Replaces the static cards) */}
        <div className="mt-8">
          <button 
            onClick={() => setMostrarTutorial(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <HelpCircle className="h-5 w-5 text-amber-500" /> ¿Cómo descargo mi chat de WhatsApp?
          </button>
        </div>
      </div>

      {/* Zona de subida (Glassmorphism Premium) */}
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
          className={`group cursor-pointer rounded-[3rem] p-12 text-center transition-all duration-500 relative border overflow-hidden
            ${
              arrastrando
                ? 'border-emerald-400 bg-emerald-50/90 dark:bg-[#0a0a0a]/90 scale-[1.02] shadow-[0_0_50px_rgba(16,185,129,0.3)] backdrop-blur-2xl'
                : 'border-white/30 dark:border-white/10 bg-white/60 dark:bg-[#0a0a0a]/60 hover:border-emerald-400/50 hover:bg-white/90 dark:hover:bg-[#111111]/90 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]'
            }`}
        >
          {arrastrando && <div className="absolute inset-0 rounded-[3rem] shadow-[inset_0_0_30px_rgba(16,185,129,0.2)] pointer-events-none" />}
          
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
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-xl shadow-emerald-500/30 group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-3 transition-all duration-500">
                <UploadCloud className="h-10 w-10" strokeWidth={2.5} />
              </div>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Arrastra aquí tu archivo <code className="rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-1 text-base">.txt</code> o <code className="rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-1 text-base">.zip</code>
              </p>
              <p className="mt-3 text-base font-medium text-slate-500">
                o haz clic para seleccionarlo
              </p>
            </>
          )}
        </div>

        {(error || avisoTipo) && (
          <div className="mt-6 rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50 px-5 py-4 text-sm font-semibold text-red-700 dark:text-red-300 shadow-sm animate-fade-in-up">
            ⚠️ {avisoTipo || error}
          </div>
        )}
      </div>

      {mostrarTutorial && <TutorialModal onClose={() => setMostrarTutorial(false)} />}
    </div>
  )
}
