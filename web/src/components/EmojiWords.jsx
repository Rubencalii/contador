export default function EmojiWords({ stats }) {
  const maxEmoji = stats.topEmojis[0]?.valor || 1
  const maxPalabra = stats.topPalabras[0]?.valor || 1

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Emojis */}
      <section className="card p-5 sm:p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          😂 Emojis más usados
        </h2>
        <p className="text-sm text-slate-500">
          {stats.totalEmojis.toLocaleString('es')} emojis en total
        </p>

        {stats.topEmojis.length === 0 ? (
          <p className="mt-6 text-sm text-slate-400">No se han usado emojis 🤔</p>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-2">
            {stats.topEmojis.map((e, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-2xl leading-none">{e.clave}</span>
                <div className="min-w-0 flex-1">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                      style={{ width: `${(e.valor / maxEmoji) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="w-10 text-right text-sm font-semibold tabular-nums text-slate-500">
                  {e.valor.toLocaleString('es')}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Palabras */}
      <section className="card p-5 sm:p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          🔤 Palabras más repetidas
        </h2>
        <p className="text-sm text-slate-500">excluyendo palabras comunes</p>

        {stats.topPalabras.length === 0 ? (
          <p className="mt-6 text-sm text-slate-400">Sin datos suficientes</p>
        ) : (
          <div className="mt-5 space-y-2">
            {stats.topPalabras.map((w, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-28 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                  {w.clave}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                      style={{ width: `${(w.valor / maxPalabra) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="w-10 text-right text-sm font-semibold tabular-nums text-slate-500">
                  {w.valor.toLocaleString('es')}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
