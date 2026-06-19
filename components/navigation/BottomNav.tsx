'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Timer, Scale, History, User } from 'lucide-react'

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/fast', label: 'Fast', icon: Timer },
    { href: '/weight', label: 'Weight', icon: Scale },
    { href: '/history', label: 'History', icon: History },
    { href: '/profile', label: 'Profile', icon: User },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
