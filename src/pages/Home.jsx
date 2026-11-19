import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { getErrorMessage, normalizeList } from '../services/api'

function resumen(txt = '') { return txt.length > 140 ? txt.slice(0, 140) + '…' : txt }

export default function Home() {
  const [obras, setObras] = useState([])
  const [noticias, setNoticias] = useState([])
  const [loadingObras, setLoadingObras] = useState(true)
  const [loadingNoticias, setLoadingNoticias] = useState(true)
  const [obrasError, setObrasError] = useState('')
  const [noticiasError, setNoticiasError] = useState('')
  const [sub, setSub] = useState({ nombre: '', email: '' })
  const [subMsg, setSubMsg] = useState('')
  const carouselRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await api.get('/obras')
        if (!cancelled) setObras(normalizeList(data))
      } catch (e) {
        if (!cancelled) setObrasError(getErrorMessage(e, 'No se pudieron cargar las obras (verifica que la API esté disponible).'))
      } finally { if (!cancelled) setLoadingObras(false) }
    })()
    ;(async () => {
      try {
        const { data } = await api.get('/noticias', { params: { limit: 3 } })
        if (!cancelled) setNoticias(normalizeList(data))
      } catch (e) {
        if (!cancelled) setNoticiasError(getErrorMessage(e, 'No se pudieron cargar las noticias.'))
      } finally { if (!cancelled) setLoadingNoticias(false) }
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let instance = null
    const init = () => {
      if (window.BalletCarousel && document.getElementById('ballet-carousel')) {
        instance = new window.BalletCarousel('#ballet-carousel', { autoplayInterval: 4500, loop: true })
        carouselRef.current = instance
      } else {
        setTimeout(init, 100)
      }
    }
    init()
    return () => { if (instance?.destroy) instance.destroy() }
  }, [])

  async function suscribir(e) {
    e.preventDefault()
    setSubMsg('')
    try {
      await api.post('/suscriptores', { email: sub.email, nombre: sub.nombre })
      setSubMsg('¡Suscripción registrada correctamente!')
      setSub({ nombre: '', email: '' })
    } catch (err) {
      setSubMsg(getErrorMessage(err, 'No se pudo registrar la suscripción.'))
    }
  }

  return (
    <div>
      <section className="hero-banner" aria-label="Bienvenida">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-badge">Temporada de Gala 2026</span>
          <h2 className="hero-title">Pasión, Elegancia y Disciplina en el Escenario</h2>
          <p className="hero-subtitle">El Ballet UCB combina técnica clásica, expresión contemporánea y patrimonio folclórico boliviano.</p>
          <div className="hero-actions">
            <Link to="/funciones" className="btn-hero-primary"><span>Ver Funciones</span> →</Link>
            <Link to="/convocatorias" className="btn-hero-secondary"><span>Postular a Audiciones</span> ✦</Link>
          </div>
        </div>
      </section>

      <section className="stats-banner" aria-label="Estadísticas">
        <div className="stat-item"><span className="stat-number">15+</span><span className="stat-label">Años de Trayectoria</span></div>
        <div className="stat-item"><span className="stat-number">50+</span><span className="stat-label">Obras Representadas</span></div>
        <div className="stat-item"><span className="stat-number">30+</span><span className="stat-label">Bailarines</span></div>
        <div className="stat-item"><span className="stat-number">12</span><span className="stat-label">Premios Nacionales</span></div>
      </section>

      <section id="sobre-nosotros" className="grid-section">
        <div className="grid-layout grid-2-cols" style={{ alignItems: 'center', gap: '2rem' }}>
          <article>
            <h2>Formación Artística de Excelencia</h2>
            <p>Fundado bajo el Departamento de Cultura de la UCB, nuestra compañía reúne a estudiantes y bailarines dedicados al estudio profundo de la danza.</p>
            <blockquote>
              <p>"La danza es el lenguaje oculto del alma."</p>
              <footer>— <cite>Dirección Artística Ballet UCB</cite></footer>
            </blockquote>
          </article>
          <figure><img src="/assets/images/elenco-ucb.jpg" alt="Elenco UCB en ensayo" style={{ width: '100%', borderRadius: '12px' }} /></figure>
        </div>
      </section>

      <section id="galeria-carrusel" className="carousel-section">
        <div className="carousel-section-header">
          <h2>Galería de Producciones</h2>
          <p>Momentos destacados de nuestras presentaciones.</p>
        </div>
        <div id="ballet-carousel" className="carousel-container" role="region" aria-label="Carrusel">
          <div className="carousel-track-wrapper">
            <div className="carousel-track">
              <div className="carousel-slide active">
                <div className="carousel-image-box"><img src="/assets/images/carrusel-1.jpg" alt="Lago de los Cisnes" />
                  <div className="carousel-caption"><span className="carousel-tag">Clásico</span><h3>El Lago de los Cisnes</h3><p>Gala inaugural con la suite completa de Tchaikovsky.</p></div>
                </div>
              </div>
              <div className="carousel-slide">
                <div className="carousel-image-box"><img src="/assets/images/carrusel-2.jpg" alt="Contemporáneo" />
                  <div className="carousel-caption"><span className="carousel-tag">Contemporáneo</span><h3>Ecos del Silencio</h3><p>Obra neoclásica de movimiento fluido y luz cenital.</p></div>
                </div>
              </div>
              <div className="carousel-slide">
                <div className="carousel-image-box"><img src="/assets/images/carrusel-3.jpg" alt="Punta" />
                  <div className="carousel-caption"><span className="carousel-tag">Técnica</span><h3>El Rigor de la Punta</h3><p>Horas de barra detrás de cada pirueta.</p></div>
                </div>
              </div>
              <div className="carousel-slide">
                <div className="carousel-image-box"><img src="/assets/images/carrusel-4.jpg" alt="Luz escénica" />
                  <div className="carousel-caption"><span className="carousel-tag">Escenografía</span><h3>Soles de Primavera</h3><p>Montaje lumínico de alta intensidad.</p></div>
                </div>
              </div>
            </div>
          </div>
          <button className="carousel-btn-prev" type="button" aria-label="Anterior">‹</button>
          <button className="carousel-btn-next" type="button" aria-label="Siguiente">›</button>
          <div className="carousel-controls-bar">
            <div className="carousel-dots"></div>
            <div className="carousel-info-group">
              <span className="carousel-counter">1 / 4</span>
              <button className="carousel-play-pause" type="button"><span className="play-pause-icon">❚❚</span><span className="play-pause-text">Pausar</span></button>
            </div>
          </div>
        </div>
      </section>

      <section id="repertorio-destacado">
        <h2 style={{ textAlign: 'center' }}>Repertorio y Obras</h2>
        {loadingObras && <p style={{ textAlign: 'center' }}>Cargando obras desde la API...</p>}
        {obrasError && <p style={{ textAlign: 'center', color: '#e0b0b0' }}>{obrasError}</p>}
        {!loadingObras && !obrasError && (
          <div className="grid-layout grid-3-cols">
            {obras.map((obra) => (
              <article className="card" key={obra.id || obra.id_obra}>
                <img src={obra.imagen_banner || '/assets/images/danzas.jpg'} alt={obra.titulo} style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px' }} />
                <h3>{obra.titulo}</h3>
                <p>{obra.descripcion || 'Obra del repertorio del Ballet UCB.'}</p>
                {obra.director && <p><small><strong>Director:</strong> {obra.director}</small></p>}
                <Link to={`/obras/${obra.id || obra.id_obra}`} className="btn-hero-secondary" style={{ display: 'inline-flex', marginTop: '.5rem', fontSize: '.9rem', padding: '.5rem 1rem' }}>Ver detalle</Link>
              </article>
            ))}
            {!obras.length && <p style={{ textAlign: 'center' }}>No hay obras registradas por ahora.</p>}
          </div>
        )}
      </section>

      <section id="noticias-home">
        <h2>Últimas Noticias</h2>
        {loadingNoticias && <p>Cargando noticias...</p>}
        {noticiasError && <p style={{ color: '#e0b0b0' }}>{noticiasError}</p>}
        {!loadingNoticias && !noticiasError && (
          <div className="grid-layout grid-3-cols">
            {noticias.map((n) => (
              <article className="card" key={n.id || n.slug}>
                <h3>{n.titulo}</h3>
                <p>{resumen(n.contenido)}</p>
                {n.slug && <Link to={`/noticias/${n.slug}`} className="btn-hero-secondary" style={{ display: 'inline-flex', marginTop: '.5rem', fontSize: '.85rem', padding: '.4rem .9rem' }}>Leer más</Link>}
              </article>
            ))}
            {!noticias.length && <p>Aún no hay noticias publicadas.</p>}
          </div>
        )}
        <p style={{ marginTop: '1rem' }}><Link to="/noticias">Ver todas las noticias →</Link></p>
      </section>

      <section id="suscripcion">
        <h2>Suscríbete al boletín</h2>
        <p>Recibe novedades del Ballet UCB en tu correo.</p>
        <form onSubmit={suscribir} style={{ maxWidth: '520px' }}>
          <label>Nombre<input type="text" value={sub.nombre} onChange={(e) => setSub({ ...sub, nombre: e.target.value })} /></label>
          <label>Correo electrónico<input type="email" value={sub.email} onChange={(e) => setSub({ ...sub, email: e.target.value })} required /></label>
          <button type="submit" className="btn-hero-primary" style={{ border: 'none', cursor: 'pointer' }}>Suscribirme</button>
          {subMsg && <p id="registro-msg">{subMsg}</p>}
        </form>
      </section>
    </div>
  )
}
