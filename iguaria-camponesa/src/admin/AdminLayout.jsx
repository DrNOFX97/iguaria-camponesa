import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, CalendarCheck, UtensilsCrossed,
  BookOpen, Images, CalendarDays, LogOut, Menu as MenuIcon, X,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import logo from '../assets/logo.png'

const NAV = [
  { to: '/admin/dashboard',     label: 'Dashboard',     Icon: LayoutDashboard  },
  { to: '/admin/reservas',      label: 'Reservas',      Icon: CalendarCheck    },
  { to: '/admin/pratos-do-dia', label: 'Pratos do Dia', Icon: UtensilsCrossed  },
  { to: '/admin/menu',          label: 'Menu',          Icon: BookOpen         },
  { to: '/admin/galeria',       label: 'Galeria',       Icon: Images           },
  { to: '/admin/calendario',    label: 'Calendário',    Icon: CalendarDays     },
]

export default function AdminLayout() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [sideOpen,  setSideOpen]  = useState(false)
  const [session,   setSession]   = useState(null)
  const [carregado, setCarregado] = useState(false)

  // Verificar sessão — redireciona para login se não autenticado
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setCarregado(true)
      if (!session) navigate('/admin/login', { replace: true })
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
      if (!s) navigate('/admin/login', { replace: true })
    })
    return () => subscription.unsubscribe()
  }, [navigate])

  // Fechar sidebar no mobile ao mudar de rota
  useEffect(() => setSideOpen(false), [location.pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  const linkCls = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 text-[0.78rem] font-cinzel tracking-[0.12em] uppercase
     transition-colors duration-200 rounded-sm
     ${isActive
       ? 'bg-dourado/15 text-dourado border-l-2 border-dourado'
       : 'text-creme/60 hover:text-creme hover:bg-white/5 border-l-2 border-transparent'}`

  const Sidebar = () => (
    <aside className="flex flex-col h-full w-56 bg-fundo border-r border-dourado/15">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-dourado/15 flex items-center gap-3">
        <img src={logo} alt="IC Admin" className="h-10 opacity-90" />
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 flex flex-col gap-1 overflow-y-auto">
        {NAV.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} end={to === '/admin/dashboard'} className={linkCls}>
            <Icon size={16} strokeWidth={1.8} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer — utilizador + sair */}
      <div className="px-3 py-4 border-t border-dourado/15 flex flex-col gap-1">
        {session && (
          <div className="px-4 py-2 flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6dbf7e] flex-shrink-0" />
            <span className="font-cinzel text-[0.58rem] tracking-[0.12em] text-creme/40 uppercase truncate">
              {session.user.email}
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-[0.72rem] font-cinzel
                     tracking-[0.12em] uppercase text-creme/50 hover:text-vinho
                     hover:bg-white/5 transition-colors duration-200 rounded-sm"
        >
          <LogOut size={14} strokeWidth={1.8} />
          Sair
        </button>
      </div>
    </aside>
  )

  // Aguardar verificação de sessão antes de renderizar
  if (!carregado) return null

  return (
    <div className="min-h-screen bg-fundo flex">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sideOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="flex-shrink-0"><Sidebar /></div>
          <div className="flex-1 bg-black/60" onClick={() => setSideOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3
                        bg-fundo border-b border-dourado/15 sticky top-0 z-40">
          <button onClick={() => setSideOpen(v => !v)} className="text-creme/70 hover:text-dourado">
            {sideOpen ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
          <img src={logo} alt="IC Admin" className="h-9" />
          <button onClick={handleLogout} className="text-creme/50 hover:text-vinho">
            <LogOut size={18} />
          </button>
        </div>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
