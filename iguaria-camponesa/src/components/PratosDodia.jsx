import { motion } from 'framer-motion'
import Separador from './Separador'

const especialidades = [
  { icon: '🍽️', nome: 'Prato do Dia' },
  { icon: '🏡', nome: 'Comida Caseira' },
  { icon: '🥪', nome: 'Francesinhas' },
  { icon: '🥘', nome: 'Cataplanas' },
  { icon: '🗺️', nome: 'Pratos Regionais' },
  { icon: '🍖', nome: 'Mistas de Carne e Peixe' },
  { icon: '🐷', nome: 'Porco Preto' },
  { icon: '🥩', nome: 'Carne Sul Americana' },
  { icon: '🔥', nome: 'Grelhados no Carvão' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1 },
  }),
}

export default function PratosDodia() {
  return (
    <>
      <section
        id="pratos"
        className="bg-castanho px-6 py-24 relative"
      >
        {/* top & bottom gold lines */}
        <div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: 'linear-gradient(to right, transparent, #C8892A 30%, #C8892A 70%, transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-[3px]"
          style={{ background: 'linear-gradient(to right, transparent, #C8892A 30%, #C8892A 70%, transparent)' }} />

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <span className="block font-cinzel text-[0.68rem] tracking-[0.38em] text-dourado uppercase mb-3">
              — Restaurante Iguaria Camponesa —
            </span>
            <h2 className="font-playfair text-[clamp(1.9rem,4vw,3rem)] text-creme mb-4">
              Especialidades
            </h2>
            <div className="w-14 h-[2px] bg-dourado mx-auto" />
          </motion.div>

          {/* Cards — 3×3 grid */}
          <div className="grid gap-5 grid-cols-2 md:grid-cols-3">
            {especialidades.map((e, i) => (
              <motion.div
                key={e.nome}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="relative border border-dourado/30 p-7 bg-fundo/45 flex flex-col items-center text-center
                           hover:border-dourado hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(200,137,42,0.12)]
                           transition-all duration-300 cursor-default"
              >
                <div className="absolute inset-[7px] border border-dourado/10 pointer-events-none" />
                <div className="text-4xl mb-4">{e.icon}</div>
                <h3 className="font-playfair text-[1.15rem] text-creme leading-snug">{e.nome}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Separador bg="#3D2B1F" />
    </>
  )
}
