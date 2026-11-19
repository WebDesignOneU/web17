import { useEffect, useRef, useState } from 'react'
import api, { getErrorMessage, normalizeList } from '../services/api'

function fmt(f) { if (!f) return '-'; try { return new Date(f).toLocaleDateString('es-BO') } catch { return f } }

const initialForm = { nombre_completo: '', ci: '', email: '', telefono: '', carrera_ucb: '', experiencia_anios: 0, estilo_danza: '', link_video_demo: '' }

export default function Convocatorias() {
  const [convocatorias, setConvocatorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [seleccionada, setSeleccionada] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [msg, setMsg] = useState('')
  const [msgOk, setMsgOk] = useState(false)
  const formRef = useRef(null)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/convocatorias')
        setConvocatorias(normalizeList(data))
      } catch (e) { setError(getErrorMessage(e, 'No se pudieron cargar las convocatorias.')) }
      finally { setLoading(false) }
    })()
  }, [])

  function seleccionar(c) {
    setSeleccionada(c); setMsg('')
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  function onChange(e) {
    const { name, value, type } = e.target
    setForm((f) => ({ ...f, [name]: type === 'number' ? Number(value) : value }))
  }

  async function enviar(e) {
    e.preventDefault()
    setMsg(''); setMsgOk(false)
    try {
      const id = seleccionada.id || seleccionada.id_convocatoria
      const payload = { ...form }
      if (!payload.carrera_ucb) delete payload.carrera_ucb
      if (!payload.link_video_demo) delete payload.link_video_demo
      if (!payload.estilo_danza) delete payload.estilo_danza
      const { data } = await api.post(`/convocatorias/${id}/postulaciones`, payload)
      setMsg(data?.message || '¡Postulación enviada correctamente!')
      setMsgOk(true)
      setForm(initialForm)
    } catch (err) {
      setMsg(getErrorMessage(err, 'No se pudo enviar la postulación.'))
    }
  }

  return (
    <div>
      <section>
        <h2>Convocatorias</h2>
        {loading && <p>Cargando convocatorias...</p>}
        {error && <p style={{ color: '#e0b0b0' }}>{error}</p>}
        {!loading && !error && (
          <div className="grid-layout grid-2-cols">
            {convocatorias.map((c) => (
              <article className="card" key={c.id || c.id_convocatoria}>
                <h3>{c.titulo}</h3>
                <p><strong>Estado:</strong> {c.estado || '-'}</p>
                <p><strong>Inicio:</strong> {fmt(c.fecha_inicio)} &nbsp; <strong>Fin:</strong> {fmt(c.fecha_fin)}</p>
                <p>{c.requisitos || 'Consulta los requisitos con la dirección.'}</p>
                {c.total_postulaciones != null && <p><small>Postulaciones: {c.total_postulaciones}</small></p>}
                <button className="btn-hero-primary" style={{ border: 'none', cursor: 'pointer', marginTop: '.5rem', padding: '.45rem 1rem' }} onClick={() => seleccionar(c)}>Postularme</button>
              </article>
            ))}
            {!convocatorias.length && <p>No hay convocatorias disponibles.</p>}
          </div>
        )}
      </section>

      {seleccionada && (
        <section id="form-postulacion" ref={formRef}>
          <h2>Formulario de Postulación</h2>
          <p>Convocatoria: <strong>{seleccionada.titulo}</strong> (ID {seleccionada.id || seleccionada.id_convocatoria})</p>
          <form onSubmit={enviar} style={{ maxWidth: '620px' }}>
            <label>Nombre completo<input type="text" name="nombre_completo" value={form.nombre_completo} onChange={onChange} required /></label>
            <label>CI<input type="text" name="ci" value={form.ci} onChange={onChange} required /></label>
            <label>Correo electrónico<input type="email" name="email" value={form.email} onChange={onChange} required /></label>
            <label>Teléfono<input type="text" name="telefono" value={form.telefono} onChange={onChange} required /></label>
            <label>Carrera UCB<input type="text" name="carrera_ucb" value={form.carrera_ucb} onChange={onChange} /></label>
            <label>Años de experiencia<input type="number" min="0" name="experiencia_anios" value={form.experiencia_anios} onChange={onChange} /></label>
            <label>Estilo de danza<input type="text" name="estilo_danza" value={form.estilo_danza} onChange={onChange} placeholder="Clásico, contemporáneo, folklórico..." /></label>
            <label>Link video demo<input type="url" name="link_video_demo" value={form.link_video_demo} onChange={onChange} placeholder="https://..." /></label>
            <button type="submit" className="btn-hero-primary" style={{ border: 'none', cursor: 'pointer' }}>Enviar postulación</button>
            {msg && <p id="registro-msg" style={{ color: msgOk ? 'var(--color-gold-light)' : '#ff8080' }}>{msg}</p>}
          </form>
        </section>
      )}
    </div>
  )
}
