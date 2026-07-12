import ItemCard from './ItemCard'

export default function TierRow({ tier, tiers, items, onMove, onDelete, onShowHistory }) {
  return (
    <div className="tier-row">
      <div className="tier-row__header" style={{ '--tier-color': tier.color }}>
        <div className="tier-row__badge">{tier.key}</div>
        <div className="tier-row__info">
          <strong>{tier.title}</strong>
          <span title={tier.psychology}>{tier.meaning}</span>
        </div>
      </div>
      <div className="tier-row__items">
        {items.length === 0 && <span className="tier-row__empty">Nenhum item ainda neste tier.</span>}
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            tiers={tiers}
            onMove={onMove}
            onDelete={onDelete}
            onShowHistory={onShowHistory}
          />
        ))}
      </div>
    </div>
  )
}
