import { useInView } from '../hooks/useInView'

// Envuelve una sección y la hace aparecer (deslizar hacia arriba + fundido) la
// primera vez que entra en pantalla. "delay" permite escalonar varias.
export default function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useInView()
  return (
    <div
      ref={ref}
      data-reveal
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none
        ${visible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-[2px]'}
        ${className}`}
    >
      {children}
    </div>
  )
}
