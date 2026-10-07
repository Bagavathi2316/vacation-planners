import Modal from './Modal.jsx';

export function ConfirmDialog({ message, onCancel, onConfirm }) {
  return (
    <Modal onClose={onCancel}>
      <h3>Are you sure?</h3>
      <p style={{ color: 'var(--mut)' }}>{message}</p>
      <div className="act">
        <button className="btn g" onClick={onCancel}>Cancel</button>
        <button className="btn d" onClick={onConfirm}>Yes, delete</button>
      </div>
    </Modal>
  );
}

export function DetailsDialog({ cfg, row, onClose, onEdit }) {
  const extra = cfg.extra ? cfg.extra(row) : [];
  return (
    <Modal onClose={onClose}>
      <h3>{cfg.noun[0].toUpperCase() + cfg.noun.slice(1)} details</h3>
      <dl>
        {cfg.cols.map((c) => <div key={c.k} style={{ display: 'contents' }}><dt>{c.l}</dt><dd>{c.r(row)}</dd></div>)}
        {extra.map(([l, v]) => <div key={l} style={{ display: 'contents' }}><dt>{l}</dt><dd>{v}</dd></div>)}
      </dl>
      <div className="act">
        <button className="btn g" onClick={onClose}>Close</button>
        <button className="btn" onClick={onEdit}>Edit</button>
      </div>
    </Modal>
  );
}
