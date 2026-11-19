import axios from 'axios'

// En desarrollo Vite proxyea /api hacia http://localhost:3000 (ver vite.config.js).
// En producción puede configurarse VITE_API_BASE_URL.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    return Promise.reject(err)
  }
)

export default api

export function getErrorMessage(err, fallback = 'Ocurrió un error.') {
  return err?.response?.data?.message || err?.message || fallback
}

export function normalizeList(data) {
  const v = data?.data ?? data?.obras ?? data?.noticias ?? data?.funciones ?? data?.elenco ?? data?.convocatorias ?? data?.items ?? data?.rows ?? data?.results ?? data
  return Array.isArray(v) ? v : []
}
