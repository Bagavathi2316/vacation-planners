import Badge from './components/Badge.jsx';
import Avatar from './components/Avatar.jsx';
import { money, fd, today, gradCss, METHOD_ICON } from './utils.js';

export const helpers = (S) => {
  const g = (e, id) => S[e].find((x) => x.id == id) || {};
  const amt = (b) => (g('trips', b.tripId).price || 0) * b.n;
  const booked = (id, skip) =>
    S.book.filter((b) => b.tripId == id && b.status !== 'Cancelled' && b.id !== skip).reduce((a, b) => a + b.n, 0);
  return { g, amt, booked };
};

export const recalc = (S, bookId) => {
  const { g, amt } = helpers(S);
  const b = g('book', bookId);
  const ps = S.pay.filter((p) => p.bookId == bookId);
  if (!b.id || !ps.length) return S;
  const ok = ps.filter((p) => p.status === 'Success').reduce((a, p) => a + p.amount, 0);
  const payment = ok >= amt(b) ? 'Paid' : ok > 0 ? 'Partial' : ps.some((p) => p.status === 'Refunded') ? 'Refunded' : 'Unpaid';
  return { ...S, book: S.book.map((x) => (x.id == bookId ? { ...x, payment } : x)) };
};

const lst = (a) => () => a.map((x) => [x, x]);
const opts = (list, label) => () => list.map((x) => [x.id, label(x)]);
const STATUS = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
const PAY = ['Unpaid', 'Partial', 'Paid', 'Refunded'];

export function buildConfig(S) {
  const { g, amt, booked } = helpers(S);
  const col = (k, l, r, v) => ({ k, l, r: r || ((x) => x[k]), v: v || ((x) => x[k]) });
  const tripCount = (r) => S.trips.filter((t) => t.destId === r.id).length;
  const bookCount = (r) => S.book.filter((b) => b.custId === r.id).length;
  const dName = (r) => g('dest', r.destId);

  return {
    dest: {
      title: 'Destinations', noun: 'destination', view: 'cards',
      card: (r) => {
        const ts = S.trips.filter((t) => t.destId === r.id);
        const from = ts.length ? Math.min(...ts.map((t) => t.price)) : null;
        return (
          <>
            <div className="dc-top" style={{ background: gradCss(r.id) }}>{r.emoji}<span>{r.region}</span></div>
            <div className="dc-b"><h3>{r.name}</h3><p>{r.country}</p>
              <div className="dc-m"><span>★ {r.rating}<br />{ts.length} trips</span>
                <span style={{ textAlign: 'right' }}>{from ? <>From<br /><b>{money(from)}</b></> : 'No trips yet'}</span></div></div>
          </>
        );
      },
      text: (r) => r.name + r.country + r.region,
      cols: [
        col('name', 'Destination', (r) => <><span>{r.emoji}</span> <b>{r.name}</b></>),
        col('country', 'Country'), col('region', 'Region'),
        col('rating', 'Rating', (r) => '★ ' + r.rating),
        col('tc', 'Trips', tripCount, tripCount),
      ],
      fields: [
        { k: 'name', l: 'Name', t: 'text', req: 1, len: 2 },
        { k: 'country', l: 'Country', t: 'text', req: 1, len: 2 },
        { k: 'region', l: 'Region', t: 'select', o: lst(['India', 'Asia', 'Europe', 'Middle East']) },
        { k: 'emoji', l: 'Emoji icon', t: 'text' },
        { k: 'rating', l: 'Rating (1–5)', t: 'number', req: 1, min: 1, max: 5 },
      ],
      filters: [{ id: 'r', l: 'Region', t: 's', o: lst(['India', 'Asia', 'Europe', 'Middle East']), fn: (r, v) => r.region === v }],
      canDelete: (r) => (S.trips.some((t) => t.destId === r.id) ? 'Remove its trips first' : null),
      defaults: { region: 'India', emoji: '📍' },
    },
    trips: {
      title: 'Trips', noun: 'trip',
      card: (r) => {
        const d = dName(r), b = booked(r.id);
        return (
          <>
            <div className="dc-top" style={{ background: gradCss(r.destId) }}>{d.emoji}<span>{d.name}</span></div>
            <div className="dc-b"><h3>{r.title}</h3><p>{fd(r.start)} → {fd(r.end)}</p>
              <div className="meter"><i style={{ width: Math.min(100, (b / r.seats) * 100) + '%' }} /></div>
              <div className="dc-m" style={{ marginTop: 8 }}><span>{b}/{r.seats} booked</span><b>{money(r.price)}</b></div></div>
          </>
        );
      },
      text: (r) => r.title + dName(r).name,
      cols: [
        col('title', 'Trip', (r) => <b>{r.title}</b>),
        col('d', 'Destination', (r) => `${dName(r).emoji} ${dName(r).name}`, (r) => dName(r).name),
        col('start', 'Dates', (r) => `${fd(r.start)} → ${fd(r.end)}`),
        col('price', 'Price / person', (r) => money(r.price)),
        col('left', 'Seats filled', (r) => (
          <><div className="meter"><i style={{ width: Math.min(100, (booked(r.id) / r.seats) * 100) + '%' }} /></div>
            <small style={{ color: 'var(--mut)' }}>{booked(r.id)}/{r.seats} booked</small></>
        ), (r) => r.seats - booked(r.id)),
      ],
      fields: [
        { k: 'title', l: 'Trip title', t: 'text', req: 1, len: 3 },
        { k: 'destId', l: 'Destination', t: 'select', n: 1, o: opts(S.dest, (d) => d.name) },
        { k: 'start', l: 'Start date', t: 'date', req: 1 },
        { k: 'end', l: 'End date', t: 'date', req: 1 },
        { k: 'price', l: 'Price per person (₹)', t: 'number', req: 1, min: 1 },
        { k: 'seats', l: 'Total seats', t: 'number', req: 1, min: 1, max: 200 },
      ],
      check: (v, id) =>
        v.end < v.start ? { end: 'End must be after start' }
        : id && Number(v.seats) < booked(id) ? { seats: `Already ${booked(id)} booked` } : {},
      filters: [
        { id: 'd', l: 'Destination', t: 's', o: opts(S.dest, (d) => d.name), fn: (r, v) => r.destId == v },
        { id: 'a', l: 'Starts from', t: 'd', fn: (r, v) => r.start >= v },
        { id: 'b', l: 'Starts until', t: 'd', fn: (r, v) => r.start <= v },
        { id: 'p', l: 'Min price', t: 'n', fn: (r, v) => r.price >= v },
        { id: 'q', l: 'Max price', t: 'n', fn: (r, v) => r.price <= v },
      ],
      canDelete: (r) => (S.book.some((b) => b.tripId === r.id) ? 'Trip has bookings' : null),
      defaults: { destId: 1 },
    },
    cust: {
      title: 'Customers', noun: 'customer',
      text: (r) => r.name + r.email + r.city,
      cols: [
        col('name', 'Customer', (r) => <span className="who"><Avatar name={r.name} />{r.name}</span>, (r) => r.name), col('email', 'Email'), col('phone', 'Phone'),
        col('city', 'City'), col('bk', 'Bookings', bookCount, bookCount),
      ],
      fields: [
        { k: 'name', l: 'Full name', t: 'text', req: 1, len: 2 },
        { k: 'email', l: 'Email', t: 'email', req: 1 },
        { k: 'phone', l: 'Phone', t: 'text', req: 1, len: 7 },
        { k: 'city', l: 'City', t: 'text', req: 1, len: 2 },
      ],
      filters: [],
      canDelete: (r) => (S.book.some((b) => b.custId === r.id) ? 'Customer has bookings' : null),
      defaults: {},
    },
    book: {
      title: 'Bookings', noun: 'booking',
      text: (r) => g('cust', r.custId).name + g('trips', r.tripId).title + r.status + r.payment + 'B' + r.id,
      cols: [
        col('id', 'ID', (r) => <b>#B{String(r.id).padStart(3, '0')}</b>),
        col('c', 'Customer', (r) => <span className="who"><Avatar name={g('cust', r.custId).name} />{g('cust', r.custId).name}</span>, (r) => g('cust', r.custId).name),
        col('t', 'Trip', (r) => g('trips', r.tripId).title, (r) => g('trips', r.tripId).title),
        col('n', 'Pax'),
        col('a', 'Amount', (r) => money(amt(r)), amt),
        col('status', 'Status', (r) => <Badge text={r.status} />),
        col('payment', 'Payment', (r) => <Badge text={r.payment} />),
        col('date', 'Booked', (r) => fd(r.date)),
      ],
      fields: [
        { k: 'custId', l: 'Customer', t: 'select', n: 1, o: opts(S.cust, (c) => c.name) },
        { k: 'tripId', l: 'Trip', t: 'select', n: 1, o: opts(S.trips, (t) => t.title) },
        { k: 'n', l: 'Travellers', t: 'number', req: 1, min: 1, max: 20 },
        { k: 'date', l: 'Booking date', t: 'date', req: 1 },
        { k: 'status', l: 'Booking status', t: 'select', o: lst(STATUS) },
        { k: 'payment', l: 'Payment status', t: 'select', o: lst(PAY) },
      ],
      check: (v, id) => {
        const left = g('trips', v.tripId).seats - booked(Number(v.tripId), id);
        return v.status !== 'Cancelled' && Number(v.n) > left ? { n: `Only ${left} seats left` } : {};
      },
      filters: [
        { id: 'd', l: 'Destination', t: 's', o: opts(S.dest, (d) => d.name), fn: (r, v) => g('trips', r.tripId).destId == v },
        { id: 's', l: 'Status', t: 's', o: lst(STATUS), fn: (r, v) => r.status === v },
        { id: 'y', l: 'Payment', t: 's', o: lst(PAY), fn: (r, v) => r.payment === v },
        { id: 'a', l: 'Booked from', t: 'd', fn: (r, v) => r.date >= v },
        { id: 'b', l: 'Booked until', t: 'd', fn: (r, v) => r.date <= v },
        { id: 'p', l: 'Min amount', t: 'n', fn: (r, v) => amt(r) >= v },
        { id: 'q', l: 'Max amount', t: 'n', fn: (r, v) => amt(r) <= v },
      ],
      extra: (r) => {
        const t = g('trips', r.tripId);
        return [['Email', g('cust', r.custId).email], ['Destination', g('dest', t.destId).name], ['Travel dates', `${fd(t.start)} → ${fd(t.end)}`]];
      },
      canDelete: () => null,
      defaults: { custId: 1, tripId: 1, n: 1, status: 'Pending', payment: 'Unpaid', date: today() },
    },
    pay: {
      title: 'Payments', noun: 'payment',
      text: (r) => r.ref + r.method + r.status + g('cust', g('book', r.bookId).custId).name + 'B' + r.bookId,
      cols: [
        col('ref', 'Transaction', (r) => <b>{r.ref}</b>),
        col('b', 'Booking', (r) => '#B' + String(r.bookId).padStart(3, '0'), (r) => r.bookId),
        col('c', 'Customer', (r) => { const n = g('cust', g('book', r.bookId).custId).name; return <span className="who"><Avatar name={n} />{n}</span>; },
          (r) => g('cust', g('book', r.bookId).custId).name),
        col('method', 'Method', (r) => `${METHOD_ICON[r.method]} ${r.method}`),
        col('amount', 'Amount', (r) => <b>{money(r.amount)}</b>),
        col('status', 'Status', (r) => <Badge text={r.status} />),
        col('date', 'Date', (r) => fd(r.date)),
      ],
      fields: [
        { k: 'bookId', l: 'Booking', t: 'select', n: 1, o: opts(S.book, (b) => `#B${String(b.id).padStart(3, '0')} · ${g('cust', b.custId).name}`) },
        { k: 'amount', l: 'Amount (₹)', t: 'number', req: 1, min: 1 },
        { k: 'method', l: 'Payment method', t: 'select', o: lst(Object.keys(METHOD_ICON)) },
        { k: 'status', l: 'Payment status', t: 'select', o: lst(['Success', 'Pending', 'Failed', 'Refunded']) },
        { k: 'date', l: 'Payment date', t: 'date', req: 1 },
        { k: 'ref', l: 'Transaction ID', t: 'text', req: 1, len: 6 },
      ],
      check: (v) => {
        const b = g('book', v.bookId);
        return Number(v.amount) > amt(b) ? { amount: `Cannot exceed booking total ${money(amt(b))}` } : {};
      },
      filters: [
        { id: 'm', l: 'Method', t: 's', o: lst(Object.keys(METHOD_ICON)), fn: (r, v) => r.method === v },
        { id: 's', l: 'Status', t: 's', o: lst(['Success', 'Pending', 'Failed', 'Refunded']), fn: (r, v) => r.status === v },
        { id: 'a', l: 'Paid from', t: 'd', fn: (r, v) => r.date >= v },
        { id: 'b', l: 'Paid until', t: 'd', fn: (r, v) => r.date <= v },
        { id: 'p', l: 'Min amount', t: 'n', fn: (r, v) => r.amount >= v },
        { id: 'q', l: 'Max amount', t: 'n', fn: (r, v) => r.amount <= v },
      ],
      extra: (r) => {
        const b = g('book', r.bookId);
        return [['Trip', g('trips', b.tripId).title], ['Booking total', money(amt(b))], ['Booking payment', b.payment]];
      },
      canDelete: () => null,
      defaults: { bookId: 1, amount: '', method: 'UPI', status: 'Success', date: today(), ref: 'TXN' + String(Date.now()).slice(-8) },
    },
  };
}
