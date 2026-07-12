import { useState } from 'react'
import { TIERS } from '../constants/tiers'
import { useItems } from '../hooks/useItems'
import Header from './Header'
import AddItemForm from './AddItemForm'
import TierRow from './TierRow'
import HistoryPanel from './HistoryPanel'
import './TierBoard.css'

export default function TierBoard({ session, onSignOut }) {
  const { items, erro, adicionar, moverTier, excluir, buscarHistorico } = useItems(session.access_token)
  const [historicoItem, setHistoricoItem] = useState(null)
  const [historicoEntradas, setHistoricoEntradas] = useState([])

  async function handleShowHistory(item) {
    const entradas = await buscarHistorico(item.id)
    setHistoricoEntradas(entradas)
    setHistoricoItem(item)
  }

  async function handleDelete(itemId) {
    await excluir(itemId)
    if (historicoItem?.id === itemId) setHistoricoItem(null)
  }

  return (
    <div className="tier-board">
      <Header email={session.user.email} onSignOut={onSignOut} />

      {erro && <p className="tier-board__error">{erro}</p>}

      <AddItemForm onAdd={adicionar} />

      <div className="tier-board__rows">
        {TIERS.map((tier) => (
          <TierRow
            key={tier.key}
            tier={tier}
            tiers={TIERS}
            items={items.filter((item) => item.tier === tier.key)}
            onMove={moverTier}
            onDelete={handleDelete}
            onShowHistory={handleShowHistory}
          />
        ))}
      </div>

      <HistoryPanel item={historicoItem} entries={historicoEntradas} onClose={() => setHistoricoItem(null)} />
    </div>
  )
}
