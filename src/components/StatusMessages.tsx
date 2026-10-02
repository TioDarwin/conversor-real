import { AlertTriangle, CheckCircle2 } from 'lucide-react'

export function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div className="status-message status-message--error" role="alert" aria-live="assertive">
      <AlertTriangle size={18} aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}

export function SuccessMessage({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div className="status-message status-message--success" role="status" aria-live="polite">
      <CheckCircle2 size={18} aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}
