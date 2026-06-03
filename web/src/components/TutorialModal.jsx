import { useState, useEffect } from 'react'
import { X, Smartphone, MessageSquare, DownloadCloud, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react'

const PASOS = [
  {
    icono: Smartphone,
    titulo: 'Paso 1: Entra al chat',
    desc: 'Abre la aplicación de WhatsApp en tu móvil y entra en el grupo o conversación individual que quieras analizar.',
    color: 'from-blue-400 to-sky-500'
  },
  {
    icono: MessageSquare,
    titulo: 'Paso 2: Opciones del chat',
    desc: 'Toca el nombre del grupo (en la parte superior) para entrar en la info del grupo. Baja del todo y busca la opción "Exportar chat".',
    color: 'from-violet-400 to-purple-500'
  },
  {
    icono: DownloadCloud,
    titulo: 'Paso 3: Exportar sin archivos',
    desc: 'Te preguntará si quieres adjuntar archivos. Es mucho más rápido si eliges "Sin archivos" (.txt). Si eliges "Con archivos" te dará un .zip que también funciona.',
    color: 'from-emerald-400 to-teal-500'
  },
  {
    icono: CheckCircle2,
    titulo: '¡Todo listo!',
    desc: 'Sube ese archivo (.txt o .zip) aquí mismo en la página y la magia ocurrirá al instante. Todo se procesa en tu dispositivo.',
    color: 'from-amber-400 to-orange-500'
  }
]

export default function TutorialModal({ onClose }) {
  const [paso, setPaso] = useState(0)

  // Bloquear scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const infoPaso = PASOS[paso]
  const IconoActual = infoPaso.icono

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-fade-in">
      <div className="card relative w-full max-w-md overflow-hidden bg-white dark:bg-[#0a0a0a] border border-white/20 dark:border-white/10 shadow-2xl animate-card-in">
        
        {/* Decoración de fondo */}
        <div className={`absolute -top-32 -right-32 h-64 w-64 rounded-full bg-gradient-to-br ${infoPaso.color} opacity-20 blur-3xl transition-colors duration-500`} />
        
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 p-4">
          <h3 className="font-bold text-slate-900 dark:text-white">Tutorial rápido</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido principal del paso */}
        <div className="p-8 text-center min-h-[280px] flex flex-col items-center justify-center">
          <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${infoPaso.color} text-white shadow-xl scale-in`}>
            <IconoActual className="h-10 w-10" />
          </div>
          
          <h4 className="text-2xl font-black text-slate-900 dark:text-white slide-up-fade">{infoPaso.titulo}</h4>
          <p className="mt-3 text-slate-600 dark:text-slate-400 font-medium slide-up-fade">{infoPaso.desc}</p>
        </div>

        {/* Paginación / Puntos */}
        <div className="flex justify-center gap-2 mb-4">
          {PASOS.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${i === paso ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-200 dark:bg-slate-700'}`}
            />
          ))}
        </div>

        {/* Botonera de abajo */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 p-4 bg-slate-50/50 dark:bg-black/50">
          <button
            onClick={() => setPaso((p) => Math.max(0, p - 1))}
            className={`flex items-center gap-1 font-semibold text-sm transition-opacity ${paso === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            <ChevronLeft className="h-4 w-4" /> Atrás
          </button>

          {paso < PASOS.length - 1 ? (
            <button
              onClick={() => setPaso((p) => Math.min(PASOS.length - 1, p + 1))}
              className="flex items-center gap-1 rounded-xl bg-slate-900 dark:bg-white px-5 py-2.5 text-sm font-semibold text-white dark:text-slate-900 hover:scale-105 active:scale-95 transition-all shadow-md shadow-slate-900/20 dark:shadow-white/20"
            >
              Siguiente <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:scale-105 hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
            >
              ¡Entendido! <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
