'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else window.location.href = '/'
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 375, animation: 'cardIn 0.5s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(29,158,117,0.12)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, animation: 'glow 3s ease-in-out infinite' }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M12 2s-7 8-7 14c0 4 3 6 7 6s7-2 7-6c0-6-7-14-7-14z" stroke="#9FE1CB" strokeWidth="1.5" fill="#1D9E75"/></svg>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 500, color: '#f0efe8', letterSpacing: '-0.04em' }}>Levion</h1>
          <p style={{ fontSize: 14, color: '#5a5a55', fontWeight: 300, marginTop: 6, letterSpacing: '0.02em' }}>Your daily health companion</p>
        </div>
        <div style={{ background: '#1a1a1a', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: 28 }}>
          <form onSubmit={handleLogin}>
            <label style={{ fontSize: 11, color: '#5a5a55', fontWeight: 300, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
              style={{ width: '100%', boxSizing: 'border-box', padding: '13px 16px', borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.12)', background: '#222222', fontSize: 14, color: '#f0efe8', marginBottom: 16 }} />
            <label style={{ fontSize: 11, color: '#5a5a55', fontWeight: 300, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required
              style={{ width: '100%', boxSizing: 'border-box', padding: '13px 16px', borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.12)', background: '#222222', fontSize: 14, color: '#f0efe8', marginBottom: 16 }} />
            {error && <p style={{ fontSize: 12, color: '#E24B4A', marginBottom: 12, fontWeight: 300 }}>{error}</p>}
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: 13, borderRadius: 12, border: 'none', background: '#1D9E75', color: '#0f0f0f', fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", opacity: loading ? 0.7 : 1, letterSpacing: '-0.01em' }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
