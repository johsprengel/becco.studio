import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, setIsOpen } = useCart();
  const location = useLocation();

  useEffect(() => {
    axios.get(`${API}/categories`).then(r => setCategories(r.data)).catch(() => {});
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header data-testid="site-header" className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5">
      <div className="flex items-center justify-between px-6 md:px-12 h-16">
        <Link to="/" data-testid="logo-link" className="font-['Outfit'] text-xl font-light tracking-tighter text-[#121212] hover:text-[#333] transition-colors duration-300">
          ATELIER
        </Link>

        <nav className="hidden md:flex items-center gap-8" data-testid="desktop-nav">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              data-testid={`nav-${cat.slug}`}
              className={`text-sm tracking-[0.1em] uppercase transition-colors duration-300 ${
                isActive(`/category/${cat.slug}`) ? 'text-[#121212] font-medium' : 'text-[#555] hover:text-[#121212]'
              }`}
            >
              {cat.name}
            </Link>
          ))}
          <Link
            to="/about"
            data-testid="nav-about"
            className={`text-sm tracking-[0.1em] uppercase transition-colors duration-300 ${
              isActive('/about') ? 'text-[#121212] font-medium' : 'text-[#555] hover:text-[#121212]'
            }`}
          >
            Sobre
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            data-testid="cart-button"
            onClick={() => setIsOpen(true)}
            className="relative p-2 text-[#121212] hover:text-[#333] transition-colors duration-300"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#121212] text-white text-[10px] flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
          <button
            data-testid="mobile-menu-button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[#121212]"
          >
            {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div data-testid="mobile-nav" className="md:hidden fixed inset-0 top-16 bg-white z-40 flex flex-col items-start px-6 pt-12 gap-8">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              data-testid={`mobile-nav-${cat.slug}`}
              onClick={() => setMobileOpen(false)}
              className="text-2xl font-['Outfit'] font-light tracking-tight text-[#121212] hover:text-[#555] transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            to="/about"
            data-testid="mobile-nav-about"
            onClick={() => setMobileOpen(false)}
            className="text-2xl font-['Outfit'] font-light tracking-tight text-[#121212] hover:text-[#555] transition-colors"
          >
            Sobre
          </Link>
        </div>
      )}
    </header>
  );
}
