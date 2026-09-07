'use client'
import { useEffect } from 'react'
import type { Project } from '@/lib/content'

export const LAST_PROJECT_KEY = 'ab:last-project'
const CHROME_BG = '#F4F2EE'
const VARS = [
  '--atm-bg',
  '--atm-fg',
  '--atm-muted',
  '--atm-accent',
  '--atm-line',
]

export function applyAtmosphere(project: Project | null) {
  const root = document.documentElement
  const meta = document.querySelector('meta[name="theme-color"]')
  const a = project?.atmosphere
  if (!a || !project) {
    for (const k of VARS) root.style.removeProperty(k)
    root.style.colorScheme = ''
    delete root.dataset.atmosphere
    meta?.setAttribute('content', CHROME_BG)
    return
  }
  root.style.setProperty('--atm-bg', a.bg)
  root.style.setProperty('--atm-fg', a.fg)
  root.style.setProperty('--atm-muted', a.muted)
  root.style.setProperty('--atm-accent', a.accent)
  root.style.setProperty(
    '--atm-line',
    a.dark ? 'rgba(244,242,238,0.18)' : 'rgba(14,14,14,0.14)'
  )
  root.style.colorScheme = a.dark ? 'dark' : 'light'
  root.dataset.atmosphere = project.slug
  meta?.setAttribute('content', a.bg)
}

export function Atmosphere({ project }: { project: Project | null }) {
  useEffect(() => {
    applyAtmosphere(project)
    if (project) {
      try {
        localStorage.setItem(
          LAST_PROJECT_KEY,
          JSON.stringify({
            slug: project.slug,
            bg: project.atmosphere.bg,
            fg: project.atmosphere.fg,
          })
        )
      } catch {}
    }
    return () => applyAtmosphere(null)
  }, [project])
  return null
}
