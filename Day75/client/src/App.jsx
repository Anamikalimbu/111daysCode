import { useState, useEffect, useCallback } from 'react'
import ProductTable from './components/ProductTable.jsx'
import Controls from './components/Controls.jsx'
import Pagination from './components/Pagination.jsx'
import StatsBar from './components/StatsBar.jsx'

const API = 'http://localhost:5000/api/products'

export default function App() {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('')
  const [sort, setSort] = useState('added')
  const [order, setOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(8)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ search, category, stock, sort, order, page, limit })
      const res = await fetch(`${API}?${params}`)
      const data = await res.json()
      setProducts(data.products)
      setTotal(data.total)
      setPages(data.pages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [search, category, stock, sort, order, page, limit])

  useEffect(() => { fetchProducts() }, [fetchProducts])
  useEffect(() => { setPage(1) }, [search, category, stock, limit])

  const handleSort = (col) => {
    if (sort === col) setOrder(o => o === 'asc' ? 'desc' : 'asc')
    else { setSort(col); setOrder('asc') }
    setPage(1)
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '1.5rem 1rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>📦 Product Catalog</h1>
        <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
          MERN stack — Search · Filter · Sort · Pagination
        </p>
      </div>

      <Controls
        search={search} setSearch={setSearch}
        category={category} setCategory={setCategory}
        stock={stock} setStock={setStock}
        limit={limit} setLimit={setLimit}
      />

      <StatsBar total={total} products={products} />

      <ProductTable
        products={products}
        loading={loading}
        sort={sort}
        order={order}
        onSort={handleSort}
      />

      <Pagination page={page} pages={pages} total={total} limit={limit} onPage={setPage} />
    </div>
  )
}
