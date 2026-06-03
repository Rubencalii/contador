import { useInView } from '../hooks/useInView'
import { useCountUp } from '../hooks/useCountUp'

export default function StatCard({ icono: Icon, valor, etiqueta, color = 'emerald', delay = 0 }) {
  const colores = {
    emerald: 'from-emerald-400 to-teal-500 shadow-emerald-500/20',
    sky: 'from-sky-400 to-blue-500 shadow-sky-500/20',
    violet: 'from-violet-400 to-purple-500 shadow-violet-500/20',
    amber: 'from-amber-400 to-orange-500 shadow-amber-500/20',
    rose: 'from-rose-400 to-pink-500 shadow-rose-500/20',
    cyan: 'from-cyan-400 to-teal-500 shadow-cyan-500/20',
  }
  const bgColores = {
    emerald: 'from-emerald-400 to-teal-500',
    sky: 'from-sky-400 to-blue-500',
    violet: 'from-violet-400 to-purple-500',
    amber: 'from-amber-400 to-orange-500',
    rose: 'from-rose-400 to-pink-500',
    cyan: 'from-cyan-400 to-teal-500',
  }
  const [ref, visible] = useInView()
  const animable = typeof valor === 'number'
  const mostrado = useCountUp(animable ? valor : 0, visible)

  return (
    <div
      ref={ref}
      data-reveal
      style={{ animationDelay: `${delay}ms` }}
      className={`card card-hover group relative overflow-hidden p-6 sm:p-7
        ${visible ? 'animate-card-in' : 'opacity-0'}`}
    >
      {/* brillo de fondo difuso más premium */}
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${bgColores[color]} opacity-5 blur-3xl transition-opacity duration-700 group-hover:opacity-20`}
      />
      <div
        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${colores[color]} shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}
      >
        {Icon && <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />}
      </div>
      <div className="text-3xl sm:text-4xl font-black tracking-tighter tabular-nums text-slate-900 dark:text-white">
        {animable ? mostrado.toLocaleString('es') : valor}
      </div>
      <div className="mt-1.5 text-[0.70rem] sm:text-xs font-bold uppercase tracking-widest text-slate-400">{etiqueta}</div>
    </div>
  )
}
