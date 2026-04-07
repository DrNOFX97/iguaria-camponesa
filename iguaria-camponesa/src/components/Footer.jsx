import { motion } from 'framer-motion'
import { Link } from 'react-scroll'
import logo from '../assets/logo.png'

/* ── Social SVGs ── */
const Facebook = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-dourado">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
)
const Instagram = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-dourado">
    <path d="M12 2c-2.716 0-3.056.012-4.123.06-1.064.049-1.791.218-2.427.465a4.902 4.902 0 00-1.772 1.153A4.902 4.902 0 002.525 5.45c-.247.636-.416 1.363-.465 2.427C2.012 8.944 2 9.284 2 12c0 2.717.012 3.056.06 4.122.049 1.065.218 1.792.465 2.428a4.902 4.902 0 001.153 1.772 4.902 4.902 0 001.772 1.153c.636.247 1.363.416 2.428.465C8.944 21.988 9.284 22 12 22c2.717 0 3.056-.012 4.122-.06 1.065-.049 1.792-.218 2.428-.465a4.902 4.902 0 001.772-1.153 4.902 4.902 0 001.153-1.772c.247-.636.416-1.363.465-2.428.048-1.066.06-1.405.06-4.122 0-2.716-.012-3.056-.06-4.122-.049-1.064-.218-1.791-.465-2.427a4.902 4.902 0 00-1.153-1.772A4.902 4.902 0 0018.45 2.525c-.636-.247-1.363-.416-2.428-.465C15.056 2.012 14.716 2 12 2zm0 1.802c2.67 0 2.986.01 4.04.058.977.045 1.504.207 1.857.344.467.182.8.399 1.15.748.349.35.566.683.748 1.15.137.353.3.88.344 1.857.048 1.055.058 1.37.058 4.041 0 2.67-.01 2.986-.058 4.04-.045.977-.207 1.504-.344 1.857a3.1 3.1 0 01-.748 1.15 3.1 3.1 0 01-1.15.748c-.353.137-.88.3-1.857.344-1.054.048-1.37.058-4.04.058-2.67 0-2.987-.01-4.04-.058-.977-.045-1.504-.207-1.858-.344a3.1 3.1 0 01-1.15-.748 3.1 3.1 0 01-.748-1.15c-.137-.353-.3-.88-.344-1.857-.048-1.054-.058-1.37-.058-4.04 0-2.671.01-2.987.058-4.041.045-.977.207-1.504.344-1.857.182-.467.399-.8.748-1.15a3.1 3.1 0 011.15-.748c.354-.137.881-.3 1.857-.344 1.055-.048 1.37-.058 4.041-.058zm0 3.063a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm6.538-8.671a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" />
  </svg>
)

const navLinks = [
  { label: 'Ementa',    to: 'pratos'   },
  { label: 'Galeria',   to: 'galeria'  },
  { label: 'Sobre Nós', to: 'sobre'    },
  { label: 'Reservas',  to: 'reservas' },
]

export default function Footer() {
  return (
    <footer className="bg-fundo border-t border-dourado/12 pt-14 pb-8 text-center px-6">
      {/* Arabesque separador */}
      <div className="mb-8 leading-none">
        <svg viewBox="0 0 420 28" xmlns="http://www.w3.org/2000/svg" fill="none" className="w-full max-w-md mx-auto h-7">
          <path d="M0,14 Q18,4 36,14 Q54,24 72,14 Q90,4 108,14 Q126,24 144,14 Q162,4 180,14 L193,14" stroke="#C8892A" strokeWidth="1" opacity="0.4" />
          <circle cx="200" cy="14" r="5"   fill="#C8892A" opacity="0.65" />
          <circle cx="188" cy="14" r="2.5" fill="#C8892A" opacity="0.3" />
          <circle cx="212" cy="14" r="2.5" fill="#C8892A" opacity="0.3" />
          <path d="M227,14 L240,14 Q258,4 276,14 Q294,24 312,14 Q330,4 348,14 Q366,24 384,14 Q402,4 420,14" stroke="#C8892A" strokeWidth="1" opacity="0.4" />
        </svg>
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-7"
      >
        <img src={logo} alt="Iguaria Camponesa" className="h-[200px] mx-auto opacity-85" />
      </motion.div>

      {/* Social icons */}
      <div className="flex justify-center gap-4 mb-7">
        {[
          { label: 'Facebook',  Icon: Facebook  },
          { label: 'Instagram', Icon: Instagram },
        ].map(({ label, Icon }) => (
          <a
            key={label}
            href="#"
            aria-label={label}
            className="w-10 h-10 border border-dourado/28 flex items-center justify-center
                       hover:border-dourado hover:bg-dourado/8 transition-all duration-300"
          >
            <Icon />
          </a>
        ))}
      </div>

      {/* Nav links */}
      <nav className="flex justify-center gap-8 flex-wrap mb-6">
        {navLinks.map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            smooth
            duration={600}
            offset={-76}
            className="font-cinzel text-[0.6rem] tracking-[0.2em] text-creme/38 uppercase
                       cursor-pointer hover:text-dourado transition-colors duration-300"
          >
            {label}
          </Link>
        ))}
      </nav>

      <p className="font-lora italic text-[0.75rem] text-creme/45">
        © 2025 Restaurante Iguaria Camponesa · Todos os direitos reservados
      </p>
    </footer>
  )
}
