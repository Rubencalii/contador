import { useInView } from '../hooks/useInView'
import { useCountUp } from '../hooks/useCountUp'

export default function StatCard({ icono, valor, etiqueta, color = 'emerald', delay = 0 }) {
  const colores = {
    emerald: 'from-emerald-500 to-teal-500',
    sky: 'from-sky-500 to-blue-500',
    violet: 'from-violet-500 to-purple-500',
    amber: 'from-amber-500 to-orange-500',
    rose: 'from-rose-500 to-pink-500',
    cyan: 'from-cyan-500 to-teal-500',
  }
  const [ref, visible] = useInView()
  const animable = typeof valor === 'number'
  const mostrado = useCountUp(animable ? valor : 0, visible)

  return (
    <div
      ref={ref}
      data-reveal
      style={{ animationDelay: `${delay}ms` }}
      className={`card card-hover group relative overflow-hidden p-4 sm:p-5
        ${visible ? 'animate-card-in' : 'opacity-0'}`}
    >
      {/* brillo de fondo del color al hacer hover */}
      <div
        className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${colores[color]} opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-25`}
      />
      <div
        className={`mb-3 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${colores[color]} text-lg text-white shadow-md transition-transform duration-300 group-hover:scale-110`}
      >
        {icono}
      </div>
      <div className="text-2xl sm:text-3xl font-extrabold tabular-nums text-slate-900 dark:text-white">
        {animable ? mostrado.toLocaleString('es') : valor}
      </div>
      <div className="mt-0.5 text-sm font-medium text-slate-500">{etiqueta}</div>
    </div>
  )
}
