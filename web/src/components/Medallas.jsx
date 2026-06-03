export default function Medallas({ medallas }) {
  if (!medallas?.length) return null
  return (
    <section>
      <h2 className="section-title mb-4">🏅 Medallas del grupo</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {medallas.map((m, i) => (
          <div
            key={i}
            className="flex items-center gap-4 card card-hover p-4"
          >
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-950 dark:to-amber-900 text-3xl">
              {m.icono}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                {m.titulo}
              </div>
              <div className="truncate text-lg font-bold text-slate-900 dark:text-white" title={m.ganador}>
                {m.ganador}
              </div>
              <div className="truncate text-sm text-slate-500">{m.detalle}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
