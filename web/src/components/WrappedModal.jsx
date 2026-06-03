import { useEffect, useMemo, useState } from 'react'
import { formatearFecha } from '../lib/stats'

function construirSlides(stats) {
  const slides = []
  const p = stats.personas
  const fmt = (n) => n.toLocaleString('es')

  slides.push({
    bg: 'from-emerald-500 to-teal-600',
    emoji: '🎁',
    kicker: 'El Wrapped de tu grupo',
    big: 'Vamos allá',
    sub: `${formatearFecha(isoDe(stats.primeraFecha))} – ${formatearFecha(isoDe(stats.ultimaFecha))}`,
  })

  slides.push({
    bg: 'from-violet-500 to-purple-700',
    emoji: '💬',
    kicker: 'En total habéis enviado',
    big: fmt(stats.totalMensajes),
    sub: `mensajes entre ${stats.numPersonas} personas`,
  })

  if (p[0])
    slides.push({
      bg: 'from-rose-500 to-pink-600',
      emoji: '🗣️',
      kicker: 'La voz cantante del grupo',
      big: p[0].autor,
      sub: `con ${fmt(p[0].total)} mensajes (${((p[0].total / stats.totalMensajes) * 100).toFixed(0)}%)`,
    })

  if (stats.topEmojis[0])
    slides.push({
      bg: 'from-amber-400 to-orange-600',
      emoji: stats.topEmojis[0].clave,
      kicker: 'Vuestro emoji estrella',
      big: stats.topEmojis[0].clave,
      sub: `usado ${fmt(stats.topEmojis[0].valor)} veces`,
    })

  slides.push({
    bg: 'from-sky-500 to-blue-700',
    emoji: '📷',
    kicker: 'Habéis compartido',
    big: fmt(stats.totalTipos.imagen + stats.totalTipos.video),
    sub: `fotos y vídeos · y ${fmt(stats.totalTipos.audio)} audios 🎤`,
  })

  if (stats.diaRecord.fecha)
    slides.push({
      bg: 'from-red-500 to-rose-700',
      emoji: '🔥',
      kicker: 'Vuestro día más loco',
      big: formatearFecha(stats.diaRecord.fecha),
      sub: `${fmt(stats.diaRecord.valor)} mensajes en un solo día`,
    })

  const buho = stats.medallas.find((m) => m.titulo === 'Búho nocturno')
  if (buho)
    slides.push({
      bg: 'from-indigo-600 to-slate-900',
      emoji: '🦉',
      kicker: 'El búho nocturno',
      big: buho.ganador,
      sub: buho.detalle,
    })

  if (stats.totalRisas)
    slides.push({
      bg: 'from-yellow-400 to-amber-600',
      emoji: '😂',
      kicker: 'Os habéis reído en',
      big: fmt(stats.totalRisas),
      sub: 'mensajes con jaja/😂',
    })

  slides.push({
    bg: 'from-emerald-500 to-cyan-600',
    emoji: '📿',
    kicker: 'Vuestra racha más larga',
    big: `${fmt(stats.rachaMax)} días`,
    sub: 'hablando sin parar ni un día',
  })

  slides.push({
    bg: 'from-fuchsia-600 to-purple-800',
    emoji: '✨',
    kicker: 'Y esto es solo el resumen',
    big: '¡Gracias!',
    sub: 'Comparte tu Wrapped con el grupo 💚',
  })

  return slides
}

function isoDe(d) {
  if (!d) return null
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

export default function WrappedModal({ stats, onClose }) {
  const slides = useMemo(() => construirSlides(stats), [stats])
  const [i, setI] = useState(0)

  const siguiente = () => setI((v) => Math.min(v + 1, slides.length - 1))
  const anterior = () => setI((v) => Math.max(v - 1, 0))

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') siguiente()
      if (e.key === 'ArrowLeft') anterior()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, slides.length])

  const s = slides[i]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-sm">
        {/* Barras de progreso */}
        <div className="absolute inset-x-3 top-3 z-10 flex gap-1">
          {slides.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{ width: idx < i ? '100%' : idx === i ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute right-3 top-6 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/20 text-white hover:bg-white/30"
        >
          ✕
        </button>

        {/* Tarjeta */}
        <div
          key={i}
          className={`animate-fade-in-up flex aspect-[9/16] max-h-[80vh] flex-col items-center justify-center rounded-3xl bg-gradient-to-br ${s.bg} p-8 text-center text-white shadow-2xl`}
        >
          <div className="text-7xl drop-shadow-lg">{s.emoji}</div>
          <p className="mt-8 text-sm font-medium uppercase tracking-widest text-white/80">
            {s.kicker}
          </p>
          <p className="mt-2 text-4xl font-extrabold leading-tight drop-shadow break-words max-w-full">
            {s.big}
          </p>
          <p className="mt-3 text-lg text-white/90">{s.sub}</p>
          <p className="absolute bottom-6 text-xs font-semibold text-white/60">💬 ChatStats</p>
        </div>

        {/* Zonas de clic para navegar */}
        <button
          aria-label="Anterior"
          onClick={anterior}
          className="absolute left-0 top-0 h-full w-1/3"
        />
        <button
          aria-label="Siguiente"
          onClick={siguiente}
          className="absolute right-0 top-0 h-full w-1/3"
        />

        {/* Controles inferiores */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={anterior}
            disabled={i === 0}
            className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white disabled:opacity-30"
          >
            ← Atrás
          </button>
          <span className="text-sm text-white/60">
            {i + 1} / {slides.length}
          </span>
          {i < slides.length - 1 ? (
            <button
              onClick={siguiente}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900"
            >
              Siguiente →
            </button>
          ) : (
            <button
              onClick={onClose}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900"
            >
              Cerrar ✓
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
