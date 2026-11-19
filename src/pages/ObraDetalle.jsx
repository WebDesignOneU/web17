import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api, { getErrorMessage } from '../services/api'

function formatFecha(f) { if (!f) return '-'; try { return new Date(f).toLocaleString('es-BO') } catch { return f } }

export default function ObraDetalle() {
  const { id } = useParams()
  const [obra, setObra] = useState(null)
  const [funciones, setFunciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true); setError('')
    ;(async () => {
      try {
        const { data } = await api.get(`/obras/${id}`)
        const payload = data.data || data.obra || data
        if (!cancelled) {
          setObra(payload)
          setFunciones(payload.funciones || data.funciones || [])
        }
      } catch (e) {
        if (!cancelled) setError(getErrorMessage(e, 'No se pudo cargar la obra.'))
      } finally { if (!cancelled) setLoading(false) }
    })()
    return () => { cancelled = true }
  }, [id])

  return (
    <section>
      <p><Link to="/funciones">← Volver a funciones</Link></p>
      {loading && <p>Cargando obra...</p>}
      {error && <p style={{ color: '#e0b0b0' }}>{error}</p>}
      {!loading && !error && obra && (
        <article>
          <h2>{obra.titulo}</h2>
          {obra.imagen_banner && <img src={obra.imagen_banner} alt={obra.titulo} style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', borderRadius: '12px', margin: '1rem 0' }} />}
          <p>{obra.descripcion || 'Sin descripción.'}</p>
          {obra.director && <p><strong>Director:</strong> {obra.director}</p>}

          <h3 style={{ marginTop: '2rem' }}>Funciones programadas</h3>
          {funciones.length ? (
            <div className="table-responsive">
              <table>
                <thead><tr><th>Fecha y hora</th><th>Lugar</th><th>Capacidad</th><th>Estado</th></tr></thead>
                <tbody>
                  {funciones.map((f) => (
                    <tr key={f.id || f.id_funcion}>
                      <td>{formatFecha(f.fecha_hora)}</td>
                      <td>{f.lugar || '-'}</td>
                      <td>{f.capacidad_total ?? '-'}</td>
                      <td>{f.estado || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p>No hay funciones registradas para esta obra.</p>}
        </article>
      )}
    </section>
  )
}
