import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const [navOpen, setNavOpen] = useState(false)
  const [isLight, setIsLight] = useState(false)
  const { user } = useAuth()

  function applyTheme(t) {
    const light = t === 'light'
    setIsLight(light)
    if (light) document.documentElement.setAttribute('data-theme', 'light')
    else document.documentElement.removeAttribute('data-theme')
    localStorage.setItem('ballet_theme', t)
  }

  useEffect(() => { applyTheme(localStorage.getItem('ballet_theme') || 'dark') }, [])

  const navClass = ({ isActive }) => isActive ? 'active' : undefined

  return (
    <header role="banner" className="animate-header">
      <div className="header-top">
        <div className="header-titles">
          <h1><Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Ballet UCB</Link></h1>
          <p><small>Universidad Católica Boliviana "San Pablo" | La Paz - Bolivia</small></p>
        </div>
        <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button id="theme-toggle" className="theme-toggle-btn" type="button" onClick={() => applyTheme(isLight ? 'dark' : 'light')} aria-label="Cambiar tema">
            <span>{isLight ? '☀️' : '🌙'}</span> <span>{isLight ? 'Modo Claro' : 'Modo Oscuro'}</span>
          </button>
          {!user ? (
            <Link to="/login" className="theme-toggle-btn" style={{ textDecoration: 'none' }}>Ingresar</Link>
          ) : (
            <Link to="/perfil" className="theme-toggle-btn" style={{ textDecoration: 'none' }}>{user.email || 'Mi perfil'}</Link>
          )}
        </div>
      </div>
      <nav aria-label="Navegación principal del sitio" className={navOpen ? 'is-open' : ''}>
        <button type="button" className="nav-toggle" aria-label="Abrir menú" aria-expanded={navOpen} onClick={() => setNavOpen(v => !v)}>
          <span className="nav-bars"><span></span><span></span><span></span></span> Menú
        </button>
        <ul>
          <li><NavLink to="/" end className={navClass} onClick={() => setNavOpen(false)}>Inicio</NavLink></li>
          <li><NavLink to="/noticias" className={navClass} onClick={() => setNavOpen(false)}>Noticias</NavLink></li>
          <li><NavLink to="/funciones" className={navClass} onClick={() => setNavOpen(false)}>Funciones</NavLink></li>
          <li><NavLink to="/elenco" className={navClass} onClick={() => setNavOpen(false)}>Elenco</NavLink></li>
          <li><NavLink to="/convocatorias" className={navClass} onClick={() => setNavOpen(false)}>Convocatorias</NavLink></li>
          <li><NavLink to="/reservas" className={navClass} onClick={() => setNavOpen(false)}>Reservas</NavLink></li>
        </ul>
      </nav>
    </header>
  )
}
