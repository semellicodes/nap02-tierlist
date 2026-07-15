import { Clapperboard, Disc3, LogOut } from 'lucide-react'
import './Header.css'

export default function Header({ user, onSignOut }) {
  const nome = user.user_metadata?.username || user.email

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__logo">
          <Clapperboard size={20} strokeWidth={2} />
          <Disc3 size={20} strokeWidth={2} />
        </span>
        <div>
          <h1>Tier List</h1>
          <p>Filmes &amp; Álbuns</p>
        </div>
      </div>
      <div className="app-header__user">
        <span className="app-header__email">{nome}</span>
        <button type="button" className="btn-outline" onClick={onSignOut}>
          <LogOut size={14} strokeWidth={2} />
          Sair
        </button>
      </div>
    </header>
  )
}
