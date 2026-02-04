'use client'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ROUTES, MESSAGES, NAV_LINKS } from '@/lib/constants'

export default function Navbar({
  initialSession,
}: {
  initialSession: any | null
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [session, setSession] = useState<any>(initialSession)
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
    router.push(ROUTES.LOGIN)
  }

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
      <Link href={ROUTES.HOME} style={{ textDecoration: 'none' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>
          Tablerito
        </h1>
      </Link>
      {NAV_LINKS.map((link) => {
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
            marginLeft: 'auto',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 16,
          }}
        >
          {MESSAGES.LOGOUT}
        </button>
      ) : (
        <Link
          href={ROUTES.LOGIN}
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
          {MESSAGES.LOGIN}
        </Link>
      )}
    </nav>
  )
}
