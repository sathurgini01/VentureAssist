import '../styles/Modals.css'

function Modal({ children, isOpen, title }) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-panel">
        {title ? <h3>{title}</h3> : null}
        {children}
      </div>
    </div>
  )
}

export default Modal
