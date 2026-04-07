import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-scroll'
import logo from '../assets/logo.png'

const navLinks = [
  { label: 'Ementa',   to: 'pratos' },
  { label: 'Galeria',  to: 'galeria' },
  { label: 'Sobre Nós', to: 'sobre' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // lock body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <>
      {/* ── Fixed bar ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-[800] border-b border-dourado/25 transition-all duration-300 px-6
          ${scrolled ? 'bg-fundo/99 backdrop-blur-sm' : 'bg-fundo/95 backdrop-blur-md'}`}
      >
        {/* wood-grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, rgba(200,137,42,.004) 0,rgba(200,137,42,.004) 1px,transparent 1px,transparent 60px), repeating-linear-gradient(180deg, rgba(0,0,0,.05) 0,rgba(0,0,0,.05) 1px,transparent 1px,transparent 12px)',
          }}
        />

        <div className="max-w-6xl mx-auto h-[76px] flex items-center justify-between relative">
          {/* Logo */}
          <Link to="hero" smooth duration={600} className="cursor-pointer">
            <img src={logo} alt="Iguaria Camponesa" className="h-[68px] brightness-105" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                smooth
                duration={600}
                offset={-76}
                className="font-cinzel text-[0.7rem] tracking-[0.18em] text-douradoPale uppercase
                           cursor-pointer hover:text-dourado transition-colors duration-300
                           focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-dourado focus-visible:ring-offset-2 focus-visible:ring-offset-fundo"
              >
                {label}
              </Link>
            ))}
            <Link
              to="reservas"
              smooth
              duration={600}
              offset={-76}
              className="font-cinzel text-[0.7rem] tracking-[0.15em] uppercase font-bold
                         bg-dourado text-fundo px-5 py-2 cursor-pointer
                         hover:bg-douradoPale transition-colors duration-300"
            >
              Reservar Mesa
            </Link>
          </nav>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-1 bg-transparent border-none cursor-pointer"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu"
          >
            <span className={`block w-6 h-[2px] bg-dourado transition-all duration-300 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block w-6 h-[2px] bg-dourado transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-[2px] bg-dourado transition-all duration-300 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-[799] flex flex-col items-center justify-center gap-10
                       bg-fundo/98"
            style={{ top: 76 }}
          >
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                smooth
                duration={600}
                offset={-76}
                onClick={close}
                className="font-cinzel text-lg tracking-[0.22em] text-douradoPale uppercase
                           cursor-pointer hover:text-dourado transition-colors duration-300"
              >
                {label}
              </Link>
            ))}
            <Link
              to="reservas"
              smooth
              duration={600}
              offset={-76}
              onClick={close}
              className="font-cinzel text-lg tracking-[0.22em] text-dourado uppercase cursor-pointer
                         hover:text-douradoPale transition-colors duration-300"
            >
              Reservas
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
