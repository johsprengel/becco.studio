import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import axios from "axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("checking");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }
    const poll = async () => {
      try {
        const { data } = await axios.get(`${API}/checkout/status/${sessionId}`);
        if (data.payment_status === "paid") {
          setStatus("success");
        } else if (data.status === "expired") {
          setStatus("expired");
        } else {
          if (attempts < 5) {
            setTimeout(() => setAttempts(a => a + 1), 2000);
          } else {
            setStatus("timeout");
          }
        }
      } catch {
        setStatus("error");
      }
    };
    poll();
  }, [sessionId, attempts]);

  return (
    <div data-testid="payment-success-page" className="min-h-screen bg-[#FAFAFA]">
      <Header />
      <section className="pt-32 pb-24 px-6 md:px-12 min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          {status === "checking" && (
            <div data-testid="payment-checking">
              <Loader2 className="w-12 h-12 text-[#555] animate-spin mx-auto mb-6" />
              <h1 className="font-['Outfit'] text-3xl font-normal tracking-tight text-[#121212] mb-4">Verificando pagamento...</h1>
              <p className="text-[#555]">Aguarde enquanto confirmamos seu pagamento.</p>
            </div>
          )}
          {status === "success" && (
            <div data-testid="payment-confirmed">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
              <h1 className="font-['Outfit'] text-3xl font-normal tracking-tight text-[#121212] mb-4">Pagamento Confirmado!</h1>
              <p className="text-[#555] mb-8">Obrigado pela sua compra. Entraremos em contato em breve.</p>
              <Link
                to="/"
                data-testid="back-to-home"
                className="inline-flex items-center bg-[#121212] text-white py-3 px-8 text-sm uppercase tracking-[0.15em] hover:bg-[#333] transition-colors"
              >
                Voltar ao Inicio
              </Link>
            </div>
          )}
          {(status === "error" || status === "expired" || status === "timeout") && (
            <div data-testid="payment-error">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h1 className="font-['Outfit'] text-3xl font-normal tracking-tight text-[#121212] mb-4">
                {status === "expired" ? "Sessao Expirada" : "Erro no Pagamento"}
              </h1>
              <p className="text-[#555] mb-8">
                {status === "timeout" ? "Nao foi possivel confirmar o pagamento. Verifique seu email." : "Houve um problema com seu pagamento. Tente novamente."}
              </p>
              <Link
                to="/"
                data-testid="back-to-home-error"
                className="inline-flex items-center bg-[#121212] text-white py-3 px-8 text-sm uppercase tracking-[0.15em] hover:bg-[#333] transition-colors"
              >
                Voltar ao Inicio
              </Link>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
