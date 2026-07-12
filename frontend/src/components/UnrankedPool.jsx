import { useDroppable } from '@dnd-kit/core'
import { Inbox } from 'lucide-react'
import DraggableItem from './DraggableItem'

export default function UnrankedPool({ items, onDelete, onShowHistory }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'tier-pool' })

  return (
    <div className="unranked-pool">
      <div className="unranked-pool__header">
        <Inbox size={16} strokeWidth={2} />
        <div>
          <strong>Não classificados</strong>
          <span>Arraste os itens daqui pra uma das tiers acima.</span>
        </div>
      </div>
      <div
        ref={setNodeRef}
        className={`unranked-pool__items${isOver ? ' unranked-pool__items--over' : ''}`}
      >
        {items.length === 0 && (
          <span className="unranked-pool__empty">Tudo classificado por aqui.</span>
        )}
        {items.map((item) => (
          <DraggableItem key={item.id} item={item} onDelete={onDelete} onShowHistory={onShowHistory} />
        ))}
      </div>
    </div>
  )
}
