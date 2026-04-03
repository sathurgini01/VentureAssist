import { useEffect } from 'react'
import Button from './Button'
import { useAppContext } from '../context/AppContext'
import '../styles/Cards.css'

function Toast({ id, message, type = 'info' }) {
  const { clearToast } = useAppContext()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      clearToast(id)
    }, 3500)

    return () => window.clearTimeout(timer)
  }, [clearToast, id])

  return (
    <div className={`card toast-card toast-${type}`.trim()}>
      <div className="toolbar-row">
        <strong>{type.toUpperCase()}</strong>
        <Button variant="ghost" onClick={() => clearToast(id)}>
          Close
        </Button>
      </div>
      <p className="card-muted">{message}</p>
    </div>
  )
}

export default Toast
