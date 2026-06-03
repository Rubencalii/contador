const PALETA = [
  'bg-emerald-500',
  'bg-sky-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-lime-500',
  'bg-fuchsia-500',
  'bg-orange-500',
  'bg-blue-500',
]

const MINI = [
  { tipo: 'imagen', icono: '📷' },
  { tipo: 'audio', icono: '🎤' },
  { tipo: 'video', icono: '🎬' },
  { tipo: 'sticker', icono: '🩹' },
  { tipo: 'gif', icono: '🎞️' },
]

export default function PersonRanking({ personas, total, onSelect }) {
  const max = personas[0]?.total || 1

  return (
    <section className="card p-5 sm:p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
        🏆 Ranking de participantes
      </h2>
      <p className="text-sm text-slate-500">
        {personas.length} personas · haz clic en alguien para ver su ficha
      </p>

      <div className="mt-5 space-y-2">
        {personas.map((p, i) => {
          const pct = ((p.total / total) * 100).toFixed(1)
          const ancho = (p.total / max) * 100
          const color = PALETA[i % PALETA.length]
          return (
            <button
              key={p.autor}
              onClick={() => onSelect?.(p, color)}
              className="block w-full rounded-xl p-2 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500">
                    {i + 1}
                  </span>
                  <span className="truncate font-semibold text-slate-800 dark:text-slate-100">
                    {p.autor}
                  </span>
                </div>
                <div className="shrink-0 text-sm tabular-nums">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {p.total.toLocaleString('es')}
                  </span>
                  <span className="text-slate-400"> · {pct}%</span>
                </div>
              </div>

              <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full ${color} transition-all`}
                  style={{ width: `${ancho}%` }}
                />
              </div>

              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                {MINI.filter((m) => p.tipos[m.tipo] > 0).map((m) => (
                  <span key={m.tipo} className="tabular-nums">
                    {m.icono} {p.tipos[m.tipo].toLocaleString('es')}
                  </span>
                ))}
                {p.emojis > 0 && (
                  <span className="tabular-nums">😀 {p.emojis.toLocaleString('es')}</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
