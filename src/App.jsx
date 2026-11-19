import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Noticias from './pages/Noticias'
import NoticiaDetalle from './pages/NoticiaDetalle'
import Funciones from './pages/Funciones'
import ObraDetalle from './pages/ObraDetalle'
import Elenco from './pages/Elenco'
import Convocatorias from './pages/Convocatorias'
import Reservas from './pages/Reservas'
import Login from './pages/Login'
import Register from './pages/Register'
import Perfil from './pages/Perfil'

export default function App() {
  return (
    <div>
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
      <Header />
      <main id="main-content" role="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/noticias/:slug" element={<NoticiaDetalle />} />
          <Route path="/funciones" element={<Funciones />} />
          <Route path="/obras/:id" element={<ObraDetalle />} />
          <Route path="/elenco" element={<Elenco />} />
          <Route path="/convocatorias" element={<Convocatorias />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
