import Badge from './Badge.jsx';
import Avatar from './Avatar.jsx';
import { BarChart, Donut } from './Charts.jsx';
import { COL, money, fd, today, gradCss, METHOD_ICON } from '../utils.js';
import { helpers } from '../config.jsx';

const MCOL = { UPI: '#2563eb', 'Credit Card': '#8b5cf6', 'Debit Card': '#06b6d4', 'Net Banking': '#f59e0b', Cash: '#16a34a' };

export default function Dashboard({ S, onNewBooking, onViewBooking, onGo }) {
  const { g, amt, booked } = helpers(S);
  const live = S.book.filter((b) => b.status !== 'Cancelled');
  const sum = (st) => S.pay.filter((p) => p.status === st).reduce((a, p) => a + p.amount, 0);
  const stats = [
    ['💰', 'Revenue collected', money(sum('Success')), '#16a34a'],
    ['⏳', 'Pending payments', money(sum('Pending')), '#d97706'],
    ['🎫', 'Total bookings', S.book.length, '#2563eb'],
    ['🧳', 'Active trips', S.trips.filter((t) => t.end >= '2026-10-01').length, '#06b6d4'],
    ['👥', 'Customers', S.cust.length, '#7c3aed'],
  ];
  const byMonth = {};
  live.forEach((b) => { const k = g('trips', b.tripId).start.slice(0, 7); byMonth[k] = (byMonth[k] || 0) + amt(b); });
  const bars = Object.keys(byMonth).sort().map((k) => ({
    label: new Date(k + '-01T00:00').toLocaleString('en-US', { month: 'short' }), value: byMonth[k],
  }));
  const statuses = ['Confirmed', 'Pending', 'Completed', 'Cancelled'];
  const donut = statuses.map((s) => ({ label: s, value: S.book.filter((b) => b.status === s).length, color: COL[s] }));
  const methods = Object.keys(MCOL).map((m) => ({ label: m, value: S.pay.filter((p) => p.method === m).length, color: MCOL[m] }));
  const top = S.dest
    .map((d) => [d, live.filter((b) => g('trips', b.tripId).destId === d.id).reduce((a, b) => a + b.n, 0)])
    .sort((a, b) => b[1] - a[1]).slice(0, 5);
  const tm = Math.max(1, top[0]?.[1] || 1);
  const sorted = [...S.trips].sort((a, b) => a.start.localeCompare(b.start));
  const upcoming = (sorted.some((t) => t.start >= today()) ? sorted.filter((t) => t.start >= today()) : sorted).slice(0, 4);
  const recent = [...S.book].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const dateStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <div className="hero">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1>Welcome to Vacation Planners 👋</h1>
          <p>{dateStr} · {S.book.filter((b) => b.status === 'Pending').length} bookings need confirmation</p>
          <div className="act" style={{ justifyContent: 'flex-start' }}>
            <button className="btn" onClick={onNewBooking}>＋ New booking</button>
            <button className="btn hg" onClick={() => onGo('pay')}>💳 Payments</button>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">🏝️✈️🏔️</div>
      </div>
      <div className="grid stats">
        {stats.map((s, i) => (
          <div key={s[1]} className="card stat" style={{ '--c': s[3], animationDelay: `${i * 70}ms` }}>
            <i>{s[0]}</i><b>{s[2]}</b><span>{s[1]}</span>
          </div>
        ))}
      </div>
      <div className="grid two">
        <div className="card"><h3>Booked revenue by departure month</h3><BarChart data={bars} format={money} /></div>
        <div className="card"><h3>Booking status</h3><Donut items={donut} /></div>
      </div>
      <div className="grid two" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <h3>Top destinations</h3>
          {top.map(([d, c]) => (
            <div key={d.id} style={{ margin: '12px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>{d.emoji} {d.name}<b>{c} travellers</b></div>
              <div className="meter"><i style={{ width: `${(c / tm) * 100}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="card">
          <h3>Upcoming departures</h3>
          {upcoming.map((t) => {
            const d = g('dest', t.destId), b = booked(t.id);
            return (
              <div key={t.id} className="up">
                <span className="dot" style={{ background: gradCss(t.destId) }}>{d.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b>{t.title}</b><br /><small style={{ color: 'var(--mut)' }}>{fd(t.start)} · {b}/{t.seats} seats booked</small>
                  <div className="meter" style={{ marginTop: 4 }}><i style={{ width: `${Math.min(100, (b / t.seats) * 100)}%` }} /></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid two" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <h3>Recent bookings</h3>
          <div className="tw"><table style={{ minWidth: 0 }}><tbody>
            {recent.map((b) => (
              <tr key={b.id} style={{ cursor: 'pointer' }} onClick={() => onViewBooking(b)}>
                <td><span className="who"><Avatar name={g('cust', b.custId).name} />
                  <span>{g('cust', b.custId).name}<br /><small style={{ color: 'var(--mut)', fontWeight: 400 }}>{g('trips', b.tripId).title}</small></span></span></td>
                <td>{money(amt(b))}</td><td><Badge text={b.payment} /></td>
              </tr>
            ))}
          </tbody></table></div>
        </div>
        <div className="card"><h3>Payment methods</h3><Donut items={methods} /></div>
      </div>
    </>
  );
}
