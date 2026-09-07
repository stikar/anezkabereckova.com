'use client'
import { createContext, useContext } from 'react'
import type { Locale } from '@/lib/content'

const Ctx = createContext<Locale>('cs')

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  return <Ctx.Provider value={locale}>{children}</Ctx.Provider>
}

export function useLocale(): Locale {
  return useContext(Ctx)
}
