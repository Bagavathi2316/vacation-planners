import { useState } from 'react';
import PageHead from './PageHead.jsx';
import { today, grad } from '../utils.js';

export default function CalendarView({ trips, onViewTrip }) {
  const [month, setMonth] = useState(new Date(2026, 9, 1));
  const y = month.getFullYear(), m = month.getMonth();
  const first = new Date(y, m, 1).getDay(), dim = new Date(y, m + 1, 0).getDate(), now = today();
  const shift = (d) => setMonth(new Date(y, m + d, 1));
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(<div key={'e' + i} className="cd o" />);
  for (let d = 1; d <= dim; d++) {
    const ds = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const ts = trips.filter((t) => t.start <= ds && t.end >= ds);
    cells.push(
      <div key={d} className={'cd' + (ds === now ? ' td' : '')}>
        <b>{d}</b>
        {ts.slice(0, 2).map((t) => <button key={t.id} title={t.title} style={{ background: grad(t.destId)[0] }} onClick={() => onViewTrip(t)}>{t.title}</button>)}
        {ts.length > 2 && <small>+{ts.length - 2} more</small>}
      </div>,
    );
  }
  return (
    <>
      <PageHead title="Calendar" sub="Trip schedule across the month">
        <div className="act">
          <button className="btn g" onClick={() => shift(-1)} aria-label="Previous month">‹</button>
          <b style={{ alignSelf: 'center', minWidth: 130, textAlign: 'center' }}>{month.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</b>
          <button className="btn g" onClick={() => shift(1)} aria-label="Next month">›</button>
        </div>
      </PageHead>
      <div className="card"><div className="cal">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <div key={d} className="dh">{d}</div>)}
        {cells}
      </div></div>
    </>
  );
}
