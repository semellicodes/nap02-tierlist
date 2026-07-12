import { useSession } from './hooks/useSession'
import LoginForm from './components/LoginForm'
import TierBoard from './components/TierBoard'

function App() {
  const { session, loading, signOut } = useSession()

  if (loading) return null

  return session ? <TierBoard session={session} onSignOut={signOut} /> : <LoginForm />
}

export default App
