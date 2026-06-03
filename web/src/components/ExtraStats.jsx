import { formatearDuracion, formatearFecha } from '../lib/stats'

export default function ExtraStats({ stats }) {
  // Ranking de tiempo de respuesta (solo con datos suficientes).
  const tiempos = stats.personas
    .filter((p) => p.respMedio != null && p.respCount >= 5)
    .sort((a, b) => a.respMedio - b.respMedio)
    .slice(0, 6)

  const risas = stats.personas
    .filter((p) => p.risas > 0)
    .sort((a, b) => b.risas - a.risas)
    .slice(0, 6)

  return (
    <section className="space-y-4">
      <h2 className="section-title">🔬 Análisis avanzado</h2>

      {/* Tarjetas destacadas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Destacada
          icono="🔗"
          titulo="Pareja inseparable"
          valor={stats.topPareja ? `${stats.topPareja.a} & ${stats.topPareja.b}` : '—'}
          detalle={
            stats.topPareja
              ? `${stats.topPareja.valor.toLocaleString('es')} interacciones`
              : 'sin datos'
          }
        />
        <Destacada
          icono="📿"
          titulo="Racha más larga"
          valor={`${stats.rachaMax.toLocaleString('es')} días`}
          detalle={
            stats.rachaInicio
              ? `${formatearFecha(stats.rachaInicio)} → ${formatearFecha(stats.rachaFin)}`
              : ''
          }
        />
        <Destacada
          icono="😂"
          titulo="Risas totales"
          valor={stats.totalRisas.toLocaleString('es')}
          detalle="mensajes con jaja/😂"
        />
        <Destacada
          icono="🗑️"
          titulo="Mensajes borrados"
          valor={stats.totalEliminados.toLocaleString('es')}
          detalle="se arrepintieron 😏"
        />
      </div>

      {/* Leaderboards */}
      <div className="grid gap-4 lg:grid-cols-2">
        <MiniRanking
          titulo="⚡ Quién responde más rápido"
          vacio="No hay suficientes respuestas para calcularlo."
          items={tiempos.map((p) => ({
            nombre: p.autor,
            valor: formatearDuracion(p.respMedio),
          }))}
        />
        <MiniRanking
          titulo="😂 Quién se ríe más"
          vacio="Nadie se ha reído todavía 😐"
          items={risas.map((p) => ({
            nombre: p.autor,
            valor: `${p.risas.toLocaleString('es')} veces`,
          }))}
        />
      </div>
    </section>
  )
}

function Destacada({ icono, titulo, valor, detalle }) {
  return (
    <div className="card card-hover p-4">
      <div className="text-2xl">{icono}</div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {titulo}
      </div>
      <div className="truncate text-lg font-bold text-slate-900 dark:text-white" title={valor}>
        {valor}
      </div>
      <div className="truncate text-sm text-slate-500">{detalle}</div>
    </div>
  )
}

function MiniRanking({ titulo, items, vacio }) {
  return (
    <div className="card p-5">
      <h3 className="font-bold text-slate-900 dark:text-white">{titulo}</h3>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">{vacio}</p>
      ) : (
        <ol className="mt-3 space-y-2">
          {items.map((it, i) => (
            <li key={i} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-2 min-w-0">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500">
                  {i + 1}
                </span>
                <span className="truncate font-medium text-slate-700 dark:text-slate-200">
                  {it.nombre}
                </span>
              </span>
              <span className="shrink-0 font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                {it.valor}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
