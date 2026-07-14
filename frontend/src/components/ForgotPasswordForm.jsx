import { useState } from 'react'
import { KeyRound, Disc3 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import './LoginForm.css'

export default function ForgotPasswordForm({ onSwitchToLogin }) {
  const [email, setEmail] = useState('')
  const [codigo, setCodigo] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [etapa, setEtapa] = useState('email')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleEnviarCodigo(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email)

    setCarregando(false)
    if (error) setErro(error.status >= 500 ? 'Erro ao enviar o código por email. Tente novamente em instantes.' : error.message)
    else setEtapa('redefinir')
  }

  async function handleRedefinir(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const { error: erroOtp } = await supabase.auth.verifyOtp({ email, token: codigo, type: 'recovery' })
    if (erroOtp) {
      setCarregando(false)
      setErro(erroOtp.message)
      return
    }

    const { error: erroSenha } = await supabase.auth.updateUser({ password: novaSenha })

    setCarregando(false)
    if (erroSenha) setErro(erroSenha.message)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <KeyRound size={32} strokeWidth={1.8} />
          <Disc3 size={32} strokeWidth={1.8} />
        </div>
        <h1>Redefinir senha</h1>
        <p className="login-subtitle">
          {etapa === 'email' ? 'Informe seu email' : `Enviamos um código para ${email}`}
        </p>

        {etapa === 'email' ? (
          <form onSubmit={handleEnviarCodigo} className="login-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary" disabled={carregando}>
              {carregando ? 'Aguarde...' : 'Enviar código'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRedefinir} className="login-form">
            <input
              type="text"
              placeholder="Código recebido por email"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Nova senha (mín. 6 caracteres)"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
              minLength={6}
            />
            <button type="submit" className="btn-primary" disabled={carregando}>
              {carregando ? 'Aguarde...' : 'Redefinir senha'}
            </button>
          </form>
        )}

        {erro && <p className="login-message login-message--error">{erro}</p>}

        <button type="button" className="btn-link" onClick={onSwitchToLogin}>
          Voltar para o login
        </button>
      </div>
    </div>
  )
}
