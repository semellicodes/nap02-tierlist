import { useState } from 'react'
import { useSession } from './hooks/useSession'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import ForgotPasswordForm from './components/ForgotPasswordForm'
import TierListsScreen from './components/TierListsScreen'
import TierBoard from './components/TierBoard'
import Spinner from './components/Spinner'

function App() {
  const { session, loading, signOut } = useSession()
  const [tela, setTela] = useState('login')
  const [listaAtiva, setListaAtiva] = useState(null)

  if (loading) return <Spinner label="Carregando..." />

  if (!session) {
    if (tela === 'register') return <RegisterForm onSwitchToLogin={() => setTela('login')} />
    if (tela === 'forgot') return <ForgotPasswordForm onSwitchToLogin={() => setTela('login')} />
    return (
      <LoginForm
        onSwitchToRegister={() => setTela('register')}
        onSwitchToForgotPassword={() => setTela('forgot')}
      />
    )
  }

  if (!listaAtiva) {
    return <TierListsScreen session={session} onSignOut={signOut} onOpenList={setListaAtiva} />
  }

  return (
    <TierBoard
      session={session}
      tierList={listaAtiva}
      onSignOut={signOut}
      onBack={() => setListaAtiva(null)}
    />
  )
}

export default App
