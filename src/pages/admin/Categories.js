import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "@/components/AdminLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", image_url: "" });

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API}/categories`);
      setCategories(data);
    } catch {}
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", image_url: "" });
    setDialogOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || "", image_url: cat.image_url || "" });
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API}/admin/categories/${editing.slug}`, form, { withCredentials: true });
        toast.success("Categoria atualizada");
      } else {
        await axios.post(`${API}/admin/categories`, form, { withCredentials: true });
        toast.success("Categoria criada");
      }
      setDialogOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Erro ao salvar");
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;
    try {
      await axios.delete(`${API}/admin/categories/${slug}`, { withCredentials: true });
      toast.success("Categoria excluida");
      fetchCategories();
    } catch {
      toast.error("Erro ao excluir");
    }
  };

  return (
    <AdminLayout title="Categorias">
      <div data-testid="admin-categories">
        <div className="flex justify-end mb-6">
          <button
            data-testid="add-category-btn"
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#121212] text-white py-2 px-4 text-xs uppercase tracking-[0.1em] hover:bg-[#333] transition-colors"
          >
            <Plus size={14} /> Nova Categoria
          </button>
        </div>

        <div className="bg-white border border-[#E5E5E5]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">Nome</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">Slug</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#555] hidden md:table-cell">Descricao</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.slug} data-testid={`category-row-${cat.slug}`} className="border-b border-[#E5E5E5] last:border-0">
                  <td className="px-4 py-3 text-[#121212] font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-[#555]">{cat.slug}</td>
                  <td className="px-4 py-3 text-[#555] hidden md:table-cell truncate max-w-xs">{cat.description}</td>
                  <td className="px-4 py-3 text-right">
                    <button data-testid={`edit-category-${cat.slug}`} onClick={() => openEdit(cat)} className="p-1.5 text-[#555] hover:text-[#121212] transition-colors mr-2">
                      <Pencil size={14} />
                    </button>
                    <button data-testid={`delete-category-${cat.slug}`} onClick={() => handleDelete(cat.slug)} className="p-1.5 text-[#A0A0A0] hover:text-red-600 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md bg-white rounded-none border border-[#E5E5E5]">
            <DialogHeader>
              <DialogTitle className="font-['Outfit'] text-xl font-medium">{editing ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
              <DialogDescription className="text-sm text-[#555]">Preencha os dados da categoria</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#555] mb-1.5 block">Nome</label>
                <input
                  data-testid="category-name-input"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-[#E5E5E5] py-2.5 px-3 text-sm outline-none focus:border-[#000] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#555] mb-1.5 block">Slug</label>
                <input
                  data-testid="category-slug-input"
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  className="w-full border border-[#E5E5E5] py-2.5 px-3 text-sm outline-none focus:border-[#000] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#555] mb-1.5 block">Descricao</label>
                <textarea
                  data-testid="category-description-input"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full border border-[#E5E5E5] py-2.5 px-3 text-sm outline-none focus:border-[#000] transition-colors resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#555] mb-1.5 block">URL da Imagem</label>
                <input
                  data-testid="category-image-input"
                  value={form.image_url}
                  onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                  className="w-full border border-[#E5E5E5] py-2.5 px-3 text-sm outline-none focus:border-[#000] transition-colors"
                />
              </div>
              <button
                data-testid="category-form-submit"
                type="submit"
                className="w-full bg-[#121212] text-white py-2.5 text-xs uppercase tracking-[0.15em] hover:bg-[#333] transition-colors"
              >
                {editing ? "Salvar Alteracoes" : "Criar Categoria"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
