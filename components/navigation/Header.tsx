'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function Header() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/fast', label: 'Fast' },
    { href: '/weight', label: 'Weight' },
    { href: '/history', label: 'History' },
    { href: '/profile', label: 'Profile' },
  ]

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="hidden md:block bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900">
              Ascension Fasting
            </Link>
            <nav className="flex gap-6">
              {navItems.map(({ href, label }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-blue-600 border-b-2 border-blue-600 pb-[14px]'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
