export function BarChart({ data, format }) {
  const mx = Math.max(1, ...data.map((d) => d.value));
  const w = 352 / Math.max(1, data.length);
  return (
    <svg viewBox="0 0 400 196" width="100%" role="img" aria-label="Revenue by departure month">
      <defs>
        <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b82f6" /><stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const h = (d.value / mx) * 150, x = 24 + i * w;
        return (
          <g key={d.label}>
            <rect className="bar" style={{ animationDelay: `${i * 80}ms` }} x={x} y={170 - h} width={w - 14} height={h} rx="6" fill="url(#gr)">
              <title>{d.label}: {format(d.value)}</title>
            </rect>
            <text x={x + (w - 14) / 2} y="188" fontSize="10" textAnchor="middle" fill="var(--mut)">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function Donut({ items }) {
  const total = items.reduce((a, i) => a + i.value, 0) || 1;
  let off = 0;
  return (
    <>
      <svg viewBox="0 0 42 42" width="170" style={{ display: 'block', margin: '10px auto', transform: 'rotate(-90deg)' }} role="img" aria-label="Booking status">
        {items.map((i) => {
          const p = (i.value / total) * 100, o = off;
          off += p;
          return <circle key={i.label} r="15.9" cx="21" cy="21" fill="none" stroke={i.color} strokeWidth="6" strokeDasharray={`${p} ${100 - p}`} strokeDashoffset={-o} />;
        })}
      </svg>
      <div className="leg">{items.map((i) => <span key={i.label}><i style={{ background: i.color }} />{i.label} {i.value}</span>)}</div>
    </>
  );
}
