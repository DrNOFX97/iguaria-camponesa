import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, Clock, Mail } from 'lucide-react'
import { supabase } from '../lib/supabase'

const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75 } },
}

const INFO = [
  {
    Icon: MapPin,
    label: 'Morada',
    value: 'R. Abel Viana 37\n8005-226 Faro',
  },
  {
    Icon: Phone,
    label: 'Telefone / Reservas',
    value: '289 824 363\n962 401 644 · 917 812 306',
  },
  {
    Icon: Clock,
    label: 'Horário',
    value: 'Seg–Dom: 12h00–15h00 / 19h00–22h30\nFolga: Terça-feira',
  },
  {
    Icon: Mail,
    label: 'Email',
    value: 'geral@iguariacamponesa.pt',
  },
]

const today = new Date().toISOString().split('T')[0]

export default function Reservas() {
  const [enviado,  setEnviado]  = useState(false)
  const [erro,     setErro]     = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro(''); setLoading(true)

    const fd = new FormData(e.target)
    // Verificar disponibilidade no calendário antes de inserir
    const { data: cal } = await supabase
      .from('calendario')
      .select('estado')
      .eq('data', fd.get('data'))
      .maybeSingle()

    if (cal?.estado === 'Fechado') {
      setErro('O restaurante está fechado nessa data. Por favor escolha outra data ou contacte-nos.')
      setLoading(false)
      return
    }
    if (cal?.estado === 'Lotado') {
      setErro('Não há disponibilidade nessa data. Por favor escolha outra data ou contacte-nos por telefone.')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('reservas').insert({
      nome:     fd.get('nome'),
      telefone: fd.get('telefone'),
      data:     fd.get('data'),
      hora:     fd.get('hora'),
      pessoas:  fd.get('pessoas'),
      notas:    fd.get('notas') || null,
    })

    setLoading(false)
    if (error) {
      setErro('Ocorreu um erro ao enviar o pedido. Por favor tente novamente ou contacte-nos por telefone.')
      return
    }
    setEnviado(true)
    e.target.reset()
    setTimeout(() => setEnviado(false), 6000)
  }

  return (
    <section
      id="reservas"
      className="bg-castanho px-6 py-24 pb-36 md:pb-24 relative"
    >
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: 'linear-gradient(to right, transparent, #C8892A 30%, #C8892A 70%, transparent)' }}
      />

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-20 items-start">

        {/* ── Form ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <span className="block font-cinzel text-[0.68rem] tracking-[0.38em] text-dourado uppercase mb-4">
            — Reserve a sua mesa —
          </span>
          <h2 className="font-playfair text-[clamp(1.9rem,4vw,2.8rem)] text-creme mb-2">Reservas</h2>
          <div className="w-14 h-[2px] bg-dourado mb-8" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="res-nome" className="font-cinzel text-[0.62rem] tracking-[0.2em] text-dourado uppercase">Nome</label>
                <input id="res-nome" name="nome" type="text" placeholder="O seu nome" required className="input-ardosia" />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="res-tel" className="font-cinzel text-[0.62rem] tracking-[0.2em] text-dourado uppercase">Contacto</label>
                <input id="res-tel" name="telefone" type="tel" placeholder="+351 000 000 000" className="input-ardosia" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="res-data" className="font-cinzel text-[0.62rem] tracking-[0.2em] text-dourado uppercase">Data</label>
                <input id="res-data" name="data" type="date" min={today} required className="input-ardosia" />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="res-hora" className="font-cinzel text-[0.62rem] tracking-[0.2em] text-dourado uppercase">Hora</label>
                <select id="res-hora" name="hora" required className="input-ardosia">
                  <option value="">Selecionar hora</option>
                  {['12:00','12:30','13:00','13:30','19:00','19:30','20:00','20:30','21:00'].map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="res-pessoas" className="font-cinzel text-[0.62rem] tracking-[0.2em] text-dourado uppercase">Número de pessoas</label>
              <select id="res-pessoas" name="pessoas" required className="input-ardosia">
                <option value="">Selecionar</option>
                <option value="1 pessoa">1 pessoa</option>
                <option value="2 pessoas">2 pessoas</option>
                <option value="3–4 pessoas">3–4 pessoas</option>
                <option value="5–6 pessoas">5–6 pessoas</option>
                <option value="Grupo (mais de 6)">Grupo (mais de 6)</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="res-notas" className="font-cinzel text-[0.62rem] tracking-[0.2em] text-dourado uppercase">Notas especiais</label>
              <textarea
                id="res-notas"
                name="notas"
                rows={3}
                placeholder="Alergias, ocasião especial, preferências de mesa..."
                className="input-ardosia resize-none"
              />
            </div>

            {erro && (
              <p className="font-lora italic text-[0.8rem] text-vinho leading-relaxed">{erro}</p>
            )}

            <AnimatePresence mode="wait">
              {enviado ? (
                <motion.div
                  key="ok"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-cinzel text-[0.72rem] tracking-[0.15em] uppercase
                             text-fundo bg-[#3a7d44] py-4 px-8 text-center"
                >
                  ✓ Pedido recebido — entraremos em contacto!
                </motion.div>
              ) : (
                <motion.button
                  key="btn"
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="self-start font-cinzel text-[0.72rem] tracking-[0.15em] uppercase font-bold
                             bg-dourado text-fundo px-10 py-4 border-2 border-dourado
                             hover:bg-transparent hover:text-dourado transition-all duration-300
                             cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed
                             flex items-center gap-2"
                >
                  {loading
                    ? <><span className="w-3.5 h-3.5 border-2 border-fundo border-t-transparent rounded-full animate-spin" /> A enviar...</>
                    : 'Confirmar Reserva'
                  }
                </motion.button>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* ── Contactos ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.75, delay: 0.15 } } }}
          className="flex flex-col gap-7"
        >
          <div>
            <span className="block font-cinzel text-[0.68rem] tracking-[0.38em] text-dourado uppercase mb-4">
              — Como nos encontrar —
            </span>
            <h2 className="font-playfair text-[clamp(1.9rem,4vw,2.8rem)] text-creme mb-2">Contactos</h2>
            <div className="w-14 h-[2px] bg-dourado" />
          </div>

          {/* Google Maps iframe */}
          <div className="w-full h-80 overflow-hidden border border-dourado/30">
            <iframe
              title="Localização Iguaria Camponesa"
              src="https://maps.google.com/maps?q=R.+Abel+Viana+37,+8005-226+Faro&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ filter: 'saturate(0.5) contrast(1.25)', border: 0, display: 'block' }}
            />
          </div>

          {/* Info grid: 2 cols desktop, 1 col mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {INFO.map(({ Icon, label, value }) => (
              <div key={label} className="flex gap-3 items-start">
                <div className="w-10 h-10 border border-dourado/35 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={18} className="text-dourado" strokeWidth={1.5} />
                </div>
                <div>
                  <strong className="block font-cinzel text-[0.6rem] tracking-[0.2em] text-dourado uppercase mb-1">
                    {label}
                  </strong>
                  <span className="font-lora text-[0.9rem] text-creme leading-relaxed whitespace-pre-line">
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* ── Mobile fixed CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50 bg-fundo border-t border-dourado/30">
        <a
          href="#reservas"
          onClick={e => { e.preventDefault(); document.getElementById('reservas')?.scrollIntoView({ behavior: 'smooth' }) }}
          className="block w-full bg-dourado text-fundo font-cinzel font-bold text-[0.72rem]
                     tracking-[0.2em] uppercase text-center py-[1.05rem]
                     hover:bg-douradoPale transition-colors duration-300"
        >
          Reservar Mesa
        </a>
      </div>
    </section>
  )
}
