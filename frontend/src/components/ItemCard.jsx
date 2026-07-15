import { Clapperboard, Disc3, Info, Tv, X } from 'lucide-react'
import { proxiedImageUrl } from '../lib/media'

const ICONS = { filme: Clapperboard, serie: Tv, album: Disc3 }
const LABELS = { filme: 'Filme', serie: 'Série', album: 'Álbum' }
const COLORS = { filme: '#7c6cf6', serie: '#f5b942', album: '#4fd1c5' }

export default function ItemCard({ item, onDelete, onShowHistory }) {
  const TypeIcon = ICONS[item.type] ?? Disc3
  const typeLabel = LABELS[item.type] ?? item.type
  const typeColor = COLORS[item.type] ?? COLORS.filme

  function handleDelete() {
    if (window.confirm(`Excluir "${item.title}"?`)) {
      onDelete(item.id)
    }
  }

  return (
    <div className="item-card">
      <div className="item-card__top">
        <div className="item-card__art-wrap" style={{ '--type-color': typeColor }}>
          {item.artwork_url ? (
            <img className="item-card__art" src={proxiedImageUrl(item.artwork_url)} alt="" crossOrigin="anonymous" />
          ) : (
            <div className="item-card__art item-card__art--placeholder">
              <TypeIcon size={16} strokeWidth={2} />
            </div>
          )}
          <span className="item-card__badge" title={typeLabel}>
            <TypeIcon size={10} strokeWidth={2.6} />
          </span>
        </div>
        <div className="item-card__text">
          <div className="item-card__title">{item.title}</div>
          <div className="item-card__meta">
            <TypeIcon size={12} strokeWidth={2} color={typeColor} />
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
          onClick={handleDelete}
        >
          <X size={15} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
