import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Portfolio } from '@/components/portfolio'
import { Divider } from '@/components/divider'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
        <Portfolio />
        <Divider />
      </main>

      <Footer />
    </div>
  )
}
