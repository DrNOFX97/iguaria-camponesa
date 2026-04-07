import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-scroll'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.9, delay } },
})

export default function Hero() {
  const bgRef = useRef(null)

  // Parallax on scroll — throttled via requestAnimationFrame
  useEffect(() => {
    let raf = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        if (bgRef.current && y < window.innerHeight * 1.2) {
          bgRef.current.style.transform = `scale(1.12) translateY(${y * 0.25}px)`
        }
        raf = null
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: '100svh', minHeight: 580 }}
    >
      {/* Background image */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover will-change-transform"
        style={{
          backgroundImage:
            "url('/fotos/Frente noite.jpeg')",
          backgroundPosition: 'center 40%',
          transform: 'scale(1.12)',
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(13,9,5,0.97) 0%, rgba(13,9,5,0.62) 35%, rgba(13,9,5,0.22) 65%, rgba(13,9,5,0.5) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.p
          {...fade(0.3)}
          className="font-cinzel text-[0.7rem] tracking-[0.38em] text-dourado uppercase mb-6"
        >
          — Desde 1987, com orgulho —
        </motion.p>

        <motion.h1
          {...fade(0.55)}
          className="font-playfair text-[clamp(2.8rem,7.5vw,5.5rem)] font-bold text-creme leading-[1.08] mb-4"
          style={{ textShadow: '0 4px 30px rgba(0,0,0,0.55)' }}
        >
          Sabores que<br />
          <em className="italic text-dourado">contam histórias</em>
        </motion.h1>

        <motion.p
          {...fade(0.75)}
          className="font-lora italic text-douradoPale text-[clamp(0.95rem,2.2vw,1.2rem)] mb-10"
        >
          Cozinha portuguesa com alma alentejana,<br className="hidden sm:inline" /> servida com calma e generosidade
        </motion.p>

        <motion.div {...fade(0.95)} className="flex gap-4 justify-center flex-wrap">
          <Link
            to="pratos"
            smooth
            duration={600}
            offset={-76}
            className="font-cinzel text-[0.72rem] tracking-[0.15em] uppercase font-bold
                       bg-dourado text-fundo px-10 py-4 border-2 border-dourado cursor-pointer
                       hover:bg-transparent hover:text-dourado transition-all duration-300"
          >
            Ver Ementa
          </Link>
          <Link
            to="reservas"
            smooth
            duration={600}
            offset={-76}
            className="font-cinzel text-[0.72rem] tracking-[0.15em] uppercase font-semibold
                       bg-transparent text-creme px-10 py-4 border-2 border-vinho cursor-pointer
                       hover:bg-vinho transition-all duration-300"
          >
            Fazer Reserva
          </Link>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-cinzel text-[0.6rem] tracking-[0.25em] text-dourado uppercase">
          Descobrir
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-px h-10"
          style={{ background: 'linear-gradient(to bottom, #C8892A, transparent)' }}
        />
      </motion.div>
    </section>
  )
}
