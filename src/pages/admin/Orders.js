import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "@/components/AdminLayout";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get(`${API}/admin/orders`, { withCredentials: true })
      .then(r => setOrders(r.data))
      .catch(() => {});
  }, []);

  const statusColor = (status) => {
    if (status === "paid") return "text-green-700 bg-green-50";
    if (status === "pending") return "text-yellow-700 bg-yellow-50";
    return "text-[#555] bg-[#F3F3F3]";
  };

  return (
    <AdminLayout title="Pedidos">
      <div data-testid="admin-orders">
        <div className="bg-white border border-[#E5E5E5] overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">Produto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">Valor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">Data</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[#555]">Nenhum pedido encontrado</td>
                </tr>
              ) : (
                orders.map((order, idx) => (
                  <tr key={idx} data-testid={`order-row-${idx}`} className="border-b border-[#E5E5E5] last:border-0">
                    <td className="px-4 py-3 text-[#121212] font-medium">{order.product_name}</td>
                    <td className="px-4 py-3 text-[#121212]">R$ {order.amount?.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] font-semibold ${statusColor(order.payment_status)}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#555] text-xs">{order.created_at ? new Date(order.created_at).toLocaleString("pt-BR") : "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
