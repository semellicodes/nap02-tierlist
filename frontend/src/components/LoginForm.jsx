import { useState } from 'react'
import { Clapperboard, Disc3 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import './LoginForm.css'

export default function LoginForm({ onSwitchToRegister, onSwitchToForgotPassword }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setCarregando(false)
    if (error) setErro(error.message)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <Clapperboard size={32} strokeWidth={1.8} />
          <Disc3 size={32} strokeWidth={1.8} />
        </div>
        <h1>Tier List</h1>
        <p className="login-subtitle">Organize seus filmes, séries e álbuns favoritos.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button type="submit" className="btn-primary" disabled={carregando}>
            {carregando ? 'Aguarde...' : 'Entrar'}
          </button>
        </form>

        {erro && <p className="login-message login-message--error">{erro}</p>}

        <button type="button" className="btn-link" onClick={onSwitchToForgotPassword}>
          Esqueci minha senha
        </button>
        <button type="button" className="btn-link" onClick={onSwitchToRegister}>
          Não tenho conta, cadastrar
        </button>
      </div>
    </div>
  )
}
