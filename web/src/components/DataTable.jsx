import { useState } from 'react'
import { formatearDuracion } from '../lib/stats'

const COLUMNAS = [
  { key: 'autor', label: 'Persona', tipo: 'texto', align: 'left' },
  { key: 'total', label: '💬 Msg', tipo: 'num' },
  { key: 'pct', label: '%', tipo: 'num' },
  { key: 'imagen', label: '📷', tipo: 'tipo' },
  { key: 'audio', label: '🎤', tipo: 'tipo' },
  { key: 'video', label: '🎬', tipo: 'tipo' },
  { key: 'sticker', label: '🩹', tipo: 'tipo' },
  { key: 'gif', label: '🎞️', tipo: 'tipo' },
  { key: 'emojis', label: '😀', tipo: 'num' },
  { key: 'palabras', label: '🔤', tipo: 'num' },
  { key: 'risas', label: '😂', tipo: 'num' },
  { key: 'respMedio', label: '⚡ Responde', tipo: 'tiempo' },
]

function valorDe(p, col, total) {
  switch (col.tipo) {
    case 'texto':
      return p.autor
    case 'tipo':
      return p.tipos[col.key]
    case 'tiempo':
      return p.respMedio ?? Infinity
    case 'num':
      if (col.key === 'pct') return (p.total / total) * 100
      return p[col.key]
    default:
      return 0
  }
}

function mostrar(p, col, total) {
  switch (col.tipo) {
    case 'texto':
      return p.autor
    case 'tipo':
      return p.tipos[col.key].toLocaleString('es')
    case 'tiempo':
      return p.respMedio != null ? formatearDuracion(p.respMedio) : '—'
    case 'num':
      if (col.key === 'pct') return `${((p.total / total) * 100).toFixed(1)}%`
      return p[col.key].toLocaleString('es')
    default:
      return ''
  }
}

export default function DataTable({ personas, total, onSelect }) {
  const [orden, setOrden] = useState({ key: 'total', dir: 'desc' })

  const ordenadas = [...personas].sort((a, b) => {
    const col = COLUMNAS.find((c) => c.key === orden.key)
    let va = valorDe(a, col, total)
    let vb = valorDe(b, col, total)
    if (typeof va === 'string') {
      return orden.dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    }
    return orden.dir === 'asc' ? va - vb : vb - va
  })

  function ordenarPor(key) {
    setOrden((o) =>
      o.key === key
        ? { key, dir: o.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: key === 'autor' ? 'asc' : 'desc' }
    )
  }

  return (
    <section className="card p-5 sm:p-6">
      <h2 className="section-title">📋 Detalles por persona</h2>
      <p className="mt-1 text-sm text-slate-500">
        Haz clic en cualquier persona para ver su ADN detallado
      </p>

      <div className="mt-6 -mx-2 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/5 pb-2">
              <th className="px-2 pb-3 pt-2 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                #
              </th>
              {COLUMNAS.map((col) => {
                const activo = orden.key === col.key
                return (
                  <th
                    key={col.key}
                    onClick={() => ordenarPor(col.key)}
                    className={`cursor-pointer select-none whitespace-nowrap px-2 py-2 font-semibold transition
                      ${col.align === 'left' ? 'text-left' : 'text-right'}
                      ${activo ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                  >
                    {col.label}
                    <span className="ml-0.5 text-[10px]">
                      {activo ? (orden.dir === 'asc' ? '▲' : '▼') : ''}
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {ordenadas.map((p, i) => (
              <tr
                key={p.autor}
                onClick={() => onSelect?.(p, 'bg-emerald-500')}
                className="group relative transition-all hover:bg-slate-50 dark:hover:bg-white/[0.02] cursor-pointer"
              >
                <td className="px-2 py-3 text-right text-xs text-slate-400 tabular-nums">
                  {i + 1}
                </td>
                {COLUMNAS.map((col) => (
                  <td
                    key={col.key}
                    className={`whitespace-nowrap px-2 py-2 tabular-nums
                      ${col.align === 'left' ? 'text-left font-semibold text-slate-800 dark:text-slate-100' : 'text-right text-slate-600 dark:text-slate-300'}
                      ${col.key === 'total' ? 'font-bold text-slate-900 dark:text-white' : ''}`}
                  >
                    {col.align === 'left' ? (
                      <span className="block max-w-[160px] truncate">{mostrar(p, col, total)}</span>
                    ) : (
                      mostrar(p, col, total)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
