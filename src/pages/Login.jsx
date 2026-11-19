import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/perfil'

  async function onSubmit(e) {
    e.preventDefault()
    setMsg('')
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setMsg(getErrorMessage(err, 'Credenciales inválidas o error del servidor.'))
    }
  }

  return (
    <section style={{ maxWidth: '520px', margin: '0 auto' }}>
      <h2>Iniciar Sesión</h2>
      <p>Accede con tu cuenta para gestionar tu perfil y reservas vinculadas.</p>
      <form onSubmit={onSubmit}>
        <label>Correo electrónico<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Contraseña<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        <button type="submit" className="btn-hero-primary" style={{ border: 'none', cursor: 'pointer' }}>Ingresar</button>
        {msg && <p style={{ color: '#ff8080', marginTop: '.75rem' }}>{msg}</p>}
      </form>
      <p style={{ marginTop: '1rem' }}>¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
    </section>
  )
}
