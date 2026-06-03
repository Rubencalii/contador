import { useEffect } from 'react'
import { formatearDuracion } from '../lib/stats'
import UserRadarChart from './UserRadarChart'

const TIPOS_INFO = [
  { tipo: 'imagen', icono: '📷', label: 'Imágenes' },
  { tipo: 'audio', icono: '🎤', label: 'Audios' },
  { tipo: 'video', icono: '🎬', label: 'Vídeos' },
  { tipo: 'sticker', icono: '🩹', label: 'Stickers' },
  { tipo: 'gif', icono: '🎞️', label: 'GIFs' },
  { tipo: 'documento', icono: '📄', label: 'Docs' },
]

function inicial(nombre) {
  return nombre.trim().charAt(0).toUpperCase()
}

export default function PersonModal({ persona, total, color, maximosGrupo, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!persona) return null
  const pct = ((persona.total / total) * 100).toFixed(1)
  const maxHora = Math.max(1, ...persona.horas)
  const maxEmoji = persona.topEmojis[0]?.valor || 1
  const maxPalabra = persona.topPalabras[0]?.valor || 1

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-fade-in-up"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="sticky top-0 flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-6 py-4">
          <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${color} text-2xl font-bold text-white shadow`}>
            {inicial(persona.autor)}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-extrabold text-slate-900 dark:text-white">
              {persona.autor}
            </h2>
            <p className="text-sm text-slate-500">
              {persona.total.toLocaleString('es')} mensajes · {pct}% del grupo
            </p>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* ADN del Usuario */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-500">ADN del Usuario</h3>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/30 p-2 border border-slate-100 dark:border-slate-800/50 flex justify-center">
              <UserRadarChart persona={persona} maximos={maximosGrupo} />
            </div>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            <Mini valor={persona.palabras} label="Palabras" />
            <Mini valor={persona.emojis} label="Emojis" />
            <Mini valor={persona.risas} label="Risas 😂" />
            <Mini valor={persona.mediaCaracteres} label="Car./msg" />
            <Mini valor={persona.iniciosConversacion} label="Inicios 🚀" />
            <Mini valor={persona.eliminados} label="Borrados 🗑️" />
            <Mini
              valor={persona.respMedio != null ? formatearDuracion(persona.respMedio) : '—'}
              label="Responde en"
              raw
            />
            <Mini valor={persona.multimedia} label="Multimedia" />
          </div>

          {/* Tipos de multimedia */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-500">Qué envía</h3>
            <div className="flex flex-wrap gap-2">
              {TIPOS_INFO.filter((t) => persona.tipos[t.tipo] > 0).map((t) => (
                <span
                  key={t.tipo}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-sm"
                >
                  {t.icono} {t.label}:{' '}
                  <b className="tabular-nums">{persona.tipos[t.tipo].toLocaleString('es')}</b>
                </span>
              ))}
            </div>
          </div>

          {/* Horas activas */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-500">A qué horas escribe</h3>
            <div className="flex h-20 items-end gap-[2px]">
              {persona.horas.map((v, h) => (
                <div key={h} className="group flex flex-1 flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-sm ${color} transition-all`}
                    style={{ height: `${(v / maxHora) * 100}%`, minHeight: v > 0 ? '2px' : '0' }}
                    title={`${String(h).padStart(2, '0')}:00 · ${v} mensajes`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-slate-400">
              <span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>23h</span>
            </div>
          </div>

          {/* Emojis y palabras */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-500">Sus emojis favoritos</h3>
              {persona.topEmojis.length === 0 ? (
                <p className="text-sm text-slate-400">Sin emojis</p>
              ) : (
                <div className="space-y-2">
                  {persona.topEmojis.map((e, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xl">{e.clave}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: `${(e.valor / maxEmoji) * 100}%` }} />
                      </div>
                      <span className="w-8 text-right text-xs tabular-nums text-slate-500">{e.valor}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-500">Sus palabras favoritas</h3>
              {persona.topPalabras.length === 0 ? (
                <p className="text-sm text-slate-400">Sin datos</p>
              ) : (
                <div className="space-y-2">
                  {persona.topPalabras.slice(0, 8).map((w, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-20 truncate text-sm text-slate-700 dark:text-slate-200">{w.clave}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" style={{ width: `${(w.valor / maxPalabra) * 100}%` }} />
                      </div>
                      <span className="w-8 text-right text-xs tabular-nums text-slate-500">{w.valor}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Mini({ valor, label, raw }) {
  return (
    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 text-center">
      <div className="text-lg font-extrabold tabular-nums text-slate-900 dark:text-white">
        {raw ? valor : typeof valor === 'number' ? valor.toLocaleString('es') : valor}
      </div>
      <div className="text-[11px] text-slate-500">{label}</div>
    </div>
  )
}
