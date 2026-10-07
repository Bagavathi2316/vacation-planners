import { useMemo, useState } from 'react';
import PageHead from './PageHead.jsx';
import Pagination from './Pagination.jsx';
import { Empty } from './States.jsx';

const PAGE_SIZE = 6;

export default function DataTable({ cfg, rows, top, onNew, onView, onEdit, onDelete }) {
  const [q, setQ] = useState('');
  const [f, setF] = useState({});
  const [sort, setSort] = useState({ k: null, dir: 1 });
  const [page, setPage] = useState(1);
  const [mode, setMode] = useState(cfg.view || 'table');

  const filtered = useMemo(() => {
    let r = rows.filter((x) =>
      (!q || cfg.text(x).toLowerCase().includes(q.toLowerCase())) &&
      cfg.filters.every((fl) => f[fl.id] === undefined || f[fl.id] === '' || fl.fn(x, fl.t === 'n' ? Number(f[fl.id]) : f[fl.id])));
    if (sort.k) {
      const col = cfg.cols.find((c) => c.k === sort.k);
      r = [...r].sort((a, b) => {
        const x = col.v(a), y = col.v(b);
        return (typeof x === 'number' ? x - y : String(x).localeCompare(String(y))) * sort.dir;
      });
    }
    return r;
  }, [rows, cfg, q, f, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const cur = Math.min(page, pages);
  const slice = filtered.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE);
  const setFilter = (id, v) => { setF({ ...f, [id]: v }); setPage(1); };
  const toggleSort = (k) => setSort((s) => ({ k, dir: s.k === k ? -s.dir : 1 }));
  const Actions = ({ r }) => (
    <>
      <button className="btn g s" onClick={() => onView(r)}>View</button>{' '}
      <button className="btn g s" onClick={() => onEdit(r)}>Edit</button>{' '}
      <button className="btn g s" style={{ color: 'var(--bad)' }} onClick={() => onDelete(r)}>Delete</button>
    </>
  );

  return (
    <>
      <PageHead title={cfg.title} sub={`Manage your ${cfg.title.toLowerCase()}`}>
        <div className="act">
          {cfg.card && (
            <div className="seg">
              <button className={mode === 'cards' ? 'on' : ''} onClick={() => setMode('cards')}>▦ Cards</button>
              <button className={mode === 'table' ? 'on' : ''} onClick={() => setMode('table')}>☰ Table</button>
            </div>
          )}
          <button className="btn" onClick={onNew}>＋ New {cfg.noun}</button>
        </div>
      </PageHead>
      {top}
      <div className="card">
        <div className="tools">
          <input type="search" placeholder={`Search ${cfg.title.toLowerCase()}…`} aria-label="Search" value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }} />
          {cfg.filters.map((fl) => (
            <label key={fl.id} className="fb">{fl.l}
              {fl.t === 's' ? (
                <select value={f[fl.id] || ''} onChange={(e) => setFilter(fl.id, e.target.value)}>
                  <option value="">All</option>
                  {fl.o().map(([a, b]) => <option key={a} value={a}>{b}</option>)}
                </select>
              ) : (
                <input type={fl.t === 'd' ? 'date' : 'number'} min="0" value={f[fl.id] || ''}
                  onChange={(e) => setFilter(fl.id, e.target.value)} />
              )}
            </label>
          ))}
          {cfg.filters.length > 0 && (
            <button className="btn g s" style={{ alignSelf: 'end' }} onClick={() => { setF({}); setQ(''); setPage(1); }}>Reset</button>
          )}
        </div>
        {!filtered.length ? <Empty message={`No ${cfg.title.toLowerCase()} match your search or filters.`} /> : (
          <>
            {cfg.card && mode === 'cards' ? (
              <div className="cards">
                {slice.map((r, i) => (
                  <div key={r.id} className="dc" style={{ animationDelay: `${i * 60}ms` }}>
                    {cfg.card(r)}
                    <div className="dc-act"><Actions r={r} /></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="tw">
                <table>
                  <thead><tr>
                    {cfg.cols.map((c) => (
                      <th key={c.k} onClick={() => toggleSort(c.k)}>{c.l} {sort.k === c.k ? (sort.dir > 0 ? '▲' : '▼') : ''}</th>
                    ))}
                    <th style={{ cursor: 'default' }}>Actions</th>
                  </tr></thead>
                  <tbody>
                    {slice.map((r) => (
                      <tr key={r.id}>
                        {cfg.cols.map((c) => <td key={c.k}>{c.r(r)}</td>)}
                        <td style={{ whiteSpace: 'nowrap' }}><Actions r={r} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Pagination page={cur} pages={pages} total={filtered.length} size={PAGE_SIZE} onPage={setPage} />
          </>
        )}
      </div>
    </>
  );
}
