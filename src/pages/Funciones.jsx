import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { getErrorMessage, normalizeList } from '../services/api'

function formatFecha(f) { if (!f) return '-'; try { return new Date(f).toLocaleString('es-BO') } catch { return f } }

export default function Funciones() {
  const [funciones, setFunciones] = useState([])
  const [obras, setObras] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingObras, setLoadingObras] = useState(true)
  const [error, setError] = useState('')
  const [estado, setEstado] = useState('')

  async function load(currentEstado = estado) {
    setLoading(true); setError('')
    try {
      const params = {}
      if (currentEstado) params.estado = currentEstado
      const { data } = await api.get('/funciones', { params })
      setFunciones(normalizeList(data))
    } catch (e) {
      setError(getErrorMessage(e, 'No se pudieron cargar las funciones.'))
    } finally { setLoading(false) }
  }

  useEffect(() => {
    load('')
    ;(async () => {
      try { const { data } = await api.get('/obras'); setObras(normalizeList(data)) } catch {}
      finally { setLoadingObras(false) }
    })()
  }, [])

  return (
    <div>
      <section>
        <h2>Funciones Programadas</h2>
        <p>Consulta las próximas presentaciones del Ballet UCB (datos desde la API).</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', margin: '1rem 0', alignItems: 'end' }}>
          <label>Estado
            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="">Todos</option>
              <option value="programada">Programada</option>
              <option value="agotada">Agotada</option>
              <option value="cancelada">Cancelada</option>
              <option value="finalizada">Finalizada</option>
            </select>
          </label>
          <button className="btn-hero-primary" style={{ border: 'none', cursor: 'pointer', padding: '.5rem 1rem' }} onClick={() => load(estado)}>Filtrar</button>
        </div>
        {loading && <p>Cargando funciones...</p>}
        {error && <p style={{ color: '#e0b0b0' }}>{error}</p>}
        {!loading && !error && (
          <div className="table-responsive">
            <table>
              <thead><tr><th>ID</th><th>Obra</th><th>Fecha y hora</th><th>Lugar</th><th>Capacidad</th><th>Estado</th><th></th></tr></thead>
              <tbody>
                {funciones.map((f) => (
                  <tr key={f.id || f.id_funcion}>
                    <td>{f.id || f.id_funcion}</td>
                    <td>{f.titulo || f.obra?.titulo || f.id_obra}</td>
                    <td>{formatFecha(f.fecha_hora)}</td>
                    <td>{f.lugar || '-'}</td>
                    <td>{f.capacidad_total ?? '-'}</td>
                    <td>{f.estado || '-'}</td>
                    <td><Link to="/reservas" className="btn-hero-secondary" style={{ fontSize: '.8rem', padding: '.3rem .7rem' }}>Reservar</Link></td>
                  </tr>
                ))}
                {!funciones.length && <tr><td colSpan="7">No hay funciones para los filtros seleccionados.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2>Obras del Repertorio</h2>
        {loadingObras && <p>Cargando obras...</p>}
        {!loadingObras && (
          <div className="grid-layout grid-3-cols">
            {obras.map((o) => (
              <article className="card" key={o.id || o.id_obra}>
                <h3>{o.titulo}</h3>
                <p>{o.descripcion || 'Sin descripción.'}</p>
                <Link to={`/obras/${o.id || o.id_obra}`} style={{ color: 'var(--color-gold)' }}>Ver funciones de la obra →</Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
