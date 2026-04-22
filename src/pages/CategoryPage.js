import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X } from "lucide-react";
import axios from "axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSheet from "@/components/CartSheet";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 9;

  const fetchProducts = useCallback(async (catId) => {
    if (!catId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ category: catId, page: String(page), limit: String(limit) });
      if (search) params.set("search", search);
      if (minPrice) params.set("min_price", minPrice);
      if (maxPrice) params.set("max_price", maxPrice);
      const { data } = await axios.get(`${API}/products?${params.toString()}`);
      setProducts(data.products || []);
      setTotalPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, minPrice, maxPrice]);

  useEffect(() => {
    axios.get(`${API}/categories/${slug}`)
      .then(r => {
        setCategory(r.data);
        setPage(1);
      })
      .catch(() => {});
  }, [slug]);

  useEffect(() => {
    if (category?.id) fetchProducts(category.id);
  }, [category, page, fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    if (category?.id) fetchProducts(category.id);
  };

  const clearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  const hasFilters = search || minPrice || maxPrice;

  return (
    <div data-testid="category-page" className="min-h-screen bg-[#FAFAFA]">
      <Header />
      <CartSheet />

      {/* Category Hero */}
      <section className="pt-32 pb-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555] mb-4">
            <Link to="/" className="hover:text-[#121212] transition-colors">Inicio</Link> / {category?.name}
          </p>
          <h1 data-testid="category-title" className="font-['Outfit'] text-5xl sm:text-6xl font-light tracking-tighter leading-none text-[#121212]">
            {category?.name}
          </h1>
          {category?.description && (
            <p className="text-base text-[#555] mt-4 max-w-lg">{category.description}</p>
          )}
        </div>
      </section>

      {/* Search & Filters */}
      <section className="pb-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0A0]" />
                <input
                  data-testid="search-input"
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar produtos..."
                  className="w-full border border-[#E5E5E5] bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#000] transition-colors"
                />
              </div>
              <button
                data-testid="search-submit"
                type="submit"
                className="bg-[#121212] text-white px-5 py-2.5 text-xs uppercase tracking-[0.1em] hover:bg-[#333] transition-colors"
              >
                Buscar
              </button>
            </form>
            <button
              data-testid="toggle-filters"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border border-[#E5E5E5] px-4 py-2.5 text-xs uppercase tracking-[0.1em] text-[#555] hover:border-[#000] hover:text-[#121212] transition-colors"
            >
              <SlidersHorizontal size={14} /> Filtros
            </button>
          </div>

          {showFilters && (
            <div data-testid="price-filters" className="flex flex-wrap gap-4 mt-4 items-end">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#555] mb-1 block">Preco Min (R$)</label>
                <input
                  data-testid="min-price-input"
                  type="number"
                  step="0.01"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  className="w-32 border border-[#E5E5E5] py-2 px-3 text-sm outline-none focus:border-[#000]"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#555] mb-1 block">Preco Max (R$)</label>
                <input
                  data-testid="max-price-input"
                  type="number"
                  step="0.01"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  className="w-32 border border-[#E5E5E5] py-2 px-3 text-sm outline-none focus:border-[#000]"
                  placeholder="9999"
                />
              </div>
              <button
                data-testid="apply-filters"
                onClick={() => { setPage(1); if (category?.id) fetchProducts(category.id); }}
                className="bg-[#121212] text-white px-5 py-2 text-xs uppercase tracking-[0.1em] hover:bg-[#333] transition-colors"
              >
                Aplicar
              </button>
              {hasFilters && (
                <button
                  data-testid="clear-filters"
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-[#555] hover:text-[#121212] transition-colors py-2"
                >
                  <X size={12} /> Limpar
                </button>
              )}
            </div>
          )}

          {hasFilters && (
            <p className="text-xs text-[#555] mt-3">{total} produto(s) encontrado(s)</p>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <p className="text-[#555] text-center py-16">Carregando...</p>
          ) : products.length === 0 ? (
            <p data-testid="no-products" className="text-[#555] text-center py-16">Nenhum produto encontrado.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  data-testid={`product-card-${product.id}`}
                  className="group block"
                >
                  <div className="aspect-[3/4] overflow-hidden mb-4 bg-[#F3F3F3]">
                    {product.images?.[0] && (
                      <img
                        src={product.images[0].startsWith("/api/") ? `${process.env.REACT_APP_BACKEND_URL}${product.images[0]}` : product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-[#121212] mb-1">{product.name}</h3>
                  <p className="text-sm text-[#555]">R$ {product.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="pb-24 md:pb-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <button
              data-testid="prev-page"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="w-10 h-10 border border-[#E5E5E5] flex items-center justify-center hover:bg-[#F3F3F3] transition-colors disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                data-testid={`page-${p}`}
                onClick={() => setPage(p)}
                className={`w-10 h-10 text-sm flex items-center justify-center transition-colors ${
                  p === page ? 'bg-[#121212] text-white' : 'border border-[#E5E5E5] hover:bg-[#F3F3F3] text-[#555]'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              data-testid="next-page"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="w-10 h-10 border border-[#E5E5E5] flex items-center justify-center hover:bg-[#F3F3F3] transition-colors disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
