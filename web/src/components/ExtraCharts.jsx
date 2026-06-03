import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const COLORES_MEDIA = {
  imagen: '#8b5cf6',
  video: '#ec4899',
  audio: '#f59e0b',
  sticker: '#f43f5e',
  gif: '#06b6d4',
  documento: '#3b82f6',
  multimedia: '#94a3b8',
}
const NOMBRES_MEDIA = {
  imagen: 'Imágenes',
  video: 'Vídeos',
  audio: 'Audios',
  sticker: 'Stickers',
  gif: 'GIFs',
  documento: 'Documentos',
  multimedia: 'Otros',
}

function Tarjeta({ titulo, subtitulo, children, className = '' }) {
  return (
    <section className={`card p-5 sm:p-6 ${className}`}>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{titulo}</h2>
      {subtitulo && <p className="text-sm text-slate-500">{subtitulo}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

function PieMultimedia({ stats }) {
  const datos = Object.keys(NOMBRES_MEDIA)
    .map((k) => ({ nombre: NOMBRES_MEDIA[k], valor: stats.totalTipos[k], color: COLORES_MEDIA[k] }))
    .filter((d) => d.valor > 0)

  if (!datos.length)
    return <p className="text-sm text-slate-400">No hay multimedia en este chat.</p>

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={datos}
            dataKey="valor"
            nameKey="nombre"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
          >
            {datos.map((d, i) => (
              <Cell key={i} fill={d.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid rgba(148,163,184,0.3)',
              background: 'rgba(15,23,42,0.92)',
              color: '#fff',
              fontSize: '13px',
            }}
            formatter={(v, n) => [v.toLocaleString('es'), n]}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            formatter={(value) => <span className="text-slate-500">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

function color(intensidad) {
  // intensidad 0..1 -> escala de verde
  if (intensidad === 0) return 'rgba(148,163,184,0.12)'
  const a = 0.2 + intensidad * 0.8
  return `rgba(16,185,129,${a})`
}

function HeatmapHoraDia({ heatmap }) {
  const max = Math.max(1, ...heatmap.flat())
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[520px]">
        {/* Cabecera de horas */}
        <div className="flex pl-10">
          {Array.from({ length: 24 }, (_, h) => (
            <div key={h} className="flex-1 text-center text-[9px] text-slate-400">
              {h % 3 === 0 ? `${h}` : ''}
            </div>
          ))}
        </div>
        {heatmap.map((fila, d) => (
          <div key={d} className="flex items-center">
            <div className="w-10 shrink-0 text-xs text-slate-400">{DIAS[d]}</div>
            {fila.map((v, h) => (
              <div key={h} className="flex-1 px-[1px]">
                <div
                  className="aspect-square rounded-[3px]"
                  style={{ background: color(v / max) }}
                  title={`${DIAS[d]} ${String(h).padStart(2, '0')}:00 · ${v} mensajes`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function CalendarHeatmap({ porFecha }) {
  const claves = Object.keys(porFecha).sort()
  if (!claves.length) return null

  const max = Math.max(...Object.values(porFecha))
  const inicio = new Date(claves[0])
  const fin = new Date(claves[claves.length - 1])

  // Alinear el inicio al lunes anterior.
  const cursor = new Date(inicio)
  const offset = (cursor.getDay() + 6) % 7
  cursor.setDate(cursor.getDate() - offset)

  const semanas = []
  let semana = []
  let mesAnterior = -1
  const etiquetasMes = []

  while (cursor <= fin) {
    const y = cursor.getFullYear()
    const m = String(cursor.getMonth() + 1).padStart(2, '0')
    const d = String(cursor.getDate()).padStart(2, '0')
    const clave = `${y}-${m}-${d}`
    const dentro = cursor >= inicio && cursor <= fin
    const valor = dentro ? porFecha[clave] || 0 : null

    if (semana.length === 0) {
      // Etiqueta de mes al empezar una semana nueva si cambia el mes.
      if (cursor.getMonth() !== mesAnterior) {
        etiquetasMes.push({ idx: semanas.length, texto: MESES[cursor.getMonth()] })
        mesAnterior = cursor.getMonth()
      } else {
        etiquetasMes.push({ idx: semanas.length, texto: '' })
      }
    }

    semana.push({ clave, valor })
    if (semana.length === 7) {
      semanas.push(semana)
      semana = []
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  if (semana.length) semanas.push(semana)

  return (
    <div className="overflow-x-auto">
      <div className="inline-block">
        {/* Meses */}
        <div className="mb-1 flex pl-8">
          {semanas.map((_, i) => {
            const et = etiquetasMes.find((e) => e.idx === i)
            return (
              <div key={i} className="w-[15px] text-[9px] text-slate-400">
                {et?.texto || ''}
              </div>
            )
          })}
        </div>
        <div className="flex">
          {/* Días de la semana */}
          <div className="mr-1 flex flex-col justify-between pr-1 text-[9px] text-slate-400">
            {DIAS.map((d, i) => (
              <div key={i} className="h-[13px] leading-[13px]">
                {i % 2 === 1 ? d : ''}
              </div>
            ))}
          </div>
          {/* Rejilla */}
          <div className="flex gap-[3px]">
            {semanas.map((sem, i) => (
              <div key={i} className="flex flex-col gap-[3px]">
                {sem.map((dia, j) => (
                  <div
                    key={j}
                    className="h-[13px] w-[13px] rounded-[3px]"
                    style={{
                      background: dia.valor == null ? 'transparent' : color(dia.valor / max),
                    }}
                    title={dia.valor == null ? '' : `${dia.clave}: ${dia.valor} mensajes`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        {/* Leyenda */}
        <div className="mt-2 flex items-center gap-1 pl-8 text-[10px] text-slate-400">
          <span>menos</span>
          {[0, 0.25, 0.5, 0.75, 1].map((v) => (
            <div key={v} className="h-[11px] w-[11px] rounded-[3px]" style={{ background: color(v) }} />
          ))}
          <span>más</span>
        </div>
      </div>
    </div>
  )
}

export default function ExtraCharts({ stats }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Tarjeta titulo="🥧 Reparto de multimedia" subtitulo="Tipos de archivo enviados">
          <PieMultimedia stats={stats} />
        </Tarjeta>
        <Tarjeta titulo="🔥 Mapa de calor" subtitulo="Actividad por día de la semana y hora">
          <HeatmapHoraDia heatmap={stats.heatmap} />
        </Tarjeta>
      </div>
      <Tarjeta titulo="📆 Calendario de actividad" subtitulo="Cada cuadradito es un día (estilo GitHub)">
        <CalendarHeatmap porFecha={stats.porFecha} />
      </Tarjeta>
    </div>
  )
}
