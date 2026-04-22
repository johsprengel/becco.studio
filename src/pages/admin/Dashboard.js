import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "@/components/AdminLayout";
import { Package, ShoppingCart, Grid3X3, MessageSquare, Tag } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, contacts: 0, coupons: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prods, cats, orders, contacts, coupons] = await Promise.all([
          axios.get(`${API}/products`),
          axios.get(`${API}/categories`),
          axios.get(`${API}/admin/orders`, { withCredentials: true }),
          axios.get(`${API}/admin/contacts`, { withCredentials: true }),
          axios.get(`${API}/admin/coupons`, { withCredentials: true }),
        ]);
        setStats({
          products: (prods.data.products || prods.data).length,
          categories: cats.data.length,
          orders: orders.data.length,
          contacts: contacts.data.length,
          coupons: coupons.data.length,
        });
      } catch {}
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Produtos", value: stats.products, icon: Package },
    { label: "Categorias", value: stats.categories, icon: Grid3X3 },
    { label: "Pedidos", value: stats.orders, icon: ShoppingCart },
    { label: "Mensagens", value: stats.contacts, icon: MessageSquare },
    { label: "Cupons", value: stats.coupons, icon: Tag },
  ];

  return (
    <AdminLayout title="Painel de Controle">
      <div data-testid="admin-dashboard" className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.label} data-testid={`stat-${card.label.toLowerCase()}`} className="bg-white border border-[#E5E5E5] p-6">
            <div className="flex items-center gap-3 mb-4">
              <card.icon size={16} className="text-[#555]" strokeWidth={1.5} />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#555]">{card.label}</span>
            </div>
            <p className="font-['Outfit'] text-3xl font-light text-[#121212]">{card.value}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
