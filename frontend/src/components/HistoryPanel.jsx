export default function HistoryPanel({ item, entries, onClose }) {
  if (!item) return null

  return (
    <div className="history-panel">
      <div className="history-panel__header">
        <h3>Histórico — {item.title}</h3>
        <button type="button" className="btn-outline" onClick={onClose}>
          Fechar
        </button>
      </div>
      <ul className="history-panel__list">
        {entries.map((h) => (
          <li key={h.id}>
            <span className="history-panel__date">{new Date(h.changed_at).toLocaleString('pt-BR')}</span>
            <span>
              {h.old_tier ?? 'criado'} → <strong>{h.new_tier}</strong>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
