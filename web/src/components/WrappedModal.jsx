import { useEffect, useMemo, useState } from 'react'
import { formatearFecha } from '../lib/stats'

// Fondo tipo "mesh gradient": cuatro luces de color repartidas por las esquinas
// sobre una base en diagonal. Mucho más rico y con profundidad que un degradado
// plano de dos colores.
function mesh(a, b, c, d, base1, base2) {
  return (
    `radial-gradient(at 22% 16%, ${a} 0px, transparent 55%),` +
    `radial-gradient(at 84% 10%, ${b} 0px, transparent 52%),` +
    `radial-gradient(at 82% 88%, ${c} 0px, transparent 55%),` +
    `radial-gradient(at 8% 92%, ${d} 0px, transparent 55%),` +
    `linear-gradient(135deg, ${base1}, ${base2})`
  )
}

const MESH = {
  esmeralda: mesh('#6ee7b7', '#22d3ee', '#0d9488', '#10b981', '#064e3b', '#0f766e'),
  violeta: mesh('#c4b5fd', '#e879f9', '#7c3aed', '#8b5cf6', '#3b0764', '#6b21a8'),
  rosa: mesh('#fda4af', '#fb7185', '#e11d48', '#f472b6', '#881337', '#be185d'),
  ambar: mesh('#fde68a', '#fbbf24', '#ea580c', '#f59e0b', '#7c2d12', '#b45309'),
  azul: mesh('#7dd3fc', '#38bdf8', '#1d4ed8', '#3b82f6', '#172554', '#1e40af'),
  rojo: mesh('#fca5a5', '#fb7185', '#b91c1c', '#ef4444', '#7f1d1d', '#9f1239'),
  noche: mesh('#a5b4fc', '#818cf8', '#4338ca', '#6366f1', '#1e1b4b', '#020617'),
  amarillo: mesh('#fef08a', '#fde047', '#d97706', '#facc15', '#713f12', '#a16207'),
  cian: mesh('#6ee7b7', '#22d3ee', '#0891b2', '#2dd4bf', '#064e3b', '#155e75'),
  fucsia: mesh('#f0abfc', '#d946ef', '#7e22ce', '#c026d3', '#4a044e', '#701a75'),
}

function construirSlides(stats) {
  const slides = []
  const p = stats.personas
  const fmt = (n) => n.toLocaleString('es')

  slides.push({
    bg: MESH.esmeralda,
    emoji: '🎁',
    kicker: 'El Wrapped de tu grupo',
    big: 'Vamos allá',
    sub: `${formatearFecha(isoDe(stats.primeraFecha))} – ${formatearFecha(isoDe(stats.ultimaFecha))}`,
  })

  slides.push({
    bg: MESH.violeta,
    emoji: '💬',
    kicker: 'En total habéis enviado',
    big: fmt(stats.totalMensajes),
    sub: `mensajes entre ${stats.numPersonas} personas`,
  })

  if (p[0])
    slides.push({
      bg: MESH.rosa,
      emoji: '🗣️',
      kicker: 'La voz cantante del grupo',
      big: p[0].autor,
      sub: `con ${fmt(p[0].total)} mensajes (${((p[0].total / stats.totalMensajes) * 100).toFixed(0)}%)`,
    })

  if (stats.topEmojis[0])
    slides.push({
      bg: MESH.ambar,
      emoji: stats.topEmojis[0].clave,
      kicker: 'Vuestro emoji estrella',
      big: stats.topEmojis[0].clave,
      sub: `usado ${fmt(stats.topEmojis[0].valor)} veces`,
    })

  slides.push({
    bg: MESH.azul,
    emoji: '📷',
    kicker: 'Habéis compartido',
    big: fmt(stats.totalTipos.imagen + stats.totalTipos.video),
    sub: `fotos y vídeos · y ${fmt(stats.totalTipos.audio)} audios 🎤`,
  })

  if (stats.diaRecord.fecha)
    slides.push({
      bg: MESH.rojo,
      emoji: '🔥',
      kicker: 'Vuestro día más loco',
      big: formatearFecha(stats.diaRecord.fecha),
      sub: `${fmt(stats.diaRecord.valor)} mensajes en un solo día`,
    })

  const buho = stats.medallas.find((m) => m.titulo === 'Búho nocturno')
  if (buho)
    slides.push({
      bg: MESH.noche,
      emoji: '🦉',
      kicker: 'El búho nocturno',
      big: buho.ganador,
      sub: buho.detalle,
    })

  if (stats.totalRisas)
    slides.push({
      bg: MESH.amarillo,
      emoji: '😂',
      kicker: 'Os habéis reído en',
      big: fmt(stats.totalRisas),
      sub: 'mensajes con jaja/😂',
    })

  slides.push({
    bg: MESH.cian,
    emoji: '📿',
    kicker: 'Vuestra racha más larga',
    big: `${fmt(stats.rachaMax)} días`,
    sub: 'hablando sin parar ni un día',
  })

  slides.push({
    bg: MESH.fucsia,
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

const DURACION = 5000 // ms que dura cada slide en el auto-avance

const sinAnimacion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function WrappedModal({ stats, onClose }) {
  const slides = useMemo(() => construirSlides(stats), [stats])
  const [i, setI] = useState(0)
  const [pausado, setPausado] = useState(false)
  const reduce = sinAnimacion()

  const siguiente = () => setI((v) => Math.min(v + 1, slides.length - 1))
  const anterior = () => setI((v) => Math.max(v - 1, 0))
  const enUltima = i >= slides.length - 1

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setI((v) => Math.min(v + 1, slides.length - 1))
      if (e.key === 'ArrowLeft') setI((v) => Math.max(v - 1, 0))
      if (e.key === ' ') {
        e.preventDefault()
        setPausado((p) => !p)
      }
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, slides.length])

  // Auto-avance tipo "historia": pasa de slide sola, salvo en la última,
  // mientras esté pausada o si el usuario pidió reducir animaciones.
  useEffect(() => {
    if (pausado || enUltima || reduce) return
    const t = setTimeout(() => setI((v) => v + 1), DURACION)
    return () => clearTimeout(t)
  }, [i, pausado, enUltima, reduce])

  const s = slides[i]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div
        className="relative w-full max-w-sm select-none"
        onPointerDown={() => setPausado(true)}
        onPointerUp={() => setPausado(false)}
        onPointerLeave={() => setPausado(false)}
      >
        {/* Barras de progreso */}
        <div className="absolute inset-x-3 top-3 z-20 flex gap-1">
          {slides.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
              <div
                key={idx === i ? `act-${i}` : `st-${idx}`}
                className="h-full rounded-full bg-white"
                style={
                  idx < i
                    ? { width: '100%' }
                    : idx === i
                      ? reduce
                        ? { width: '100%' }
                        : {
                            width: '0%',
                            animation: `barFill ${DURACION}ms linear forwards`,
                            animationPlayState: pausado ? 'paused' : 'running',
                          }
                      : { width: '0%' }
                }
              />
            </div>
          ))}
        </div>

        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute right-3 top-6 z-20 grid h-8 w-8 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:scale-110 hover:bg-white/35"
        >
          ✕
        </button>

        {/* Tarjeta */}
        <div
          key={i}
          style={{ background: s.bg }}
          className="animate-fade-in-up relative flex aspect-[9/16] max-h-[80vh] flex-col items-center justify-center overflow-hidden rounded-3xl p-8 text-center text-white shadow-2xl ring-1 ring-white/10"
        >
          {/* Blobs de luz que flotan y dan profundidad al fondo */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="animate-blob absolute -left-12 -top-10 h-48 w-48 rounded-full bg-white/25 blur-3xl mix-blend-soft-light" />
            <div
              className="animate-blob absolute -bottom-16 -right-12 h-56 w-56 rounded-full bg-white/20 blur-3xl mix-blend-soft-light"
              style={{ animationDelay: '-7s' }}
            />
            {/* Textura de grano fina: rompe el degradado plano y da look premium */}
            <div className="wrapped-grain absolute inset-0 opacity-[0.12] mix-blend-overlay" />
            {/* Brillo superior + viñeta para enfocar el centro */}
            <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(255,255,255,0.18),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(0,0,0,0.32))]" />
          </div>

          {/* Emoji protagonista con halo de brillo detrás */}
          <div className="relative">
            <span
              aria-hidden
              className="animate-wrapped-pop absolute inset-0 scale-125 text-7xl opacity-70 blur-2xl"
            >
              {s.emoji}
            </span>
            <span className="animate-wrapped-pop relative block text-7xl drop-shadow-lg">
              {s.emoji}
            </span>
          </div>

          <p
            className="animate-wrapped-in mt-8 text-sm font-medium uppercase tracking-[0.2em] text-white/80"
            style={{ animationDelay: '0.1s' }}
          >
            {s.kicker}
          </p>
          <p
            className="animate-wrapped-in mt-2 max-w-full break-words text-4xl font-extrabold leading-tight drop-shadow"
            style={{ animationDelay: '0.2s' }}
          >
            {s.big}
          </p>
          <p
            className="animate-wrapped-in mt-3 text-lg text-white/90"
            style={{ animationDelay: '0.3s' }}
          >
            {s.sub}
          </p>
          <p className="absolute bottom-6 text-xs font-semibold tracking-wide text-white/60">
            💬 ChatStats
          </p>
        </div>

        {/* Zonas de clic para navegar (toca un lado para avanzar/retroceder) */}
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
            className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25 disabled:opacity-30"
          >
            ← Atrás
          </button>
          <span className="text-sm tabular-nums text-white/60">
            {i + 1} / {slides.length}
          </span>
          {enUltima ? (
            <button
              onClick={onClose}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:scale-105"
            >
              Cerrar ✓
            </button>
          ) : (
            <button
              onClick={siguiente}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:scale-105"
            >
              Siguiente →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
