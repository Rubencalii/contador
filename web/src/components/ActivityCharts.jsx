import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts'

function Tarjeta({ titulo, subtitulo, children }) {
  return (
    <section className="card p-5 sm:p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{titulo}</h2>
      {subtitulo && <p className="text-sm text-slate-500">{subtitulo}</p>}
      <div className="mt-4 h-64 w-full">{children}</div>
    </section>
  )
}

const tooltipStyle = {
  borderRadius: '12px',
  border: '1px solid rgba(148,163,184,0.3)',
  background: 'rgba(15,23,42,0.92)',
  color: '#fff',
  fontSize: '13px',
}

function formatearEtiquetaDia(iso) {
  // iso = YYYY-MM-DD o YYYY-MM
  const partes = iso.split('-')
  if (partes.length === 2) return `${partes[1]}/${partes[0].slice(2)}`
  return `${partes[2]}/${partes[1]}`
}

export default function ActivityCharts({ stats }) {
  const usarMeses = stats.serieDias.length > 120
  const serie = usarMeses ? stats.serieMeses : stats.serieDias

  // Color de la hora más activa.
  const maxHora = Math.max(...stats.porHora)
  const datosHora = stats.porHora.map((v, h) => ({
    hora: `${String(h).padStart(2, '0')}h`,
    valor: v,
    pico: v === maxHora,
  }))

  const maxDia = Math.max(...stats.porDiaSemana.map((d) => d.valor))

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <Tarjeta
          titulo="📈 Actividad a lo largo del tiempo"
          subtitulo={usarMeses ? 'Mensajes por mes' : 'Mensajes por día'}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={serie} margin={{ top: 5, right: 10, bottom: 0, left: 10 }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
              <XAxis
                dataKey="etiqueta"
                tickFormatter={formatearEtiquetaDia}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                minTickGap={28}
              />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={tooltipStyle}
                itemStyle={{ color: '#fff' }}
                labelFormatter={formatearEtiquetaDia}
                formatter={(v) => [v.toLocaleString('es'), 'Mensajes']}
              />
              <Area
                type="monotone"
                dataKey="valor"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#grad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Tarjeta>
      </div>

      <Tarjeta titulo="🕐 ¿A qué hora se habla?" subtitulo="Mensajes por hora del día">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datosHora} margin={{ top: 5, right: 10, bottom: 0, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
            <XAxis
              dataKey="hora"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              interval={2}
            />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={tooltipStyle}
              itemStyle={{ color: '#fff' }}
              cursor={{ fill: 'rgba(148,163,184,0.1)' }}
              formatter={(v) => [v.toLocaleString('es'), 'Mensajes']}
            />
            <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
              {datosHora.map((d, i) => (
                <Cell key={i} fill={d.pico ? '#f59e0b' : '#38bdf8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Tarjeta>

      <Tarjeta titulo="📅 ¿Qué días?" subtitulo="Mensajes por día de la semana">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={stats.porDiaSemana}
            margin={{ top: 5, right: 10, bottom: 0, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
            <XAxis dataKey="etiqueta" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={tooltipStyle}
              itemStyle={{ color: '#fff' }}
              cursor={{ fill: 'rgba(148,163,184,0.1)' }}
              formatter={(v) => [v.toLocaleString('es'), 'Mensajes']}
            />
            <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
              {stats.porDiaSemana.map((d, i) => (
                <Cell key={i} fill={d.valor === maxDia ? '#8b5cf6' : '#a78bfa'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Tarjeta>
    </div>
  )
}
