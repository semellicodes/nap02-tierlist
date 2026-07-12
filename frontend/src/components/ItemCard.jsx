import { Clapperboard, Disc3, Info, X } from 'lucide-react'
import { proxiedImageUrl } from '../lib/media'

export default function ItemCard({ item, onDelete, onShowHistory }) {
  const TypeIcon = item.type === 'filme' ? Clapperboard : Disc3

  return (
    <div className="item-card">
      <div className="item-card__top">
        {item.artwork_url ? (
          <img className="item-card__art" src={proxiedImageUrl(item.artwork_url)} alt="" crossOrigin="anonymous" />
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
        <button
          type="button"
          className="btn-icon"
          title="Ver histórico"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onShowHistory(item)}
        >
          <Info size={15} strokeWidth={2} />
        </button>
        <button
          type="button"
          className="btn-icon btn-icon--danger"
          title="Excluir"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDelete(item.id)}
        >
          <X size={15} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
