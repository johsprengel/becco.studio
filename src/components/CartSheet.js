import { Minus, Plus, Trash2, ArrowRight, Tag, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CartSheet() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validating, setValidating] = useState(false);

  const discountAmount = appliedCoupon ? total * (appliedCoupon.discount_percent / 100) : 0;
  const finalTotal = total - discountAmount;

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidating(true);
    try {
      const { data } = await axios.post(`${API}/coupons/validate`, { code: couponCode });
      setAppliedCoupon(data);
      toast.success(`Cupom ${data.code} aplicado! ${data.discount_percent}% de desconto`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Cupom invalido");
      setAppliedCoupon(null);
    } finally {
      setValidating(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const firstItem = items[0];
      const { data } = await axios.post(`${API}/checkout`, {
        product_id: firstItem.id,
        quantity: firstItem.quantity,
        origin_url: window.location.origin,
        coupon_code: appliedCoupon?.code || null
      }, { withCredentials: true });
      if (data.url) {
        clearCart();
        setAppliedCoupon(null);
        setCouponCode("");
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-white border-l border-[#E5E5E5] p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-[#E5E5E5]">
          <SheetTitle className="font-['Outfit'] text-xl font-medium tracking-tight">Carrinho</SheetTitle>
          <SheetDescription className="text-sm text-[#555]">{items.length} {items.length === 1 ? 'item' : 'itens'}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div data-testid="cart-empty" className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-[#555] text-sm">Seu carrinho esta vazio</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} data-testid={`cart-item-${item.id}`} className="flex gap-4 pb-4 border-b border-[#E5E5E5]">
                  <div className="w-20 h-20 bg-[#F3F3F3] overflow-hidden flex-shrink-0">
                    {item.images?.[0] && (
                      <img
                        src={item.images[0].startsWith("/api/") ? `${process.env.REACT_APP_BACKEND_URL}${item.images[0]}` : item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-[#121212] truncate">{item.name}</h4>
                    <p className="text-sm text-[#555] mt-1">R$ {item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        data-testid={`cart-decrease-${item.id}`}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 border border-[#E5E5E5] flex items-center justify-center hover:bg-[#F3F3F3] transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        data-testid={`cart-increase-${item.id}`}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 border border-[#E5E5E5] flex items-center justify-center hover:bg-[#F3F3F3] transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        data-testid={`cart-remove-${item.id}`}
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-[#A0A0A0] hover:text-[#121212] transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#E5E5E5] px-6 py-6">
            {/* Coupon */}
            <div className="mb-4">
              {appliedCoupon ? (
                <div data-testid="applied-coupon" className="flex items-center justify-between bg-[#F3F3F3] px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-green-600" />
                    <span className="text-sm font-medium text-green-700">{appliedCoupon.code}</span>
                    <span className="text-xs text-[#555]">-{appliedCoupon.discount_percent}%</span>
                  </div>
                  <button data-testid="remove-coupon" onClick={removeCoupon} className="text-[#A0A0A0] hover:text-[#121212]">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    data-testid="coupon-input"
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="Cupom de desconto"
                    className="flex-1 border border-[#E5E5E5] py-2 px-3 text-sm outline-none focus:border-[#000] transition-colors"
                  />
                  <button
                    data-testid="apply-coupon-btn"
                    onClick={handleValidateCoupon}
                    disabled={validating}
                    className="border border-[#121212] text-[#121212] px-3 py-2 text-xs uppercase tracking-[0.1em] hover:bg-[#121212] hover:text-white transition-colors disabled:opacity-50"
                  >
                    {validating ? "..." : "Aplicar"}
                  </button>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-[#555]">Subtotal</span>
                <span className="text-sm text-[#121212]">R$ {total.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between">
                  <span className="text-sm text-green-600">Desconto ({appliedCoupon.discount_percent}%)</span>
                  <span data-testid="discount-amount" className="text-sm text-green-600">- R$ {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-[#E5E5E5]">
                <span className="text-sm font-medium text-[#121212]">Total</span>
                <span data-testid="cart-total" className="text-lg font-medium text-[#121212]">R$ {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              data-testid="checkout-button"
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-[#121212] text-white py-3 px-6 text-sm uppercase tracking-[0.15em] hover:bg-[#333] transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Processando..." : "Finalizar Compra"}
              {!loading && <ArrowRight size={14} />}
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
