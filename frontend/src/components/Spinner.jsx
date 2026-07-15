import './Spinner.css'

export default function Spinner({ label = 'Carregando...' }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  )
}
