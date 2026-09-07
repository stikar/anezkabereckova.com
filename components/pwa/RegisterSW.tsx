'use client'
import { useEffect } from 'react'

export function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator)) return
    let timer: number | undefined
    const register = () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then(() => {
          const kick = () =>
            navigator.serviceWorker.ready.then((r) => {
              ;(r.active ?? navigator.serviceWorker.controller)?.postMessage({
                type: 'precache-thumbs',
              })
            })
          timer = window.setTimeout(() => {
            if ('requestIdleCallback' in window) {
              ;(
                window as Window & {
                  requestIdleCallback: (cb: () => void) => number
                }
              ).requestIdleCallback(kick)
            } else kick()
          }, 5000)
        })
        .catch(() => {})
    }
    if (document.readyState === 'complete') register()
    else window.addEventListener('load', register, { once: true })
    return () => window.clearTimeout(timer)
  }, [])
  return null
}
