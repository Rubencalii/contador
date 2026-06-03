import { useEffect, useRef, useState } from 'react'

// Anima un número desde 0 hasta "objetivo" cuando "activo" se vuelve true.
// Usa easeOutCubic (rápido al principio, frena al final) para que se sienta vivo.
export function useCountUp(objetivo, activo, duracion = 1200) {
  const [valor, setValor] = useState(0)
  const rafRef = useRef(0)

  // Solo animamos si está activo, es un número finito distinto de 0 y el
  // usuario no pidió reducir animaciones. Si no, devolvemos el valor directo.
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const animar =
    activo && typeof objetivo === 'number' && isFinite(objetivo) && objetivo !== 0 && !reduce

  useEffect(() => {
    if (!animar) return

    const inicio = performance.now()
    const tick = (ahora) => {
      const t = Math.min(1, (ahora - inicio) / duracion)
      const eased = 1 - Math.pow(1 - t, 3)
      setValor(Math.round(objetivo * eased))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setValor(objetivo)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [objetivo, animar, duracion])

  return animar ? valor : objetivo
}
