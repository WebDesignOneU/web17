import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { getErrorMessage, normalizeList } from '../services/api'

function resumen(t = '') { return t.length > 220 ? t.slice(0, 220) + '…' : t }

export default function Noticias() {
  const [noticias, setNoticias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/noticias')
        setNoticias(normalizeList(data))
      } catch (e) { setError(getErrorMessage(e, 'No se pudieron cargar las noticias.')) }
      finally { setLoading(false) }
    })()
  }, [])

  return (
    <section>
      <h2>Noticias del Ballet UCB</h2>
      {loading && <p>Cargando noticias...</p>}
      {error && <p style={{ color: '#e0b0b0' }}>{error}</p>}
      {!loading && !error && (
        <div className="grid-layout grid-2-cols">
          {noticias.map((n) => (
            <article className="card" key={n.id || n.slug}>
              {n.imagen_url && <img src={n.imagen_url} alt={n.titulo} style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '8px', marginBottom: '.75rem' }} />}
              <h3>{n.titulo}</h3>
              {n.destacado && <p><small style={{ color: 'var(--color-gold)' }}>★ Destacado</small></p>}
              <p>{resumen(n.contenido)}</p>
              {n.slug && <Link to={`/noticias/${n.slug}`} className="btn-hero-primary" style={{ display: 'inline-flex', marginTop: '.5rem', border: 'none', fontSize: '.9rem', padding: '.45rem 1rem' }}>Leer noticia</Link>}
            </article>
          ))}
          {!noticias.length && <p>No hay noticias disponibles.</p>}
        </div>
      )}
    </section>
  )
}
