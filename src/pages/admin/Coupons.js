import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "@/components/AdminLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ code: "", discount_percent: "", max_uses: "100", active: true });

  const fetchCoupons = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/coupons`, { withCredentials: true });
      setCoupons(data);
    } catch {}
  };

  useEffect(() => { fetchCoupons(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ code: "", discount_percent: "", max_uses: "100", active: true });
    setDialogOpen(true);
  };

  const openEdit = (coupon) => {
    setEditing(coupon);
    setForm({
      code: coupon.code,
      discount_percent: String(coupon.discount_percent),
      max_uses: String(coupon.max_uses),
      active: coupon.active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      code: form.code,
      discount_percent: parseFloat(form.discount_percent),
      max_uses: parseInt(form.max_uses) || 100,
      active: form.active,
    };
    try {
      if (editing) {
        await axios.put(`${API}/admin/coupons/${editing.id}`, payload, { withCredentials: true });
        toast.success("Cupom atualizado");
      } else {
        await axios.post(`${API}/admin/coupons`, payload, { withCredentials: true });
        toast.success("Cupom criado");
      }
      setDialogOpen(false);
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Erro ao salvar");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Excluir este cupom?")) return;
    try {
      await axios.delete(`${API}/admin/coupons/${id}`, { withCredentials: true });
      toast.success("Cupom excluido");
      fetchCoupons();
    } catch {
      toast.error("Erro ao excluir");
    }
  };

  return (
    <AdminLayout title="Cupons de Desconto">
      <div data-testid="admin-coupons">
        <div className="flex justify-end mb-6">
          <button
            data-testid="add-coupon-btn"
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#121212] text-white py-2 px-4 text-xs uppercase tracking-[0.1em] hover:bg-[#333] transition-colors"
          >
            <Plus size={14} /> Novo Cupom
          </button>
        </div>

        <div className="bg-white border border-[#E5E5E5]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">Codigo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">Desconto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">Usos</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[#555]">Nenhum cupom encontrado</td>
                </tr>
              ) : (
                coupons.map(coupon => (
                  <tr key={coupon.id} data-testid={`coupon-row-${coupon.id}`} className="border-b border-[#E5E5E5] last:border-0">
                    <td className="px-4 py-3 text-[#121212] font-mono font-medium">{coupon.code}</td>
                    <td className="px-4 py-3 text-[#121212]">{coupon.discount_percent}%</td>
                    <td className="px-4 py-3 text-[#555]">{coupon.uses || 0} / {coupon.max_uses}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] font-semibold ${
                        coupon.active ? 'text-green-700 bg-green-50' : 'text-[#555] bg-[#F3F3F3]'
                      }`}>
                        {coupon.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button data-testid={`edit-coupon-${coupon.id}`} onClick={() => openEdit(coupon)} className="p-1.5 text-[#555] hover:text-[#121212] transition-colors mr-2">
                        <Pencil size={14} />
                      </button>
                      <button data-testid={`delete-coupon-${coupon.id}`} onClick={() => handleDelete(coupon.id)} className="p-1.5 text-[#A0A0A0] hover:text-red-600 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md bg-white rounded-none border border-[#E5E5E5]">
            <DialogHeader>
              <DialogTitle className="font-['Outfit'] text-xl font-medium">{editing ? "Editar Cupom" : "Novo Cupom"}</DialogTitle>
              <DialogDescription className="text-sm text-[#555]">Preencha os dados do cupom</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#555] mb-1.5 block">Codigo</label>
                <input
                  data-testid="coupon-code-input"
                  value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                  className="w-full border border-[#E5E5E5] py-2.5 px-3 text-sm outline-none focus:border-[#000] font-mono uppercase"
                  placeholder="EX: DESCONTO10"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#555] mb-1.5 block">Desconto (%)</label>
                  <input
                    data-testid="coupon-discount-input"
                    type="number"
                    step="0.1"
                    min="1"
                    max="100"
                    value={form.discount_percent}
                    onChange={e => setForm(f => ({ ...f, discount_percent: e.target.value }))}
                    className="w-full border border-[#E5E5E5] py-2.5 px-3 text-sm outline-none focus:border-[#000]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#555] mb-1.5 block">Max Usos</label>
                  <input
                    data-testid="coupon-maxuses-input"
                    type="number"
                    value={form.max_uses}
                    onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))}
                    className="w-full border border-[#E5E5E5] py-2.5 px-3 text-sm outline-none focus:border-[#000]"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  data-testid="coupon-active-checkbox"
                  type="checkbox"
                  checked={form.active}
                  onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                  className="w-4 h-4 accent-[#121212]"
                />
                <label className="text-sm text-[#555]">Cupom ativo</label>
              </div>
              <button
                data-testid="coupon-form-submit"
                type="submit"
                className="w-full bg-[#121212] text-white py-2.5 text-xs uppercase tracking-[0.15em] hover:bg-[#333] transition-colors"
              >
                {editing ? "Salvar Alteracoes" : "Criar Cupom"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
