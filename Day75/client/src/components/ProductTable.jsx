const CATEGORY_COLORS = {
  Tech: { bg: '#eff6ff', color: '#1d4ed8' },
  Clothing: { bg: '#f5f3ff', color: '#5b21b6' },
  Food: { bg: '#ecfdf5', color: '#065f46' },
  Books: { bg: '#fffbeb', color: '#92400e' },
  Sports: { bg: '#fff7ed', color: '#9a3412' },
  Home: { bg: '#f0fdf4', color: '#14532d' },
}
const STOCK_COLORS = {
  'In Stock': '#10b981',
  'Low Stock': '#f59e0b',
  'Out of Stock': '#ef4444',
}

function SortIcon({ col, sort, order }) {
  if (sort !== col) return <span style={{ opacity: .3, marginLeft: 4 }}>⇅</span>
  return <span style={{ marginLeft: 4, color: '#6366f1' }}>{order === 'asc' ? '↑' : '↓'}</span>
}

const COLS = [
  { key: 'name', label: 'Name', width: '22%' },
  { key: 'category', label: 'Category', width: '13%' },
  { key: 'price', label: 'Price', width: '11%' },
  { key: 'stock', label: 'Stock', width: '14%' },
  { key: 'rating', label: 'Rating', width: '12%' },
  { key: 'sold', label: 'Sold', width: '11%' },
  { key: 'added', label: 'Added', width: '13%' },
]

export default function ProductTable({ products, loading, sort, order, onSort }) {
  const th = { padding: '10px 14px', fontSize: 12, fontWeight: 600, color: '#6b7280', textAlign: 'left', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap', borderBottom: '1px solid #e5e7eb' }
  const td = { padding: '11px 14px', fontSize: 13, borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', marginBottom: '1rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead style={{ background: '#f9fafb' }}>
          <tr>
            {COLS.map(c => (
              <th key={c.key} style={{ ...th, width: c.width }} onClick={() => onSort(c.key)}>
                {c.label}<SortIcon col={c.key} sort={sort} order={order} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={7} style={{ ...td, textAlign: 'center', padding: '2.5rem', color: '#9ca3af' }}>Loading…</td></tr>
          ) : products.length === 0 ? (
            <tr><td colSpan={7} style={{ ...td, textAlign: 'center', padding: '2.5rem', color: '#9ca3af' }}>😕 No products match your filters</td></tr>
          ) : products.map((p, i) => {
            const catStyle = CATEGORY_COLORS[p.category] || { bg: '#f3f4f6', color: '#374151' }
            return (
              <tr key={p._id || i} style={{ transition: 'background .1s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = ''}>
                <td style={{ ...td, fontWeight: 500 }}>{p.name}</td>
                <td style={td}>
                  <span style={{ background: catStyle.bg, color: catStyle.color, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>
                    {p.category}
                  </span>
                </td>
                <td style={{ ...td, fontWeight: 600 }}>${p.price.toFixed(2)}</td>
                <td style={td}>
                  <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: STOCK_COLORS[p.stock], marginRight: 6 }} />
                  {p.stock}
                </td>
                <td style={{ ...td, color: '#d97706' }}>{'★'.repeat(Math.floor(p.rating))} {p.rating.toFixed(1)}</td>
                <td style={td}>{p.sold.toLocaleString()}</td>
                <td style={{ ...td, color: '#9ca3af' }}>{new Date(p.added).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
