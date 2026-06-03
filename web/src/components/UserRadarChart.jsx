import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts'

export default function UserRadarChart({ persona, maximos }) {
  // Convertimos las métricas reales a un porcentaje (0 a 100)
  // respecto al máximo histórico del grupo para cada estadística.
  const data = [
    { subject: 'Mensajes', valorReal: persona.total, score: (persona.total / maximos.total) * 100 },
    { subject: 'Palabras', valorReal: persona.palabras, score: (persona.palabras / maximos.palabras) * 100 },
    { subject: 'Emojis', valorReal: persona.emojis, score: (persona.emojis / maximos.emojis) * 100 },
    { subject: 'Imágenes', valorReal: persona.tipos.imagen, score: (persona.tipos.imagen / maximos.imagen) * 100 },
    { subject: 'Audios', valorReal: persona.tipos.audio, score: (persona.tipos.audio / maximos.audio) * 100 },
    { subject: 'Stickers', valorReal: persona.tipos.sticker, score: (persona.tipos.sticker / maximos.sticker) * 100 },
    { subject: 'Risas', valorReal: persona.risas, score: (persona.risas / maximos.risas) * 100 },
  ]

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          {/* Rejilla de estilo poligonal (videojuego) */}
          <PolarGrid gridType="polygon" className="stroke-slate-200 dark:stroke-slate-700 opacity-60" />
          
          {/* Nombres de los ejes */}
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} 
          />
          
          {/* Eje radial oculto (0 a 100) para forzar la misma escala en todos */}
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />

          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload
                return (
                  <div className="rounded-lg bg-slate-900/95 p-3 text-sm text-white shadow-xl backdrop-blur">
                    <p className="font-bold text-emerald-400 mb-1">{d.subject}</p>
                    <p>Total: {d.valorReal.toLocaleString('es')}</p>
                    <p className="text-xs text-slate-400 mt-1">{Math.round(d.score)}% del récord grupal</p>
                  </div>
                )
              }
              return null
            }}
          />

          {/* El polígono de datos */}
          <Radar
            name={persona.autor}
            dataKey="score"
            stroke="#10b981"
            strokeWidth={3}
            fill="#34d399"
            fillOpacity={0.4}
            className="drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
