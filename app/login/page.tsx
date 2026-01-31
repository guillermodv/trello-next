'use client'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/boards')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 120px)',
        background: '#f0f2f5',
      }}
    >
      <div
        style={{
          background: 'white',
          padding: 40,
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: 400,
          textAlign: 'center',
        }}
      >
        <h1 style={{ marginBottom: 24, color: '#172b4d' }}>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 12,
              marginBottom: 16,
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              fontSize: 16,
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 12,
              marginBottom: 24,
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              fontSize: 16,
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 12,
              background: '#0c66e4',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              fontSize: 16,
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && (
            <p style={{ color: 'red', marginTop: 16, fontSize: 14 }}>{error}</p>
          )}
        </form>
      </div>
    </div>
  )
}