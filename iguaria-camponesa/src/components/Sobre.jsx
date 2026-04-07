import { motion } from 'framer-motion'
import Separador from './Separador'

const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75 } },
}

const details = [
  { label: 'Horário',           value: 'Seg–Dom: 12h–15h / 19h–22h30' },
  { label: 'Folga',             value: 'Terça-feira' },
  { label: 'Capacidade',        value: '60 lugares + esplanada' },
  { label: 'Estacionamento',    value: 'Gratuito em frente' },
]

export default function Sobre() {
  return (
    <>
      <section
        id="sobre"
        className="bg-fundo px-6 py-24 relative overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(45deg, rgba(200,137,42,.022) 25%, transparent 25%), linear-gradient(-45deg, rgba(200,137,42,.022) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(200,137,42,.022) 75%), linear-gradient(-45deg, transparent 75%, rgba(200,137,42,.022) 75%)',
          backgroundSize: '38px 38px',
          backgroundPosition: '0 0, 0 19px, 19px -19px, -19px 0',
        }}
      >
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-20 items-center relative">

          {/* Photo with double golden frame */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="relative"
          >
            <div className="relative">
              <img
                src="/fotos/Sala 1.jpeg"
                alt="Restaurante Iguaria Camponesa"
                className="w-full object-cover"
                style={{ height: 450, filter: 'sepia(15%) contrast(1.08)' }}
              />
              {/* outer frame */}
              <div className="absolute pointer-events-none border-2 border-dourado" style={{ inset: -13 }} />
              {/* inner frame */}
              <div className="absolute pointer-events-none border border-dourado/35" style={{ inset: -7 }} />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.75, delay: 0.15 } } }}
            className="relative pl-8"
          >
            {/* vertical gold line */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[2px]"
              style={{ background: 'linear-gradient(to bottom, transparent, #C8892A 30%, #C8892A 70%, transparent)' }}
            />

            <span className="block font-cinzel text-[0.68rem] tracking-[0.38em] text-dourado uppercase mb-4">
              — A nossa história —
            </span>
            <h2 className="font-playfair text-[clamp(2rem,4vw,3rem)] text-creme mb-6 leading-tight">
              Uma tasca<br />com orgulho
            </h2>

            <blockquote className="font-playfair italic text-[1.4rem] text-douradoPale leading-relaxed mb-7">
              <span className="text-dourado text-[3rem] leading-none align-[-0.4em] mr-1">"</span>
              Comer bem não é luxo — é tradição.
            </blockquote>

            <p className="font-lora text-[0.97rem] leading-[1.85] text-creme/78 mb-5">
              Desde 1987 que a Iguaria Camponesa serve a cozinha que os avós faziam com calma e amor: ingredientes da terra, receitas de família, e uma mesa sempre posta para quem chega.
            </p>
            <p className="font-lora text-[0.97rem] leading-[1.85] text-creme/78 mb-8">
              Somos uma tasca nobre — não no preço, mas no orgulho. Cada prato conta uma história do Alentejo e do Algarve, dos campos dourados e do mar ali ao lado.
            </p>

            <div className="grid grid-cols-2 gap-5">
              {details.map(({ label, value }) => (
                <div key={label} className="border-t border-dourado/25 pt-3">
                  <strong className="block font-cinzel text-[0.62rem] tracking-[0.2em] text-dourado uppercase mb-1">
                    {label}
                  </strong>
                  <span className="font-lora text-[0.9rem] text-creme">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      <Separador bg="#0D0905" />
    </>
  )
}
