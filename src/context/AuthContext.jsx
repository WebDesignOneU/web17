import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  function setSession(t, u) {
    setToken(t)
    setUser(u)
    if (t) localStorage.setItem('token', t); else localStorage.removeItem('token')
    if (u) localStorage.setItem('user', JSON.stringify(u)); else localStorage.removeItem('user')
  }

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    const payload = data.data || data
    const t = payload.token || data.token
    const u = payload.user || payload.usuario || data.user || { email }
    setSession(t, u)
    return payload
  }

  async function register(email, password, rol = 'espectador') {
    const { data } = await api.post('/auth/register', { email, password, rol })
    return data
  }

  async function fetchPerfil() {
    const { data } = await api.get('/auth/perfil')
    const p = data.data || data.usuario || data.user || data
    const merged = { ...(user || {}), ...(p || {}) }
    setUser(merged)
    localStorage.setItem('user', JSON.stringify(merged))
    return p
  }

  function logout() { setSession(null, null) }

  useEffect(() => {
    // Sincroniza si otra pestaña modificó el storage
    const onStorage = () => {
      setToken(localStorage.getItem('token'))
      try { setUser(JSON.parse(localStorage.getItem('user') || 'null')) } catch { setUser(null) }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, fetchPerfil, setSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
