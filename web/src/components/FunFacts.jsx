export default function FunFacts({ curiosidades }) {
  return (
    <section>
      <h2 className="section-title mb-4">✨ Datos curiosos</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {curiosidades.map((c, i) => (
          <div
            key={i}
            className="card card-hover bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 p-5"
          >
            <div className="text-3xl">{c.icono}</div>
            <div className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {c.titulo}
            </div>
            <div className="mt-0.5 truncate text-lg font-bold text-slate-900 dark:text-white" title={c.valor}>
              {c.valor}
            </div>
            <div className="text-sm text-slate-500">{c.detalle}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
