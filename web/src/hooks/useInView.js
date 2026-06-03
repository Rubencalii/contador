import { useEffect, useRef, useState } from 'react'

// Devuelve [ref, visible]: pon el ref en un elemento y "visible" pasa a true
// la primera vez que entra en pantalla. Sirve para animar al hacer scroll.
export function useInView({ threshold = 0.15, once = true } = {}) {
  const ref = useRef(null)
  // Si el navegador no soporta IntersectionObserver, arrancamos visible (sin animar).
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === 'undefined'
  )

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) obs.disconnect()
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, once])

  return [ref, visible]
}
