import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight } from "lucide-react";

function formatApiErrorDetail(detail) {
  if (detail == null) return "Algo deu errado. Tente novamente.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map(e => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="admin-login-page" className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-['Outfit'] text-3xl font-light tracking-tighter text-[#121212] mb-2">Admin</h1>
        <p className="text-sm text-[#555] mb-10">Entre com suas credenciais</p>

        {error && (
          <div data-testid="login-error" className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555] mb-2 block">Email</label>
            <input
              data-testid="login-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-[#E5E5E5] bg-white py-3 px-4 text-sm text-[#121212] outline-none focus:border-[#000] transition-colors"
              placeholder="admin@artista.com"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555] mb-2 block">Senha</label>
            <input
              data-testid="login-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-[#E5E5E5] bg-white py-3 px-4 text-sm text-[#121212] outline-none focus:border-[#000] transition-colors"
              placeholder="Sua senha"
              required
            />
          </div>
          <button
            data-testid="login-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-[#121212] text-white py-3 px-6 text-sm uppercase tracking-[0.15em] hover:bg-[#333] transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"} <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
