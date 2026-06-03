import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import StatCard from './StatCard'
import PersonRanking from './PersonRanking'
import DataTable from './DataTable'
import ActivityCharts from './ActivityCharts'
import ExtraCharts from './ExtraCharts'
import EmojiWords from './EmojiWords'
import FunFacts from './FunFacts'
import Medallas from './Medallas'
import ExtraStats from './ExtraStats'
import PersonModal from './PersonModal'
import WrappedModal from './WrappedModal'

function formatoFecha(d) {
  if (!d) return ''
  return d.toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Dashboard({ stats, nombreArchivo, onReiniciar }) {
  const ref = useRef(null)
  const [descargando, setDescargando] = useState(false)
  const [seleccion, setSeleccion] = useState(null) // { persona, color }
  const [wrapped, setWrapped] = useState(false)

  const multimedia =
    stats.totalTipos.imagen +
    stats.totalTipos.video +
    stats.totalTipos.audio +
    stats.totalTipos.sticker +
    stats.totalTipos.gif +
    stats.totalTipos.documento +
    stats.totalTipos.multimedia

  async function descargarImagen() {
    if (!ref.current) return
    setDescargando(true)
    try {
      const oscuro = document.documentElement.classList.contains('dark')
      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: oscuro ? '#020617' : '#f8fafc',
      })
      const link = document.createElement('a')
      link.download = 'estadisticas-whatsapp.png'
      link.href = dataUrl
      link.click()
    } catch (e) {
      console.error('No se pudo generar la imagen', e)
      alert('No se pudo generar la imagen. Inténtalo de nuevo.')
    } finally {
      setDescargando(false)
    }
  }

  return (
    <div className="py-8">
      {/* Barra superior */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Resumen del <span className="text-gradient">chat</span>
          </h1>
          <p className="text-sm text-slate-500">
            {formatoFecha(stats.primeraFecha)} – {formatoFecha(stats.ultimaFecha)} ·{' '}
            <span className="truncate">{nombreArchivo}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setWrapped(true)}
            className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 active:scale-95 transition"
          >
            🎁 Ver Wrapped
          </button>
          <button
            onClick={descargarImagen}
            disabled={descargando}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600 active:scale-95 transition disabled:opacity-60"
          >
            {descargando ? '⏳ Generando…' : '📥 Descargar imagen'}
          </button>
          <button
            onClick={onReiniciar}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition"
          >
            ↩️ Otro chat
          </button>
        </div>
      </div>

      {/* Contenido capturable */}
      <div ref={ref} className="space-y-8 rounded-2xl">
        {/* Tarjetas de totales */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard icono="💬" valor={stats.totalMensajes} etiqueta="Mensajes" color="emerald" />
          <StatCard icono="👥" valor={stats.numPersonas} etiqueta="Personas" color="sky" />
          <StatCard icono="📷" valor={stats.totalTipos.imagen} etiqueta="Imágenes" color="violet" />
          <StatCard icono="🎤" valor={stats.totalTipos.audio} etiqueta="Audios" color="amber" />
          <StatCard icono="🩹" valor={stats.totalTipos.sticker} etiqueta="Stickers" color="rose" />
          <StatCard icono="😀" valor={stats.totalEmojis} etiqueta="Emojis" color="cyan" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard icono="🎬" valor={stats.totalTipos.video} etiqueta="Vídeos" color="violet" />
          <StatCard icono="🎞️" valor={stats.totalTipos.gif} etiqueta="GIFs" color="rose" />
          <StatCard icono="📄" valor={stats.totalTipos.documento} etiqueta="Documentos" color="sky" />
          <StatCard icono="🖼️" valor={multimedia} etiqueta="Multimedia total" color="amber" />
          <StatCard icono="🔤" valor={stats.totalPalabras} etiqueta="Palabras" color="emerald" />
          <StatCard icono="📅" valor={stats.mediaPorDia} etiqueta="Msg / día" color="cyan" />
        </div>

        <FunFacts curiosidades={stats.curiosidades} />

        <Medallas medallas={stats.medallas} />

        <PersonRanking
          personas={stats.personas}
          total={stats.totalMensajes}
          onSelect={(persona, color) => setSeleccion({ persona, color })}
        />

        <DataTable personas={stats.personas} total={stats.totalMensajes} />

        <ExtraStats stats={stats} />

        <ActivityCharts stats={stats} />

        <ExtraCharts stats={stats} />

        <EmojiWords stats={stats} />
      </div>

      {seleccion && (
        <PersonModal
          persona={seleccion.persona}
          color={seleccion.color}
          total={stats.totalMensajes}
          onClose={() => setSeleccion(null)}
        />
      )}

      {wrapped && <WrappedModal stats={stats} onClose={() => setWrapped(false)} />}
    </div>
  )
}
