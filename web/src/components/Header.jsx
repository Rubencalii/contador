import { Sun, Moon } from 'lucide-react'

export default function Header({ oscuro, onToggle, onLogo }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-50/60 dark:bg-slate-950/60 backdrop-blur-xl transition-all">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <button
          onClick={onLogo}
          className="group flex items-center gap-3 text-2xl font-black tracking-tighter transition-all"
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform duration-300">
            <img src="/logo_dark.png" alt="ChatStats Logo" className="hidden dark:block h-full w-full object-cover scale-110" style={{ WebkitUserDrag: 'none' }} />
            <img src="/logo_light.png" alt="ChatStats Logo" className="block dark:hidden h-full w-full object-cover scale-110" style={{ WebkitUserDrag: 'none' }} />
          </div>
          <span>
            Chat<span className="text-gradient">Stats</span>
          </span>
        </button>

        <button
          onClick={onToggle}
          aria-label="Cambiar tema"
          className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
        >
          {oscuro ? (
            <Sun className="h-5 w-5 text-amber-400" strokeWidth={2.5} />
          ) : (
            <Moon className="h-5 w-5 text-slate-600" strokeWidth={2.5} />
          )}
        </button>
      </div>
    </header>
  )
}
