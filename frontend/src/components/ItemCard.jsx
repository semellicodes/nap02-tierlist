import { Clapperboard, Disc3, History, Trash2 } from 'lucide-react'

function outrosTiers(tiers, tierAtual) {
  return tiers.filter((tier) => tier.key !== tierAtual)
}

export default function ItemCard({ item, tiers, onMove, onDelete, onShowHistory }) {
  const TypeIcon = item.type === 'filme' ? Clapperboard : Disc3

  return (
    <div className="item-card">
      <div className="item-card__top">
        {item.artwork_url ? (
          <img className="item-card__art" src={item.artwork_url} alt="" />
        ) : (
          <div className="item-card__art item-card__art--placeholder">
            <TypeIcon size={16} strokeWidth={2} />
          </div>
        )}
        <div className="item-card__text">
          <div className="item-card__title">{item.title}</div>
          <div className="item-card__meta">
            <TypeIcon size={12} strokeWidth={2} />
            <span>{item.creator}</span>
          </div>
        </div>
      </div>
      <div className="item-card__actions">
        {outrosTiers(tiers, item.tier).map((tier) => (
          <button
            key={tier.key}
            type="button"
            className="tier-chip"
            style={{ '--chip-color': tier.color }}
            title={`Mover para ${tier.key} — ${tier.title}`}
            onClick={() => onMove(item.id, tier.key)}
          >
            {tier.key}
          </button>
        ))}
        <button type="button" className="btn-icon" title="Ver histórico" onClick={() => onShowHistory(item)}>
          <History size={13} strokeWidth={2} />
        </button>
        <button
          type="button"
          className="btn-icon btn-icon--danger"
          title="Excluir"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 size={13} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
