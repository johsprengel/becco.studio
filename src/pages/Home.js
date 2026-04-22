import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSheet from "@/components/CartSheet";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const getImageSrc = (url) => {
  if (!url) return "";
  return url.startsWith("/api/") ? `${BACKEND_URL}${url}` : url;
};

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    axios.get(`${API}/categories`).then(r => setCategories(r.data)).catch(() => {});
    axios.get(`${API}/products?featured=true`).then(r => setFeaturedProducts(r.data.products || r.data)).catch(() => {});
  }, []);

  return (
    <div data-testid="home-page" className="min-h-screen bg-[#FAFAFA]">
      <Header />
      <CartSheet />

      {/* Hero Section */}
      <section data-testid="hero-section" className="pt-16 min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1737276745810-ce753d468a34?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwb2ZmLXdoaXRlJTIwcGFwZXIlMjB0ZXh0dXJlfGVufDB8fHx8MTc3NjMxMTkzNHww&ixlib=rb-4.1.0&q=85')", backgroundSize: "cover" }}
        />
        <div className="relative px-6 md:px-12 py-24 md:py-32 w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555] mb-6 animate-fade-up opacity-0 stagger-1">
                Portfolio & Loja
              </p>
              <h1 className="font-['Outfit'] text-5xl sm:text-6xl lg:text-7xl font-light tracking-tighter leading-none text-[#121212] mb-8 animate-fade-up opacity-0 stagger-2">
                Arte que<br />
                <span className="font-normal">se vive</span>
              </h1>
              <p className="text-base md:text-lg text-[#555] max-w-lg leading-relaxed mb-10 animate-fade-up opacity-0 stagger-3">
                De branding a pecas decorativas, cada criacao e unica.
                Explore o portfolio e leve arte para seu dia a dia.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-up opacity-0 stagger-4">
                <Link
                  to="/category/branding"
                  data-testid="hero-cta-explore"
                  className="inline-flex items-center gap-2 bg-[#121212] text-white py-3 px-8 text-sm uppercase tracking-[0.15em] hover:bg-[#333] hover:scale-[1.02] transition-all duration-300"
                >
                  Explorar <ArrowRight size={14} />
                </Link>
                <Link
                  to="/about"
                  data-testid="hero-cta-about"
                  className="inline-flex items-center gap-2 border border-[#121212] text-[#121212] py-3 px-8 text-sm uppercase tracking-[0.15em] hover:bg-[#121212] hover:text-white transition-all duration-300"
                >
                  Sobre o Artista
                </Link>
              </div>
            </div>
            <div className="md:col-span-5 animate-fade-up opacity-0 stagger-5">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1773291934008-192c98a47812?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYWJzdHJhY3QlMjBicmFuZGluZyUyMHBvc3RlcnxlbnwwfHx8fDE3NzYzMTE5MzR8MA&ixlib=rb-4.1.0&q=85"
                  alt="Arte em destaque"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section data-testid="categories-section" className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555] mb-4">Categorias</p>
          <h2 className="font-['Outfit'] text-3xl sm:text-4xl font-normal tracking-tight leading-tight text-[#121212] mb-16">
            Explore por Categoria
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                data-testid={`category-card-${cat.slug}`}
                className="group block"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="aspect-[4/5] overflow-hidden mb-4 bg-[#F3F3F3]">
                  {cat.image_url && (
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                </div>
                <h3 className="font-['Outfit'] text-xl font-medium text-[#121212] mb-1">{cat.name}</h3>
                <p className="text-sm text-[#555]">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section data-testid="featured-section" className="py-24 md:py-32 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555] mb-4">Destaques</p>
            <h2 className="font-['Outfit'] text-3xl sm:text-4xl font-normal tracking-tight leading-tight text-[#121212] mb-16">
              Produtos em Destaque
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  data-testid={`featured-product-${product.id}`}
                  className="group block"
                >
                  <div className="aspect-[3/4] overflow-hidden mb-4 bg-[#F3F3F3]">
                    {product.images?.[0] && (
                      <img
                        src={getImageSrc(product.images[0])}
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
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
