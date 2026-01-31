'use client'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar({ initialSession }: { initialSession: any | null }) { // Accept initialSession prop
  const pathname = usePathname()
  const router = useRouter()
  const [session, setSession] = useState<any>(initialSession) // Initialize state with prop
  const supabase = createClient()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'My Boards', href: '/boards' },
  ]

  return (
    <nav
      style={{
        background: '#172b4d',
        padding: '16px 24px',
        display: 'flex',
        gap: 24,
        alignItems: 'center',
      }}
    >
      {navLinks.map((link) => {
        const isActive = pathname === link.href
        return (
          <Link
            href={link.href}
            key={link.name}
            style={{
              color: isActive ? 'white' : '#a6c5e2',
              textDecoration: 'none',
              fontWeight: isActive ? 'bold' : 'normal',
              fontSize: 18,
            }}
          >
            {link.name}
          </Link>
        )
      })}
      {session ? (
        <button
          onClick={handleLogout}
          style={{
            marginLeft: 'auto', // Pushes the button to the right
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 16,
          }}
        >
          Logout
        </button>
      ) : (
        <Link
          href="/login"
          style={{
            marginLeft: 'auto',
            background: '#0c66e4',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 16,
            textDecoration: 'none',
          }}
        >
          Login
        </Link>
      )}
    </nav>
  )
}
