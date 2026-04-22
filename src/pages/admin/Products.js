import { useState, useEffect, useRef } from "react";
import axios from "axios";
import AdminLayout from "@/components/AdminLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const emptyForm = { name: "", description: "", price: "", images: "", category_id: "", stock: "", featured: false };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const fetchData = async () => {
    try {
      const [prods, cats] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/categories`),
      ]);
      setProducts(prods.data.products || prods.data);
      setCategories(cats.data);
    } catch {}
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (prod) => {
    setEditing(prod);
    setForm({
      name: prod.name,
      description: prod.description || "",
      price: String(prod.price),
      images: (prod.images || []).join("\n"),
      category_id: prod.category_id,
      stock: String(prod.stock),
      featured: prod.featured || false,
    });
    setDialogOpen(true);
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await axios.post(`${API}/admin/upload`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      const imageUrl = data.url;
      setForm(f => ({
        ...f,
        images: f.images ? f.images + "\n" + imageUrl : imageUrl,
      }));
      toast.success("Imagem enviada com sucesso!");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Erro ao enviar imagem");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      images: form.images.split("\n").map(s => s.trim()).filter(Boolean),
      category_id: form.category_id,
      stock: parseInt(form.stock) || 0,
      featured: form.featured,
    };
    try {
      if (editing) {
        await axios.put(`${API}/admin/products/${editing.id}`, payload, { withCredentials: true });
        toast.success("Produto atualizado");
      } else {
        await axios.post(`${API}/admin/products`, payload, { withCredentials: true });
        toast.success("Produto criado");
      }
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Erro ao salvar");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Excluir este produto?")) return;
    try {
      await axios.delete(`${API}/admin/products/${id}`, { withCredentials: true });
      toast.success("Produto excluido");
      fetchData();
    } catch {
      toast.error("Erro ao excluir");
    }
  };

  const getCatName = (catId) => categories.find(c => c.id === catId)?.name || "-";

  const getImageSrc = (url) => {
    if (!url) return "";
    return url.startsWith("/api/") ? `${process.env.REACT_APP_BACKEND_URL}${url}` : url;
  };

  return (
    <AdminLayout title="Produtos">
      <div data-testid="admin-products">
        <div className="flex justify-end mb-6">
          <button
            data-testid="add-product-btn"
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#121212] text-white py-2 px-4 text-xs uppercase tracking-[0.1em] hover:bg-[#333] transition-colors"
          >
            <Plus size={14} /> Novo Produto
          </button>
        </div>

        <div className="bg-white border border-[#E5E5E5] overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">Produto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">Categoria</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">Preco</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">Estoque</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod.id} data-testid={`product-row-${prod.id}`} className="border-b border-[#E5E5E5] last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#F3F3F3] overflow-hidden flex-shrink-0">
                        {prod.images?.[0] && <img src={getImageSrc(prod.images[0])} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <span className="text-[#121212] font-medium block">{prod.name}</span>
                        {prod.featured && <span className="text-[10px] uppercase tracking-[0.1em] text-[#555] bg-[#F3F3F3] px-1.5 py-0.5">Destaque</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#555]">{getCatName(prod.category_id)}</td>
                  <td className="px-4 py-3 text-[#121212]">R$ {prod.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-[#555]">{prod.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <button data-testid={`edit-product-${prod.id}`} onClick={() => openEdit(prod)} className="p-1.5 text-[#555] hover:text-[#121212] transition-colors mr-2">
                      <Pencil size={14} />
                    </button>
                    <button data-testid={`delete-product-${prod.id}`} onClick={() => handleDelete(prod.id)} className="p-1.5 text-[#A0A0A0] hover:text-red-600 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg bg-white rounded-none border border-[#E5E5E5]">
            <DialogHeader>
              <DialogTitle className="font-['Outfit'] text-xl font-medium">{editing ? "Editar Produto" : "Novo Produto"}</DialogTitle>
              <DialogDescription className="text-sm text-[#555]">Preencha os dados do produto</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#555] mb-1.5 block">Nome</label>
                <input
                  data-testid="product-name-input"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-[#E5E5E5] py-2.5 px-3 text-sm outline-none focus:border-[#000]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#555] mb-1.5 block">Descricao</label>
                <textarea
                  data-testid="product-description-input"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-[#E5E5E5] py-2.5 px-3 text-sm outline-none focus:border-[#000] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#555] mb-1.5 block">Preco (R$)</label>
                  <input
                    data-testid="product-price-input"
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full border border-[#E5E5E5] py-2.5 px-3 text-sm outline-none focus:border-[#000]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#555] mb-1.5 block">Estoque</label>
                  <input
                    data-testid="product-stock-input"
                    type="number"
                    value={form.stock}
                    onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                    className="w-full border border-[#E5E5E5] py-2.5 px-3 text-sm outline-none focus:border-[#000]"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#555] mb-1.5 block">Categoria</label>
                <select
                  data-testid="product-category-select"
                  value={form.category_id}
                  onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                  className="w-full border border-[#E5E5E5] py-2.5 px-3 text-sm outline-none focus:border-[#000] bg-white"
                  required
                >
                  <option value="">Selecione...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#555] mb-1.5 block">Imagens</label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    data-testid="upload-image-btn"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 border border-dashed border-[#E5E5E5] px-4 py-2 text-xs uppercase tracking-[0.1em] text-[#555] hover:border-[#000] hover:text-[#121212] transition-colors disabled:opacity-50"
                  >
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {uploading ? "Enviando..." : "Enviar Imagem"}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </div>
                <textarea
                  data-testid="product-images-input"
                  value={form.images}
                  onChange={e => setForm(f => ({ ...f, images: e.target.value }))}
                  rows={3}
                  className="w-full border border-[#E5E5E5] py-2.5 px-3 text-sm outline-none focus:border-[#000] resize-none"
                  placeholder="URLs das imagens (uma por linha) ou use o botao acima"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  data-testid="product-featured-checkbox"
                  type="checkbox"
                  checked={form.featured}
                  onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                  className="w-4 h-4 accent-[#121212]"
                />
                <label className="text-sm text-[#555]">Produto em destaque</label>
              </div>
              <button
                data-testid="product-form-submit"
                type="submit"
                className="w-full bg-[#121212] text-white py-2.5 text-xs uppercase tracking-[0.15em] hover:bg-[#333] transition-colors"
              >
                {editing ? "Salvar Alteracoes" : "Criar Produto"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
