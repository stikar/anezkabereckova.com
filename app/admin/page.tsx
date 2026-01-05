'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import Link from 'next/link'

export default function AdminLogin() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const router = useRouter()

  React.useEffect(() => {
    // Check if already logged in and approved
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        // Check approval status
        const { data: profile } = await supabase
          .from('admins')
          .select('is_approved')
          .eq('id', session.user.id)
          .single()

        if (profile?.is_approved) {
          router.push('/admin/dashboard')
        } else if (profile && !profile.is_approved) {
          // If logged in but not approved, we should probably sign them out here
          // to prevent them from being stuck in a "logged in but unauthorized" state
          await supabase.auth.signOut()
          setError('Your account is pending approval.')
        }
      }
    }
    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: signInError, data } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (signInError) throw signInError

      if (data.user) {
        // Check approval status
        const { data: profile, error: profileError } = await supabase
          .from('admins')
          .select('is_approved')
          .eq('id', data.user.id)
          .single()

        if (profileError) {
          // If profile doesn't exist, it might be an old user.
          // We could auto-create one or just fail.
          // For now, let's assume if no profile, they are not approved or something is wrong.
          // However, to be safe for existing users (like the main admin), maybe we treat no-profile as approved OR create one?
          // The migration logic implies new users get a profile.
          throw new Error('Could not verify account status.')
        }

        if (!profile.is_approved) {
          await supabase.auth.signOut()
          throw new Error(
            'Your account is awaiting approval from an administrator.'
          )
        }

        router.push('/admin/dashboard')
      }
    } catch (error: any) {
      setError(error.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl tracking-wide mb-2">
            Admin Login
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gallery Management
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xs"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-sm">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          <div className="flex justify-between text-sm pt-4">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-400 hover:underline"
            >
              ← Back to site
            </Link>
            <Link href="/admin/signup" className="text-primary hover:underline">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
