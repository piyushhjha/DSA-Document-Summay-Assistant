export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="confirm-modal">
        <div className="confirm-icon">!</div>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="confirm-actions">
          <button onClick={onCancel}>Cancel</button>
          <button className="danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}