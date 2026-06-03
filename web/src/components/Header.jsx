export default function Header({ oscuro, onToggle, onLogo }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 dark:border-slate-800/70 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <button
          onClick={onLogo}
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30">
            💬
          </span>
          <span>
            Chat<span className="text-gradient">Stats</span>
          </span>
        </button>

        <button
          onClick={onToggle}
          aria-label="Cambiar tema"
          className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:scale-105 active:scale-95 transition"
        >
          {oscuro ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
