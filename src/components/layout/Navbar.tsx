'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'

const NAV_LINKS = [
  { href: '/productos', label: 'Productos' },
  { href: '/categorias', label: 'Categorías' },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/productos" className="text-lg font-bold text-blue-600">
              Cheil Perú
            </Link>
            <nav className="flex gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    pathname.startsWith(href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  )
}
