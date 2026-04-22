import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Minus, Plus } from "lucide-react";
import axios from "axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSheet from "@/components/CartSheet";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const getImageSrc = (url) => {
  if (!url) return "";
  return url.startsWith("/api/") ? `${BACKEND_URL}${url}` : url;
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast.success(`${product.name} adicionado ao carrinho`);
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Header />
        <div className="pt-32 px-6 text-center">
          <p className="text-[#555]">{loading ? "Carregando..." : "Produto nao encontrado"}</p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="product-detail-page" className="min-h-screen bg-[#FAFAFA]">
      <Header />
      <CartSheet />

      <section className="pt-24 pb-24 md:pb-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <Link to="/" data-testid="back-link" className="inline-flex items-center gap-2 text-sm text-[#555] hover:text-[#121212] transition-colors mb-8">
            <ArrowLeft size={14} /> Voltar
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
            {/* Image */}
            <div className="md:col-span-7">
              <div className="aspect-[4/5] overflow-hidden bg-[#F3F3F3]">
                {product.images?.[0] && (
                  <img
                    src={getImageSrc(product.images[0])}
                    alt={product.name}
                    data-testid="product-image"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Details */}
            <div className="md:col-span-5 flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555] mb-4">Produto</p>
              <h1 data-testid="product-name" className="font-['Outfit'] text-3xl sm:text-4xl font-normal tracking-tight leading-tight text-[#121212] mb-4">
                {product.name}
              </h1>
              <p data-testid="product-price" className="text-2xl font-light text-[#121212] mb-6">
                R$ {product.price.toFixed(2)}
              </p>
              <p data-testid="product-description" className="text-base text-[#555] leading-relaxed mb-8">
                {product.description}
              </p>

              {product.stock > 0 ? (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-sm text-[#555]">Quantidade</span>
                    <div className="flex items-center border border-[#E5E5E5]">
                      <button
                        data-testid="quantity-decrease"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-[#F3F3F3] transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span data-testid="quantity-value" className="w-12 text-center text-sm">{quantity}</span>
                      <button
                        data-testid="quantity-increase"
                        onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-[#F3F3F3] transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button
                    data-testid="add-to-cart-button"
                    onClick={handleAddToCart}
                    className="w-full bg-[#121212] text-white py-4 px-8 text-sm uppercase tracking-[0.15em] hover:bg-[#333] hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Adicionar ao Carrinho <ArrowRight size={14} />
                  </button>
                </>
              ) : (
                <p data-testid="out-of-stock" className="text-sm text-[#A0A0A0] uppercase tracking-[0.1em]">Esgotado</p>
              )}

              <p className="text-xs text-[#A0A0A0] mt-4">
                {product.stock > 0 ? `${product.stock} em estoque` : "Indisponivel"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
