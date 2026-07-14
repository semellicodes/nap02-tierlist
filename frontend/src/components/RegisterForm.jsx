import { useState } from 'react'
import { Disc3, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import './LoginForm.css'

export default function RegisterForm({ onSwitchToLogin }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [codigo, setCodigo] = useState('')
  const [etapa, setEtapa] = useState('form')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    })

    setCarregando(false)

    if (error) {
      setErro(error.status >= 500 ? 'Erro ao enviar o email de confirmação. Tente novamente em instantes.' : error.message)
    } else {
      setEtapa('confirmar')
    }
  }

  async function handleConfirmar(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const { error } = await supabase.auth.verifyOtp({ email, token: codigo, type: 'signup' })

    setCarregando(false)
    if (error) setErro(error.message)
  }

  if (etapa === 'confirmar') {
    return (
      <div className="login-page">
        <div className="login-card login-card--register">
          <div className="login-logo">
            <Sparkles size={32} strokeWidth={1.8} />
            <Disc3 size={32} strokeWidth={1.8} />
          </div>
          <h1>Confirme seu email</h1>
          <p className="login-subtitle">Enviamos um código para {email}</p>

          <form onSubmit={handleConfirmar} className="login-form">
            <input
              type="text"
              placeholder="Código de confirmação"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary" disabled={carregando}>
              {carregando ? 'Aguarde...' : 'Confirmar'}
            </button>
          </form>

          {erro && <p className="login-message login-message--error">{erro}</p>}

          <button type="button" className="btn-link" onClick={onSwitchToLogin}>
            Já tenho conta, entrar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="login-card login-card--register">
        <div className="login-logo">
          <Sparkles size={32} strokeWidth={1.8} />
          <Disc3 size={32} strokeWidth={1.8} />
        </div>
        <h1>Criar conta</h1>
        <p className="login-subtitle">Monte sua Tier List</p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button type="submit" className="btn-primary" disabled={carregando}>
            {carregando ? 'Aguarde...' : 'Cadastrar'}
          </button>
        </form>

        {erro && <p className="login-message login-message--error">{erro}</p>}

        <button type="button" className="btn-link" onClick={onSwitchToLogin}>
          Já tenho conta, entrar
        </button>
      </div>
    </div>
  )
}
