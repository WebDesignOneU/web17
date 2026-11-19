import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../services/api'

export default function Perfil() {
  const { user, token, fetchPerfil, logout } = useAuth()
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    if (!token) return
    setLoading(true); setError('')
    try { setPerfil((await fetchPerfil()) || {}) }
    catch (e) { setError(getErrorMessage(e, 'No se pudo cargar el perfil.')) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const raw = useMemo(() => {
    const extra = { ...(perfil || {}) }
    delete extra.email; delete extra.rol; delete extra.id; delete extra.id_usuario
    return Object.keys(extra).length ? JSON.stringify(extra, null, 2) : ''
  }, [perfil])

  function doLogout() { logout(); navigate('/') }

  if (!token) {
    return (
      <section style={{ maxWidth: '720px', margin: '0 auto' }}>
        <h2>Mi Perfil</h2>
        <p>Debes iniciar sesión para ver tu perfil.</p>
        <Link to="/login" className="btn-hero-primary">Ir a login</Link>
      </section>
    )
  }

  return (
    <section style={{ maxWidth: '720px', margin: '0 auto' }}>
      <h2>Mi Perfil</h2>
      {loading && <p>Cargando perfil...</p>}
      {error && <p style={{ color: '#e0b0b0' }}>{error}</p>}
      {!loading && !error && (
        <div className="widget-card">
          <h3>Datos de la cuenta</h3>
          <p><strong>Email:</strong> {perfil.email || user?.email || '-'}</p>
          {(perfil.rol || user?.rol) && <p><strong>Rol:</strong> {perfil.rol || user?.rol}</p>}
          {(perfil.id || perfil.id_usuario) && <p><strong>ID:</strong> {perfil.id || perfil.id_usuario}</p>}
          {raw && <pre style={{ marginTop: '1rem', whiteSpace: 'pre-wrap', fontSize: '.85rem', color: 'var(--text-secondary)' }}>{raw}</pre>}
          <div style={{ marginTop: '1rem', display: 'flex', gap: '.5rem' }}>
            <button className="btn-hero-secondary" style={{ cursor: 'pointer' }} onClick={load}>Actualizar</button>
            <button className="btn-hero-primary" style={{ border: 'none', cursor: 'pointer' }} onClick={doLogout}>Cerrar sesión</button>
          </div>
        </div>
      )}
    </section>
  )
}
