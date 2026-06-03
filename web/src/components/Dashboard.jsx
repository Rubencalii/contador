import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { MessageCircle, Users, Image as ImageIcon, Mic, Sticker, Smile, Video, Film, FileText, LayoutGrid, Type, Calendar, Gift, Download, RefreshCcw } from 'lucide-react'
import DataTable from './DataTable'
import Reveal from './Reveal'
import ActivityCharts from './ActivityCharts'
import HeroBento from './HeroBento'
import AwardsBento from './AwardsBento'
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
    // Forzamos todas las secciones visibles para que no salgan en blanco.
    ref.current.classList.add('capturando')
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
      ref.current?.classList.remove('capturando')
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
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setWrapped(true)}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 hover:opacity-90 active:scale-95 transition-all duration-300 hover:-translate-y-0.5"
          >
            <Gift className="h-4 w-4" /> Ver Wrapped
          </button>
          <button
            onClick={descargarImagen}
            disabled={descargando}
            className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 active:scale-95 transition-all duration-300 disabled:opacity-60 hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4" /> {descargando ? 'Generando…' : 'Descargar imagen'}
          </button>
          <button
            onClick={onReiniciar}
            className="flex items-center gap-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 backdrop-blur shadow-sm transition-all duration-300 hover:-translate-y-0.5"
          >
            <RefreshCcw className="h-4 w-4" /> Otro chat
          </button>
        </div>
      </div>

      {/* Contenido capturable */}
      <div ref={ref} className="space-y-10 rounded-3xl pb-10">
        
        <Reveal><HeroBento stats={stats} /></Reveal>

        <Reveal><AwardsBento medallas={stats.medallas} curiosidades={stats.curiosidades} /></Reveal>

        <Reveal>
          <DataTable 
            personas={stats.personas} 
            total={stats.totalMensajes} 
            onSelect={(persona, color) => setSeleccion({ persona, color })}
          />
        </Reveal>

        <Reveal><ActivityCharts stats={stats} /></Reveal>
      </div>

      {seleccion && (
        <PersonModal
          persona={seleccion.persona}
          color={seleccion.color}
          total={stats.totalMensajes}
          maximosGrupo={stats.maximosGrupo}
          onClose={() => setSeleccion(null)}
        />
      )}

      {wrapped && <WrappedModal stats={stats} onClose={() => setWrapped(false)} />}
    </div>
  )
}
