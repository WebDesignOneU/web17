import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../services/api'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState('espectador')
  const [msg, setMsg] = useState('')
  const [ok, setOk] = useState(false)
  const { register } = useAuth()

  async function onSubmit(e) {
    e.preventDefault()
    setMsg(''); setOk(false)
    try {
      const data = await register(email, password, rol)
      setMsg(data?.message || 'Cuenta creada correctamente. Ahora puedes iniciar sesión.')
      setOk(true)
    } catch (err) {
      setMsg(getErrorMessage(err, 'No se pudo completar el registro.'))
    }
  }

  return (
    <section style={{ maxWidth: '520px', margin: '0 auto' }}>
      <h2>Crear Cuenta</h2>
      <p>Regístrate como espectador o postulante.</p>
      <form onSubmit={onSubmit}>
        <label>Correo electrónico<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Contraseña<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} /></label>
        <label>Rol
          <select value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="espectador">Espectador</option>
            <option value="postulante">Postulante</option>
          </select>
        </label>
        <button type="submit" className="btn-hero-primary" style={{ border: 'none', cursor: 'pointer' }}>Registrarme</button>
        {msg && <p style={{ color: ok ? 'var(--color-gold-light)' : '#ff8080', marginTop: '.75rem' }}>{msg}</p>}
      </form>
      <p style={{ marginTop: '1rem' }}>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </section>
  )
}
