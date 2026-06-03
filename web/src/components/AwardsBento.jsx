export default function AwardsBento({ medallas, curiosidades }) {
  // Solo mostramos unas cuantas medallas destacadas para no saturar
  const medallasTop = medallas.slice(0, 6)
  
  return (
    <section className="card p-6 sm:p-8 mb-8">
      <h2 className="section-title mb-6">🏆 Hall de la Fama & Curiosidades</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Curiosidad Destacada (Día Récord o similar) */}
        {curiosidades[0] && (
          <div className="col-span-1 md:col-span-2 lg:col-span-1 rounded-2xl bg-slate-900 text-white p-6 shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 mix-blend-overlay"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <span className="text-3xl">{curiosidades[0].icono}</span>
                <h3 className="text-xl font-bold mt-2">{curiosidades[0].titulo}</h3>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-black tracking-tight">{curiosidades[0].valor}</p>
                <p className="text-sm text-slate-300 mt-1">{curiosidades[0].detalle}</p>
              </div>
            </div>
          </div>
        )}

        {/* Rejilla de Medallas */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {medallasTop.map((m, i) => (
            <div key={i} className="rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 transition-transform hover:scale-105">
              <div className="text-2xl mb-2">{m.icono}</div>
              <div className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">{m.titulo}</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white truncate" title={m.ganador}>{m.ganador}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
