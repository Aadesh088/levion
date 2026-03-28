'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        window.location.href = '/'
      }
    })
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f4f0' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: '#085041', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2s-7 8-7 14c0 4 3 6 7 6s7-2 7-6c0-6-7-14-7-14z" stroke="#E1F5EE" strokeWidth="1.5" fill="#1D9E75"/></svg>
        </div>
        <p style={{ fontSize: 14, color: '#6b6b6b', fontFamily: 'Outfit, sans-serif' }}>Signing you in...</p>
      </div>
    </div>
  )
}
