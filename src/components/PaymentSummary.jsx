import { money } from '../utils.js';
export default function PaymentSummary({ S }) {
  const sum = (st) => S.pay.filter((p) => p.status === st).reduce((a, p) => a + p.amount, 0);
  const n = (st) => S.pay.filter((p) => p.status === st).length;
  const items = [['✅', 'Collected', 'Success', '#16a34a'], ['⏳', 'Pending', 'Pending', '#d97706'], ['❌', 'Failed', 'Failed', '#dc2626'], ['↩️', 'Refunded', 'Refunded', '#7c3aed']];
  return (
    <div className="grid stats" style={{ marginBottom: 16 }}>
      {items.map(([ic, l, st, c], i) => (
        <div key={l} className="card stat" style={{ '--c': c, animationDelay: `${i * 70}ms` }}>
          <i>{ic}</i><b>{money(sum(st))}</b><span>{l} · {n(st)} transaction{n(st) === 1 ? '' : 's'}</span>
        </div>
      ))}
    </div>
  );
}
