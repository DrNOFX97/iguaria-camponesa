import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import logo from '../assets/logo.png'

export default function Login() {
  const navigate  = useNavigate()
  const [email,   setEmail]   = useState('')
  const [pass,    setPass]    = useState('')
  const [erro,    setErro]    = useState('')
  const [loading, setLoading] = useState(false)
  const [modo,    setModo]    = useState('google') // 'google' | 'email'

  const handleGoogle = async () => {
    setErro(''); setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/admin/dashboard` },
    })
    if (error) { setErro('Erro ao iniciar sessão com Google.'); setLoading(false) }
    // Se OK, o Supabase redireciona automaticamente
  }

  const handleEmail = async (e) => {
    e.preventDefault()
    setErro(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
    setLoading(false)
    if (error) setErro('Email ou password incorrectos.')
    else navigate('/admin/dashboard', { replace: true })
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
        <div className="relative border border-dourado/25 bg-castanho/40 p-8 backdrop-blur-sm">
          <div
            className="absolute top-0 left-0 right-0 h-[2px] rounded-sm"
            style={{ background: 'linear-gradient(to right, transparent, #C8892A, transparent)' }}
          />

          <div className="flex flex-col gap-5">
            <p className="font-lora italic text-sm text-creme/50 text-center leading-relaxed">
              Acesso ao painel de gestão do restaurante.
            </p>

            {/* Erro */}
            {erro && (
              <div className="flex items-center gap-2 bg-vinho/20 border border-vinho/40 px-3 py-2">
                <AlertCircle size={14} className="text-vinho flex-shrink-0" />
                <p className="font-lora text-[0.78rem] text-vinho">{erro}</p>
              </div>
            )}

            {/* Google OAuth — botão principal */}
            {modo === 'google' && (
              <>
                <button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="flex items-center justify-center gap-3 w-full
                             font-cinzel text-[0.7rem] tracking-[0.15em] uppercase font-bold
                             bg-dourado text-fundo py-3.5 border-2 border-dourado
                             hover:bg-transparent hover:text-dourado
                             transition-all duration-300 cursor-pointer disabled:opacity-50"
                >
                  {loading
                    ? <span className="w-4 h-4 border-2 border-fundo border-t-transparent rounded-full animate-spin" />
                    : (
                      <>
                        {/* Google icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Entrar com Google
                      </>
                    )
                  }
                </button>

                <button
                  onClick={() => { setModo('email'); setErro('') }}
                  className="font-lora italic text-[0.75rem] text-creme/30 hover:text-creme/60
                             text-center transition-colors duration-200 cursor-pointer"
                >
                  Usar email e password
                </button>
              </>
            )}

            {/* Email + password — alternativa */}
            {modo === 'email' && (
              <form onSubmit={handleEmail} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="login-email" className="font-cinzel text-[0.6rem] tracking-[0.2em] text-dourado uppercase">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-creme/30" />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="w-full pl-8 pr-3 py-2.5 bg-castanho border border-dourado/20 text-creme
                                 font-lora text-sm outline-none focus:border-dourado/50 placeholder:text-creme/25"
                      placeholder="admin@exemplo.pt"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="login-pass" className="font-cinzel text-[0.6rem] tracking-[0.2em] text-dourado uppercase">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-creme/30" />
                    <input
                      id="login-pass"
                      type="password"
                      value={pass}
                      onChange={e => setPass(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="w-full pl-8 pr-3 py-2.5 bg-castanho border border-dourado/20 text-creme
                                 font-lora text-sm outline-none focus:border-dourado/50 placeholder:text-creme/25"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full mt-1
                             font-cinzel text-[0.7rem] tracking-[0.15em] uppercase font-bold
                             bg-dourado text-fundo py-3.5 border-2 border-dourado
                             hover:bg-transparent hover:text-dourado
                             transition-all duration-300 cursor-pointer disabled:opacity-50"
                >
                  {loading
                    ? <span className="w-4 h-4 border-2 border-fundo border-t-transparent rounded-full animate-spin" />
                    : <><LogIn size={15} /> Entrar</>
                  }
                </button>

                <button
                  type="button"
                  onClick={() => { setModo('google'); setErro('') }}
                  className="font-lora italic text-[0.75rem] text-creme/30 hover:text-creme/60
                             text-center transition-colors duration-200 cursor-pointer"
                >
                  ← Voltar ao Google
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center font-lora italic text-[0.75rem] text-creme/25 mt-6">
          Área restrita — Restaurante Iguaria Camponesa
        </p>
      </div>
    </div>
  )
}
