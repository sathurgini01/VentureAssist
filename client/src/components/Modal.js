import '../styles/Modals.css'

function Modal({ children, isOpen, title, onClose, size = 'default' }) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal-panel modal-panel-${size}`} onClick={(event) => event.stopPropagation()}>
        {title ? (
          <div className="modal-header">
            <h3>{title}</h3>
            {onClose ? (
              <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
                ×
              </button>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  )
}

export default Modal
