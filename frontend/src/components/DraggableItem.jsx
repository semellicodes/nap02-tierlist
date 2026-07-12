import { useDraggable } from '@dnd-kit/core'
import ItemCard from './ItemCard'

export default function DraggableItem({ item, onDelete, onShowHistory }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `item-${item.id}`,
    data: { item },
  })

  return (
    <div
      ref={setNodeRef}
      className="draggable-item"
      style={{ opacity: isDragging ? 0.4 : 1, touchAction: 'none' }}
      {...listeners}
      {...attributes}
    >
      <ItemCard item={item} onDelete={onDelete} onShowHistory={onShowHistory} />
    </div>
  )
}
