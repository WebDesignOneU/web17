import { useEffect, useState } from 'react'
import api, { getErrorMessage, normalizeList } from '../services/api'

function formatRol(r) { return (r || '').replace(/_/g, ' ') }

export default function Elenco() {
  const [elenco, setElenco] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rol, setRol] = useState('')

  async function load(currentRol = rol) {
    setLoading(true); setError('')
    try {
      const params = {}
      if (currentRol) params.rol = currentRol
      const { data } = await api.get('/elenco', { params })
      setElenco(normalizeList(data))
    } catch (e) {
      setError(getErrorMessage(e, 'No se pudo cargar el elenco.'))
    } finally { setLoading(false) }
  }

  useEffect(() => { load('') }, [])

  return (
    <section>
      <h2>Elenco del Ballet UCB</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', margin: '1rem 0', alignItems: 'end' }}>
        <label>Rol
          <select value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="">Todos</option>
            <option value="solista">Solista</option>
            <option value="cuerpo_de_ballet">Cuerpo de ballet</option>
            <option value="director">Director</option>
            <option value="maestro">Maestro</option>
          </select>
        </label>
        <button className="btn-hero-primary" style={{ border: 'none', cursor: 'pointer', padding: '.5rem 1rem' }} onClick={() => load(rol)}>Filtrar</button>
      </div>
      {loading && <p>Cargando elenco...</p>}
      {error && <p style={{ color: '#e0b0b0' }}>{error}</p>}
      {!loading && !error && (
        <div className="grid-layout grid-3-cols">
          {elenco.map((m) => (
            <article className="card" key={m.id || m.id_integrante}>
              {m.fotografia_url && <img src={m.fotografia_url} alt={m.nombre_completo} style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '8px', marginBottom: '.5rem' }} />}
              <h3>{m.nombre_completo}</h3>
              <p><strong>Rol:</strong> {formatRol(m.rol)}</p>
              <p>{m.biografia || 'Integrante del elenco del Ballet UCB.'}</p>
              <p><small>{m.activo === false ? 'Inactivo' : 'Activo'}</small></p>
            </article>
          ))}
          {!elenco.length && <p>No se encontraron integrantes.</p>}
        </div>
      )}
    </section>
  )
}
