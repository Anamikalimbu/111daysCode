export default function Pagination({ page, pages, total, limit, onPage }) {
  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  const btn = (label, target, active = false, disabled = false) => (
    <button
      key={label}
      onClick={() => !disabled && onPage(target)}
      disabled={disabled}
      style={{
        height: 32, minWidth: 32, padding: '0 8px',
        borderRadius: 6, border: active ? '1.5px solid #6366f1' : '1px solid #e5e7eb',
        background: active ? '#eff6ff' : '#fff',
        color: active ? '#6366f1' : '#374151',
        fontSize: 13, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? .4 : 1, fontWeight: active ? 600 : 400
      }}>
      {label}
    </button>
  )

  const range = []
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) range.push(i)
    else if (range[range.length - 1] !== '…') range.push('…')
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
      <span style={{ fontSize: 13, color: '#9ca3af' }}>
        {total === 0 ? 'No results' : `Showing ${start}–${end} of ${total} products`}
      </span>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {btn('←', page - 1, false, page === 1)}
        {range.map((p, i) =>
          p === '…'
            ? <span key={`e${i}`} style={{ padding: '0 4px', color: '#9ca3af' }}>…</span>
            : btn(p, p, p === page)
        )}
        {btn('→', page + 1, false, page === pages)}
      </div>
    </div>
  )
}
