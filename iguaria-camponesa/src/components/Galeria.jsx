import { motion } from 'framer-motion'
import Separador from './Separador'

const fotos = [
  {
    url: '/fotos/Sala 2.jpeg',
    titulo: 'O nosso espaço',
    sub: 'Interior acolhedor',
    span: 'col-span-2 row-span-2',
  },
  {
    url: '/fotos/Prato 1.jpeg',
    titulo: 'Pratos da casa',
    sub: 'Cozinha alentejana',
    span: '',
  },
  {
    url: '/fotos/Sala 3.jpeg',
    titulo: 'Sala Principal',
    sub: '60 lugares + esplanada',
    span: '',
  },
  {
    url: '/fotos/Prato 2.jpeg',
    titulo: 'Ambiente rústico',
    sub: 'Decoração tradicional',
    span: 'col-span-1 row-span-2',
  },
  {
    url: '/fotos/Bacalhau Grelhado.jpeg',
    titulo: 'Bacalhau Grelhado',
    sub: 'Receita da avó',
    span: '',
  },
]

const fadeUp = {
  hidden:   { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.08 },
  }),
}

export default function Galeria() {
  return (
    <>
      <section id="galeria" className="bg-fundo px-6 py-24">
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
              — A nossa casa —
            </span>
            <h2 className="font-playfair text-[clamp(1.9rem,4vw,3rem)] text-creme mb-4">
              Galeria
            </h2>
            <div className="w-14 h-[2px] bg-dourado mx-auto" />
          </motion.div>

          {/* Asymmetric grid — desktop */}
          <div
            className="hidden md:grid gap-[7px]"
            style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: '260px 220px' }}
          >
            {fotos.map((f, i) => (
              <motion.div
                key={f.titulo}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className={`relative overflow-hidden group cursor-zoom-in ${f.span}`}
              >
                <img
                  src={f.url}
                  alt={f.titulo}
                  className="w-full h-full object-cover transition-transform duration-[650ms] group-hover:scale-[1.09]"
                />
                <div className="absolute inset-0 bg-vinho/80 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400 p-4">
                  <span className="font-playfair italic text-[1.15rem] text-creme text-center">{f.titulo}</span>
                  <small className="font-cinzel text-[0.6rem] tracking-[0.2em] text-dourado uppercase">{f.sub}</small>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile: 2-col grid */}
          <div className="md:hidden grid grid-cols-2 gap-2">
            {fotos.map((f, i) => (
              <motion.div
                key={f.titulo}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="relative overflow-hidden group h-40 cursor-zoom-in"
              >
                <img src={f.url} alt={f.titulo} className="w-full h-full object-cover transition-transform duration-[650ms] group-hover:scale-[1.09]" />
                <div className="absolute inset-0 bg-vinho/75 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2">
                  <span className="font-playfair italic text-[0.95rem] text-creme text-center">{f.titulo}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Separador bg="#0D0905" />
    </>
  )
}
