import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useTierLists } from '../hooks/useTierLists'
import Header from './Header'
import './TierListsScreen.css'

export default function TierListsScreen({ session, onSignOut, onOpenList }) {
  const { listas, carregando, erro, criar, renomear, excluir } = useTierLists(session.access_token)
  const [novoNome, setNovoNome] = useState('')

  function handleCriar(e) {
    e.preventDefault()
    const nome = novoNome.trim()
    if (!nome) return
    criar(nome)
    setNovoNome('')
  }

  function handleRenomear(lista) {
    const novo = window.prompt('Novo nome da lista', lista.name)
    if (novo && novo.trim()) renomear(lista.id, novo.trim())
  }

  function handleExcluir(lista) {
    if (window.confirm(`Excluir "${lista.name}"? Todos os itens dela serão apagados.`)) {
      excluir(lista.id)
    }
  }

  return (
    <div className="tier-board">
      <Header email={session.user.email} onSignOut={onSignOut} />

      <h2 className="tier-lists-title">Minhas Tier Lists</h2>

      <form onSubmit={handleCriar} className="tier-lists-form">
        <input
          type="text"
          placeholder="Nome da nova lista"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
        />
        <button type="submit" className="btn-primary">
          <Plus size={16} strokeWidth={2.4} />
          Criar
        </button>
      </form>

      {erro && <p className="tier-board__error">{erro}</p>}

      {!carregando && listas.length === 0 && (
        <p className="tier-lists-empty">Nenhuma lista ainda. Crie a primeira acima.</p>
      )}

      <ul className="tier-lists-grid">
        {listas.map((lista) => (
          <li key={lista.id} className="tier-list-card">
            <button type="button" className="tier-list-card__open" onClick={() => onOpenList(lista)}>
              {lista.name}
            </button>
            <div className="tier-list-card__actions">
              <button type="button" className="btn-outline" onClick={() => handleRenomear(lista)}>
                <Pencil size={14} strokeWidth={2} />
              </button>
              <button type="button" className="btn-outline" onClick={() => handleExcluir(lista)}>
                <Trash2 size={14} strokeWidth={2} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
