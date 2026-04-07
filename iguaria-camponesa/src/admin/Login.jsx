import { useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import logo from '../assets/logo.png'

export default function Login() {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/admin/dashboard', { replace: true })
  }

  return (
    <div
      className="min-h-screen bg-fundo flex items-center justify-center px-4"
      style={{
        backgroundImage:
          'linear-gradient(45deg, rgba(200,137,42,.018) 25%, transparent 25%), linear-gradient(-45deg, rgba(200,137,42,.018) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(200,137,42,.018) 75%), linear-gradient(-45deg, transparent 75%, rgba(200,137,42,.018) 75%)',
        backgroundSize: '38px 38px',
        backgroundPosition: '0 0, 0 19px, 19px -19px, -19px 0',
      }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <img src={logo} alt="Iguaria Camponesa" className="h-20 mx-auto mb-4 opacity-90" />
          <p className="font-cinzel text-[0.65rem] tracking-[0.3em] text-dourado uppercase">
            Painel de Administração
          </p>
        </div>

        {/* Card */}
        <div className="border border-dourado/25 bg-castanho/40 p-8 backdrop-blur-sm">
          <div
            className="absolute top-0 left-0 right-0 h-[2px] rounded-sm"
            style={{ background: 'linear-gradient(to right, transparent, #C8892A, transparent)' }}
          />

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <p className="font-lora italic text-sm text-creme/50 text-center leading-relaxed">
              Acesso ao painel de gestão do restaurante.
            </p>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full
                         font-cinzel text-[0.7rem] tracking-[0.15em] uppercase font-bold
                         bg-dourado text-fundo py-3.5 border-2 border-dourado
                         hover:bg-transparent hover:text-dourado
                         transition-all duration-300 cursor-pointer"
            >
              <LogIn size={15} /> Entrar
            </button>
          </form>
        </div>

        <p className="text-center font-lora italic text-[0.75rem] text-creme/25 mt-6">
          Área restrita — Restaurante Iguaria Camponesa
        </p>
      </div>
    </div>
  )
}
