function Modal({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  isDanger = true,
}) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>
        <h3 id="modal-title">{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={isDanger ? "confirm" : "confirm-accent"}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
