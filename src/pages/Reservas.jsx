import { useEffect, useState } from 'react'
import api, { getErrorMessage, normalizeList } from '../services/api'

function fmt(f) { if (!f) return '-'; try { return new Date(f).toLocaleString('es-BO') } catch { return f } }

export default function Reservas() {
  const [funciones, setFunciones] = useState([])
  const [loadingFunciones, setLoadingFunciones] = useState(true)
  const [form, setForm] = useState({ id_funcion: '', cantidad_entradas: 1, ci: '', nombre_completo: '', correo: '', telefono: '', es_estudiante_ucb: false })
  const [resMsg, setResMsg] = useState(''); const [resOk, setResOk] = useState(false); const [resCodigo, setResCodigo] = useState('')
  const [codigo, setCodigo] = useState(''); const [consulta, setConsulta] = useState(null); const [consultaMsg, setConsultaMsg] = useState('')

  useEffect(() => {
    (async () => {
      try { const { data } = await api.get('/funciones'); setFunciones(normalizeList(data)) } catch {}
      finally { setLoadingFunciones(false) }
    })()
  }, [])

  function onChange(e) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : (type === 'number' || name === 'id_funcion') ? (value === '' ? '' : Number(value)) : value }))
  }

  async function reservar(e) {
    e.preventDefault()
    setResMsg(''); setResOk(false); setResCodigo('')
    try {
      const payload = { ...form }
      if (!payload.telefono) delete payload.telefono
      const { data } = await api.post('/reservas', payload)
      const d = data.data || data
      setResCodigo(d.codigo_reserva || d.codigo || '')
      setResMsg(data.message || 'Reserva confirmada.')
      setResOk(true)
    } catch (err) {
      setResMsg(getErrorMessage(err, 'No se pudo registrar la reserva.'))
    }
  }

  async function consultarReserva(e) {
    e.preventDefault()
    setConsulta(null); setConsultaMsg('')
    try {
      const { data } = await api.get(`/reservas/codigo/${encodeURIComponent(codigo.trim())}`)
      setConsulta(data.data || data.reserva || data)
    } catch (err) {
      setConsultaMsg(getErrorMessage(err, 'No se encontró una reserva con ese código.'))
    }
  }

  return (
    <div>
      <section>
        <h2>Reservar Entradas</h2>
        <p>Selecciona una función y completa tus datos. Se generará un código de reserva (ej. BUCB-XXXX).</p>
        <form onSubmit={reservar} style={{ maxWidth: '620px' }}>
          <label>Función
            <select name="id_funcion" value={form.id_funcion} onChange={onChange} required>
              <option disabled value="">Selecciona una función</option>
              {funciones.map((f) => (
                <option key={f.id || f.id_funcion} value={f.id || f.id_funcion}>
                  #{f.id || f.id_funcion} - {f.titulo || f.obra?.titulo || ('Obra ' + f.id_obra)} | {fmt(f.fecha_hora)} | {f.lugar || 'Lugar por confirmar'} ({f.estado})
                </option>
              ))}
            </select>
          </label>
          <label>Cantidad de entradas<input type="number" min="1" max="10" name="cantidad_entradas" value={form.cantidad_entradas} onChange={onChange} required /></label>
          <label>CI<input type="text" name="ci" value={form.ci} onChange={onChange} required /></label>
          <label>Nombre completo<input type="text" name="nombre_completo" value={form.nombre_completo} onChange={onChange} required /></label>
          <label>Correo electrónico<input type="email" name="correo" value={form.correo} onChange={onChange} required /></label>
          <label>Teléfono<input type="text" name="telefono" value={form.telefono} onChange={onChange} /></label>
          <label style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}><input type="checkbox" name="es_estudiante_ucb" checked={form.es_estudiante_ucb} onChange={onChange} style={{ width: 'auto' }} /> Soy estudiante UCB</label>
          <button type="submit" className="btn-hero-primary" style={{ border: 'none', cursor: 'pointer' }}>Confirmar reserva</button>
          {resMsg && <p id="registro-msg" style={{ color: resOk ? 'var(--color-gold-light)' : '#ff8080' }}>{resMsg}</p>}
          {resCodigo && (
            <div className="widget-card" style={{ marginTop: '1rem' }}>
              <h3>Código de reserva</h3>
              <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-gold)' }}>{resCodigo}</p>
              <p>Guarda este código para consultar el estado de tu reserva.</p>
            </div>
          )}
        </form>
        {loadingFunciones && <p><small>Cargando funciones disponibles...</small></p>}
      </section>

      <section>
        <h2>Consultar Reserva por Código</h2>
        <form onSubmit={consultarReserva} style={{ maxWidth: '420px', display: 'flex', gap: '.5rem', flexWrap: 'wrap', alignItems: 'end' }}>
          <label style={{ flex: 1 }}>Código<input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="BUCB-XXXX" required /></label>
          <button type="submit" className="btn-hero-secondary" style={{ cursor: 'pointer' }}>Consultar</button>
        </form>
        {consultaMsg && <p style={{ color: '#e0b0b0' }}>{consultaMsg}</p>}
        {consulta && (
          <div className="widget-card" style={{ marginTop: '1rem', maxWidth: '720px' }}>
            <h3>Reserva {consulta.codigo_reserva || codigo}</h3>
            <p><strong>Estado:</strong> {consulta.estado}</p>
            <p><strong>Cantidad:</strong> {consulta.cantidad_entradas}</p>
            {consulta.funcion ? (
              <p><strong>Función:</strong> {consulta.funcion.titulo || consulta.funcion.id_obra} - {fmt(consulta.funcion.fecha_hora)} ({consulta.funcion.lugar})</p>
            ) : consulta.fecha_hora ? <p><strong>Fecha:</strong> {fmt(consulta.fecha_hora)}</p> : null}
            {consulta.espectador ? (
              <p><strong>Espectador:</strong> {consulta.espectador.nombre_completo} ({consulta.espectador.correo})</p>
            ) : consulta.nombre_completo ? <p><strong>Nombre:</strong> {consulta.nombre_completo}</p> : null}
          </div>
        )}
      </section>
    </div>
  )
}
