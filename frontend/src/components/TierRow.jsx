import { useDroppable } from '@dnd-kit/core'
import DraggableItem from './DraggableItem'

export default function TierRow({ tier, items, onDelete, onShowHistory }) {
  const { setNodeRef, isOver } = useDroppable({ id: `tier-${tier.key}` })

  return (
    <div className="tier-row">
      <div className="tier-row__header" style={{ '--tier-color': tier.color }}>
        <div className="tier-row__badge">{tier.key}</div>
        <div className="tier-row__info">
          <strong>{tier.title}</strong>
          <span title={tier.psychology}>{tier.meaning}</span>
        </div>
      </div>
      <div
        ref={setNodeRef}
        className={`tier-row__items${isOver ? ' tier-row__items--over' : ''}`}
      >
        {items.length === 0 && <span className="tier-row__empty">Arraste um item pra cá.</span>}
        {items.map((item) => (
          <DraggableItem key={item.id} item={item} onDelete={onDelete} onShowHistory={onShowHistory} />
        ))}
      </div>
    </div>
  )
}
