import { MessageCircle, Users, LayoutGrid, Smile } from 'lucide-react'

export default function HeroBento({ stats }) {
  const multimedia =
    stats.totalTipos.imagen +
    stats.totalTipos.video +
    stats.totalTipos.audio +
    stats.totalTipos.sticker +
    stats.totalTipos.gif +
    stats.totalTipos.documento +
    stats.totalTipos.multimedia

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 lg:gap-6 mb-8">
      
      {/* 1. Bloque Gigante (Mensajes) */}
      <div className="card card-hover md:col-span-2 md:row-span-2 p-8 lg:p-10 flex flex-col justify-between group">
        <div className="z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-6">
            <MessageCircle className="h-4 w-4" />
            Total de Mensajes
          </div>
          <div className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 dark:text-white mt-2">
            {stats.totalMensajes.toLocaleString('es')}
          </div>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium max-w-sm">
            Mensajes enviados en {stats.diasTotales} días activos de grupo. Una media de {stats.mediaPorDia} mensajes al día.
          </p>
        </div>
        {/* Imágenes 3D Abstracta de fondo/esquina */}
        <div className="absolute right-0 bottom-0 w-64 lg:w-96 opacity-60 dark:opacity-100 group-hover:scale-105 transition-transform duration-700 pointer-events-none translate-x-12 translate-y-12">
          {/* Imagen para Dark Mode */}
          <img src="/orb.png" alt="3D Orb" className="hidden dark:block w-full h-auto drop-shadow-2xl mix-blend-screen" style={{ WebkitUserDrag: 'none' }} />
          {/* Imagen para Light Mode */}
          <img src="/orb_light.png" alt="3D Orb Light" className="block dark:hidden w-full h-auto drop-shadow-2xl mix-blend-multiply opacity-50" style={{ WebkitUserDrag: 'none' }} />
        </div>
      </div>

      {/* 2. Bloque Mediano (Multimedia) */}
      <div className="card card-hover p-6 lg:p-8 flex flex-col justify-between group">
        <div className="z-10">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <div className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {multimedia.toLocaleString('es')}
          </div>
          <p className="mt-2 text-sm font-medium text-slate-500">Archivos multimedia</p>
        </div>
        {/* Otras imágenes abstractas más sutiles */}
        <div className="absolute right-0 top-0 w-40 lg:w-48 opacity-40 dark:opacity-70 group-hover:-translate-y-2 transition-transform duration-700 pointer-events-none translate-x-6 -translate-y-6">
          <img src="/shapes.png" alt="3D Shapes" className="hidden dark:block w-full h-auto drop-shadow-2xl mix-blend-screen" style={{ WebkitUserDrag: 'none' }} />
          <img src="/shapes_light.png" alt="3D Shapes Light" className="block dark:hidden w-full h-auto drop-shadow-2xl mix-blend-multiply" style={{ WebkitUserDrag: 'none' }} />
        </div>
      </div>

      {/* 3. Bloque Horizontal dividido en dos (Usuarios y Emojis) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card card-hover p-6 flex flex-col justify-center bg-gradient-to-br from-white to-sky-50 dark:from-[#0a0a0a] dark:to-[#0f172a]">
          <div className="mb-3 text-sky-500">
            <Users className="h-6 w-6" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.numPersonas}</div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Personas</p>
        </div>
        <div className="card card-hover p-6 flex flex-col justify-center bg-gradient-to-br from-white to-amber-50 dark:from-[#0a0a0a] dark:to-[#271c08]">
          <div className="mb-3 text-amber-500">
            <Smile className="h-6 w-6" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalEmojis.toLocaleString('es')}</div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Emojis</p>
        </div>
      </div>

    </div>
  )
}
