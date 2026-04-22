import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Package, Grid3X3, ShoppingCart, MessageSquare, Tag } from "lucide-react";
import { useEffect } from "react";

export default function AdminLayout({ children, title }) {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/admin/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center"><p className="text-[#555]">Carregando...</p></div>;
  }

  if (!user || user.role !== "admin") return null;

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/admin", label: "Painel", icon: Grid3X3 },
    { path: "/admin/products", label: "Produtos", icon: Package },
    { path: "/admin/categories", label: "Categorias", icon: Grid3X3 },
    { path: "/admin/orders", label: "Pedidos", icon: ShoppingCart },
    { path: "/admin/coupons", label: "Cupons", icon: Tag },
  ];

  return (
    <div data-testid="admin-layout" className="min-h-screen bg-[#FAFAFA]">
      {/* Top Bar */}
      <header className="bg-white border-b border-[#E5E5E5] h-14 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link to="/admin" className="font-['Outfit'] text-base font-medium tracking-tight text-[#121212]">
            ATELIER ADMIN
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`admin-nav-${item.label.toLowerCase()}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-[0.1em] transition-colors ${
                  isActive(item.path) ? 'bg-[#121212] text-white' : 'text-[#555] hover:text-[#121212] hover:bg-[#F3F3F3]'
                }`}
              >
                <item.icon size={13} strokeWidth={1.5} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xs text-[#555] hover:text-[#121212] transition-colors">Ver Site</Link>
          <button
            data-testid="admin-logout"
            onClick={async () => { await logout(); navigate("/admin/login"); }}
            className="flex items-center gap-1.5 text-xs text-[#555] hover:text-[#121212] transition-colors"
          >
            <LogOut size={13} /> Sair
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="md:hidden border-b border-[#E5E5E5] bg-white px-4 py-2 flex gap-1 overflow-x-auto">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs uppercase tracking-[0.05em] whitespace-nowrap ${
              isActive(item.path) ? 'bg-[#121212] text-white' : 'text-[#555]'
            }`}
          >
            <item.icon size={12} />
            {item.label}
          </Link>
        ))}
      </div>

      {/* Content */}
      <main className="px-6 py-8">
        {title && (
          <h1 data-testid="admin-page-title" className="font-['Outfit'] text-2xl font-medium tracking-tight text-[#121212] mb-6">
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}
