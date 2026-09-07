'use client'
import { useSyncExternalStore } from 'react'

const SUBS = new Map<string, (cb: () => void) => () => void>()
function subscribeMedia(query: string) {
  let sub = SUBS.get(query)
  if (!sub) {
    sub = (cb: () => void) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    }
    SUBS.set(query, sub)
  }
  return sub
}

export function useMediaQuery(query: string, serverDefault = false): boolean {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => serverDefault
  )
}

export function useOrientation(): 'portrait' | 'landscape' | null {
  return useSyncExternalStore(
    subscribeMedia('(orientation: portrait)'),
    () =>
      window.matchMedia('(orientation: portrait)').matches
        ? 'portrait'
        : 'landscape',
    () => null
  )
}

export type HeroVariant = 'film' | 'crossfade' | 'scroll'

const noop = () => () => {}

export function useHeroVariant(): HeroVariant {
  return useSyncExternalStore(
    noop,
    () => {
      const v = new URLSearchParams(window.location.search).get('hero')
      return v === 'crossfade' || v === 'scroll' ? v : 'film'
    },
    () => 'film'
  )
}

export function useSaveData(): boolean {
  return useSyncExternalStore(
    noop,
    () => {
      const c = (
        navigator as Navigator & { connection?: { saveData?: boolean } }
      ).connection
      return Boolean(c?.saveData)
    },
    () => false
  )
}

let loadedSnapshot = false
const loadedListeners = new Set<() => void>()
function subscribeLoaded(cb: () => void) {
  loadedListeners.add(cb)
  if (!loadedSnapshot && typeof window !== 'undefined') {
    if (document.readyState === 'complete') {
      loadedSnapshot = true
    } else {
      window.addEventListener(
        'load',
        () => {
          loadedSnapshot = true
          loadedListeners.forEach((l) => l())
        },
        { once: true }
      )
    }
  }
  return () => {
    loadedListeners.delete(cb)
  }
}
export function useWindowLoaded(): boolean {
  return useSyncExternalStore(
    subscribeLoaded,
    () =>
      loadedSnapshot ||
      (typeof document !== 'undefined' && document.readyState === 'complete'),
    () => false
  )
}
