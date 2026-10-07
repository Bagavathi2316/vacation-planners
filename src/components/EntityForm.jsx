import { useState } from 'react';
import Modal from './Modal.jsx';
import { useToast } from './Toast.jsx';

function validate(cfg, v, id) {
  const er = {};
  cfg.fields.forEach((f) => {
    const s = String(v[f.k] ?? '').trim();
    if (f.req && !s) er[f.k] = 'This field is required';
    else if (s) {
      if (f.len && s.length < f.len) er[f.k] = `At least ${f.len} characters`;
      if (f.t === 'email' && !/^\S+@\S+\.\S+$/.test(s)) er[f.k] = 'Enter a valid email';
      if (f.t === 'number') {
        const n = Number(s);
        if (Number.isNaN(n)) er[f.k] = 'Enter a number';
        else if (f.min != null && n < f.min) er[f.k] = `Minimum is ${f.min}`;
        else if (f.max != null && n > f.max) er[f.k] = `Maximum is ${f.max}`;
      }
    }
  });
  return Object.keys(er).length || !cfg.check ? er : cfg.check(v, id);
}

export default function EntityForm({ cfg, row, onSave, onClose }) {
  const toast = useToast();
  const id = row?.id;
  const [vals, setVals] = useState(() => ({ ...cfg.defaults, ...(row || {}) }));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const er = validate(cfg, vals, id);
    setErrors(er);
    if (Object.keys(er).length) return toast('Please fix the highlighted fields', true);
    const out = {};
    cfg.fields.forEach((f) => {
      const s = String(vals[f.k] ?? '').trim();
      out[f.k] = f.t === 'number' || f.n ? Number(s) : s;
    });
    setSaving(true);
    setTimeout(() => onSave(out), 450);
  };

  return (
    <Modal onClose={onClose}>
      <h3>{id ? 'Edit' : 'New'} {cfg.noun}</h3>
      <form id="frm" className="form" noValidate onSubmit={submit}>
        {cfg.fields.map((f) => (
          <label key={f.k} className={'fl' + (errors[f.k] ? ' bad' : '')}>
            {f.l}{f.req ? ' *' : ''}
            {f.t === 'select' ? (
              <select value={vals[f.k] ?? ''} onChange={(e) => setVals({ ...vals, [f.k]: e.target.value })}>
                {f.o().map(([a, b]) => <option key={a} value={a}>{b}</option>)}
              </select>
            ) : (
              <input type={f.t} min={f.min} step="any" value={vals[f.k] ?? ''}
                onChange={(e) => setVals({ ...vals, [f.k]: e.target.value })} />
            )}
            <small>{errors[f.k] || ''}</small>
          </label>
        ))}
      </form>
      <div className="act">
        <button className="btn g" onClick={onClose}>Cancel</button>
        <button className="btn" form="frm" type="submit" disabled={saving}>
          {saving ? 'Saving…' : id ? 'Save changes' : 'Create'}
        </button>
      </div>
    </Modal>
  );
}
