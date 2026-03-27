'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + '/auth/callback' }
    })
    if (!error) setSent(true)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg2)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 375, animation: 'cardIn 0.5s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: '#085041', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 2s-7 8-7 14c0 4 3 6 7 6s7-2 7-6c0-6-7-14-7-14z" stroke="#E1F5EE" strokeWidth="1.5" fill="#1D9E75"/></svg>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.03em' }}>Levion</h1>
          <p style={{ fontSize: 14, color: 'var(--text-s)', fontWeight: 300, marginTop: 4 }}>Your daily health companion</p>
        </div>

        {sent ? (
          <div style={{ background: 'var(--bg)', border: '0.5px solid var(--border)', borderRadius: 14, padding: 24, textAlign: 'center' }}>
            <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--text)', marginBottom: 4 }}>Check your email!</p>
            <p style={{ fontSize: 13, color: 'var(--text-s)', fontWeight: 300 }}>We sent a magic link to <strong>{email}</strong></p>
          </div>
        ) : (
          <div style={{ background: 'var(--bg)', border: '0.5px solid var(--border)', borderRadius: 14, padding: 24 }}>
            <form onSubmit={handleLogin}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 10, border: '0.5px solid var(--border)', background: 'var(--bg2)', fontSize: 14, color: 'var(--text)', marginBottom: 12 }} />
              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', background: '#085041', color: '#E1F5EE', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Sending...' : 'Send magic link'}
              </button>
            </form>
            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-t)', fontWeight: 300, marginTop: 12 }}>No password needed</p>
          </div>
        )}
      </div>
    </div>
  )
}
