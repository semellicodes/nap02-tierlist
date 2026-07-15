import { useEffect } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import './Toast.css'

export default function Toast({ message, type = 'success', onDone, duration = 3000 }) {
  useEffect(() => {
    if (!message) return
    const id = setTimeout(onDone, duration)
    return () => clearTimeout(id)
  }, [message, onDone, duration])

  if (!message) return null

  const Icon = type === 'success' ? CheckCircle2 : XCircle

  return (
    <div className={`toast toast--${type}`} role="status">
      <Icon size={16} strokeWidth={2} />
      <span>{message}</span>
    </div>
  )
}
