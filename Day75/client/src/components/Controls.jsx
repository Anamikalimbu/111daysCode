export default function Controls({ search, setSearch, category, setCategory, stock, setStock, limit, setLimit }) {
  const sel = {
    height: 36, borderRadius: 6, border: '1px solid #d1d5db',
    background: '#fff', color: '#1a1a1a', fontSize: 13,
    padding: '0 10px', outline: 'none', cursor: 'pointer'
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 8, marginBottom: '1rem', alignItems: 'center' }}>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 15 }}>🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or category…"
          style={{
            width: '100%', height: 36, paddingLeft: 32, paddingRight: 10,
            borderRadius: 6, border: '1px solid #d1d5db', fontSize: 14,
            outline: 'none', background: '#fff', color: '#1a1a1a'
          }}
        />
      </div>
      <select style={sel} value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">All categories</option>
        {['Tech','Clothing','Food','Books','Sports','Home'].map(c => <option key={c}>{c}</option>)}
      </select>
      <select style={sel} value={stock} onChange={e => setStock(e.target.value)}>
        <option value="">All stock</option>
        <option value="In Stock">In stock</option>
        <option value="Low Stock">Low stock</option>
        <option value="Out of Stock">Out of stock</option>
      </select>
      <select style={sel} value={limit} onChange={e => setLimit(Number(e.target.value))}>
        <option value={5}>5 / page</option>
        <option value={8}>8 / page</option>
        <option value={15}>15 / page</option>
      </select>
    </div>
  )
}
