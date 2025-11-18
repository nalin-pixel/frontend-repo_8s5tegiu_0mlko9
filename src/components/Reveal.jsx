import { useEffect, useRef, useState } from 'react'

export default function Reveal({ children, delay = 0, y = 16 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true)
            obs.disconnect()
          }
        })
      },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        transition: 'all 600ms cubic-bezier(0.22, 1, 0.36, 1)',
        transitionDelay: `${delay}ms`,
        transform: visible ? 'translateY(0px)' : `translateY(${y}px)`,
        opacity: visible ? 1 : 0,
      }}
    >
      {children}
    </div>
  )
}
