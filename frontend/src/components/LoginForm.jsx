import { useState } from 'react'
import { Clapperboard, Disc3 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import './LoginForm.css'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [modoCadastro, setModoCadastro] = useState(false)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setMensagem('')
    setCarregando(true)

    const { error } = modoCadastro
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    setCarregando(false)

    if (error) {
      setErro(error.message)
    } else if (modoCadastro) {
      setMensagem('Conta criada! Se a confirmação por email estiver ativa, verifique sua caixa de entrada.')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <Clapperboard size={32} strokeWidth={1.8} />
          <Disc3 size={32} strokeWidth={1.8} />
        </div>
        <h1>Tier List</h1>
        <p className="login-subtitle">Filmes &amp; Álbuns</p>

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
            placeholder="Senha (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button type="submit" className="btn-primary" disabled={carregando}>
            {carregando ? 'Aguarde...' : modoCadastro ? 'Cadastrar' : 'Entrar'}
          </button>
        </form>

        {erro && <p className="login-message login-message--error">{erro}</p>}
        {mensagem && <p className="login-message login-message--success">{mensagem}</p>}

        <button type="button" className="btn-link" onClick={() => setModoCadastro((v) => !v)}>
          {modoCadastro ? 'Já tenho conta, entrar' : 'Não tenho conta, cadastrar'}
        </button>
      </div>
    </div>
  )
}
