import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, CalendarCheck, UtensilsCrossed,
  BookOpen, Images, CalendarDays, LogOut, Menu as MenuIcon, X,
  KeyRound, LogIn as LogInIcon,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import logo from '../assets/logo.png'

const NAV = [
  { to: '/admin/dashboard',    label: 'Dashboard',     Icon: LayoutDashboard  },
  { to: '/admin/reservas',     label: 'Reservas',      Icon: CalendarCheck    },
  { to: '/admin/pratos-do-dia',label: 'Pratos do Dia', Icon: UtensilsCrossed  },
  { to: '/admin/menu',         label: 'Menu',          Icon: BookOpen         },
  { to: '/admin/galeria',      label: 'Galeria',       Icon: Images           },
  { to: '/admin/calendario',   label: 'Calendário',    Icon: CalendarDays     },
]

export default function AdminLayout() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const [sideOpen,  setSideOpen]  = useState(false)
  const [session,   setSession]   = useState(null)     // Supabase session (optional)
  const [authPanel, setAuthPanel] = useState(false)    // show auth form in sidebar
  const [authEmail, setAuthEmail] = useState('')
  const [authPass,  setAuthPass]  = useState('')
  const [authErr,   setAuthErr]   = useState('')
  const [authLoad,  setAuthLoad]  = useState(false)

  // Track Supabase session (optional — not required to access admin)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  // Close sidebar on route change (mobile)
  useEffect(() => setSideOpen(false), [location.pathname])

  const handleLogout = () => navigate('/admin/login', { replace: true })

  const handleSupabaseSignIn = async (e) => {
    e.preventDefault()
    setAuthErr(''); setAuthLoad(true)
    const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPass })
    setAuthLoad(false)
    if (error) setAuthErr('Credenciais inválidas.')
    else { setAuthPanel(false); setAuthEmail(''); setAuthPass('') }
  }

  const handleSupabaseSignOut = async () => {
    await supabase.auth.signOut()
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

      {/* Footer — auth area */}
      <div className="px-3 py-4 border-t border-dourado/15 flex flex-col gap-1">

        {/* Supabase auth block */}
        {session ? (
          <>
            <div className="px-4 py-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6dbf7e]" />
              <span className="font-cinzel text-[0.58rem] tracking-[0.12em] text-creme/40 uppercase truncate">
                {session.user.email}
              </span>
            </div>
            <button
              onClick={handleSupabaseSignOut}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-[0.72rem] font-cinzel
                         tracking-[0.12em] uppercase text-creme/40 hover:text-vinho
                         hover:bg-white/5 transition-colors duration-200 rounded-sm"
            >
              <KeyRound size={14} strokeWidth={1.8} /> Desligar Supabase
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setAuthPanel(v => !v)}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-[0.72rem] font-cinzel
                         tracking-[0.12em] uppercase text-creme/35 hover:text-dourado
                         hover:bg-white/5 transition-colors duration-200 rounded-sm"
            >
              <KeyRound size={14} strokeWidth={1.8} />
              {authPanel ? 'Cancelar' : 'Auth Supabase'}
            </button>

            {authPanel && (
              <form onSubmit={handleSupabaseSignIn} className="px-2 pt-1 pb-2 flex flex-col gap-2">
                <input
                  type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                  placeholder="email" required
                  className="w-full px-2 py-1.5 bg-castanho border border-dourado/20 text-creme
                             font-lora text-xs outline-none focus:border-dourado/50 placeholder:text-creme/25"
                />
                <input
                  type="password" value={authPass} onChange={e => setAuthPass(e.target.value)}
                  placeholder="password" required
                  className="w-full px-2 py-1.5 bg-castanho border border-dourado/20 text-creme
                             font-lora text-xs outline-none focus:border-dourado/50 placeholder:text-creme/25"
                />
                {authErr && <p className="font-lora text-[0.7rem] italic text-vinho">{authErr}</p>}
                <button
                  type="submit" disabled={authLoad}
                  className="flex items-center justify-center gap-1.5 py-1.5 bg-dourado/90 text-fundo
                             font-cinzel text-[0.58rem] tracking-[0.12em] uppercase
                             hover:bg-dourado disabled:opacity-50 transition-colors"
                >
                  {authLoad
                    ? <span className="w-3 h-3 border border-fundo border-t-transparent rounded-full animate-spin" />
                    : <><LogInIcon size={11} /> Ligar</>
                  }
                </button>
              </form>
            )}
          </>
        )}

        {/* Sair do painel */}
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
