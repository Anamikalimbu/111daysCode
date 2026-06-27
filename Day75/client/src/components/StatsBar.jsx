export default function StatsBar({ total, products }) {
  const inStock = products.filter(p => p.stock === 'In Stock').length
  const avgRating = products.length
    ? (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1)
    : '—'
  const totalSold = products.reduce((s, p) => s + p.sold, 0)

  const card = (label, value, color = '#1a1a1a') => (
    <div key={label} style={{
      background: '#fff', borderRadius: 8, padding: '10px 16px',
      flex: 1, minWidth: 100, border: '1px solid #e5e7eb'
    }}>
      <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.5px' }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 600, marginTop: 2, color }}>{value}</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: '1rem', flexWrap: 'wrap' }}>
      {card('Showing', total)}
      {card('In stock', inStock, '#059669')}
      {card('Total sold', totalSold.toLocaleString())}
      {card('Avg rating', avgRating, '#d97706')}
    </div>
  )
}
