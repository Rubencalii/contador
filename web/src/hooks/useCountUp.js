import { useEffect, useRef, useState } from 'react'

// Anima un número desde 0 hasta "objetivo" cuando "activo" se vuelve true.
// Usa easeOutCubic (rápido al principio, frena al final) para que se sienta vivo.
export function useCountUp(objetivo, activo, duracion = 1200) {
  const [valor, setValor] = useState(0)
  const rafRef = useRef(0)

  useEffect(() => {
    if (!activo) return

    // Si no es un número finito, o el usuario pidió menos animaciones, o es 0,
    // lo mostramos directamente sin contar.
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (typeof objetivo !== 'number' || !isFinite(objetivo) || objetivo === 0 || reduce) {
      setValor(objetivo)
      return
    }

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
  }, [objetivo, activo, duracion])

  return valor
}
