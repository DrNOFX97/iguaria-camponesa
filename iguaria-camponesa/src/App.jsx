import { Routes, Route, Navigate } from 'react-router-dom'

// ── Public site
import Header      from './components/Header'
import Hero        from './components/Hero'
import PratosSite  from './components/PratosDodia'
import GaleriaSite from './components/Galeria'
import Sobre       from './components/Sobre'
import ReservasSite from './components/Reservas'
import Footer      from './components/Footer'

// ── Admin
import AdminLayout   from './admin/AdminLayout'
import Login         from './admin/Login'
import Dashboard     from './admin/Dashboard'
import AdminReservas from './admin/Reservas'
import PratosDodia   from './admin/PratosDodia'
import Menu          from './admin/Menu'
import Galeria       from './admin/Galeria'
import Calendario    from './admin/Calendario'

function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PratosSite />
        <GaleriaSite />
        <Sobre />
        <ReservasSite />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/"             element={<HomePage />} />
      <Route path="/admin/login"  element={<Login />} />
      <Route path="/admin"        element={<AdminLayout />}>
        <Route index              element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard"   element={<Dashboard />} />
        <Route path="reservas"    element={<AdminReservas />} />
        <Route path="pratos-do-dia" element={<PratosDodia />} />
        <Route path="menu"        element={<Menu />} />
        <Route path="galeria"     element={<Galeria />} />
        <Route path="calendario"  element={<Calendario />} />
      </Route>
      <Route path="*"             element={<Navigate to="/" replace />} />
    </Routes>
  )
}
