import { useEffect, useRef, useState } from 'react'

// Devuelve [ref, visible]: pon el ref en un elemento y "visible" pasa a true
// la primera vez que entra en pantalla. Sirve para animar al hacer scroll.
export function useInView({ threshold = 0.15, once = true } = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Si el navegador no soporta IntersectionObserver, mostramos sin animar.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
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
