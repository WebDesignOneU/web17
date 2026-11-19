import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api, { getErrorMessage } from '../services/api'

export default function NoticiaDetalle() {
  const { slug } = useParams()
  const [noticia, setNoticia] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true); setError('')
    ;(async () => {
      try {
        const { data } = await api.get(`/noticias/${slug}`)
        if (!cancelled) setNoticia(data.data || data.noticia || data)
      } catch (e) {
        if (!cancelled) setError(getErrorMessage(e, 'No se pudo cargar la noticia.'))
      } finally { if (!cancelled) setLoading(false) }
    })()
    return () => { cancelled = true }
  }, [slug])

  return (
    <section>
      <p><Link to="/noticias">← Volver a noticias</Link></p>
      {loading && <p>Cargando noticia...</p>}
      {error && <p style={{ color: '#e0b0b0' }}>{error}</p>}
      {!loading && !error && noticia && (
        <article>
          <h2>{noticia.titulo}</h2>
          {noticia.destacado && <p><small style={{ color: 'var(--color-gold)' }}>★ Noticia destacada</small></p>}
          {noticia.imagen_url && <img src={noticia.imagen_url} alt={noticia.titulo} style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', borderRadius: '12px', margin: '1rem 0' }} />}
          <div style={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>{noticia.contenido}</div>
        </article>
      )}
    </section>
  )
}
