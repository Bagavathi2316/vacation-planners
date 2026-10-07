export default function Pagination({ page, pages, total, size, onPage }) {
  const from = (page - 1) * size + 1;
  return (
    <div className="pg">
      <span>Showing {from}–{Math.min(total, page * size)} of {total}</span>
      <div>
        <button disabled={page < 2} onClick={() => onPage(page - 1)} aria-label="Previous page">‹</button>
        {Array.from({ length: pages }, (_, i) => (
          <button key={i} className={i + 1 === page ? 'on' : ''} onClick={() => onPage(i + 1)}>{i + 1}</button>
        ))}
        <button disabled={page >= pages} onClick={() => onPage(page + 1)} aria-label="Next page">›</button>
      </div>
    </div>
  );
}
