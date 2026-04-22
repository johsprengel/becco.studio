import { useState } from "react";
import { Send } from "lucide-react";
import axios from "axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSheet from "@/components/CartSheet";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function About() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Preencha todos os campos");
      return;
    }
    setSending(true);
    try {
      await axios.post(`${API}/contact`, form);
      toast.success("Mensagem enviada com sucesso!");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Erro ao enviar mensagem");
    } finally {
      setSending(false);
    }
  };

  return (
    <div data-testid="about-page" className="min-h-screen bg-[#FAFAFA]">
      <Header />
      <CartSheet />

      {/* About Section */}
      <section className="pt-32 pb-24 md:pb-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          <div className="md:col-span-5">
            <div className="aspect-[3/4] overflow-hidden bg-[#F3F3F3] sticky top-24">
              <img
                src="https://images.unsplash.com/photo-1627890458144-4c0c481bf4b8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBzdHVkaW8lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NzYzMTE5MjV8MA&ixlib=rb-4.1.0&q=85"
                alt="O Artista"
                data-testid="artist-portrait"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-7 flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555] mb-4">Sobre</p>
            <h1 data-testid="about-title" className="font-['Outfit'] text-5xl sm:text-6xl font-light tracking-tighter leading-none text-[#121212] mb-8">
              O Artista
            </h1>
            <div className="space-y-4 text-base text-[#555] leading-relaxed max-w-xl">
              <p>
                Cada peca que crio carrega uma historia unica. Meu trabalho transita entre o branding,
                a moda e a arte decorativa, sempre buscando conectar estetica e funcionalidade.
              </p>
              <p>
                Com anos de experiencia em design e artes visuais, desenvolvo projetos que vao desde
                identidades visuais completas ate pecas artesanais exclusivas para decoracao.
              </p>
              <p>
                Acredito que a arte deve fazer parte do cotidiano. Por isso, cada produto e pensado para
                ser acessivel sem perder sua essencia artistica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section data-testid="contact-section" className="py-24 md:py-32 px-6 md:px-12 bg-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555] mb-4 text-center">Contato</p>
          <h2 className="font-['Outfit'] text-3xl sm:text-4xl font-normal tracking-tight leading-tight text-[#121212] mb-12 text-center">
            Fale Comigo
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555] mb-2 block">Nome</label>
              <input
                data-testid="contact-name"
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border-b border-[#E5E5E5] bg-transparent py-3 text-[#121212] outline-none focus:border-[#121212] transition-colors"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555] mb-2 block">Email</label>
              <input
                data-testid="contact-email"
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full border-b border-[#E5E5E5] bg-transparent py-3 text-[#121212] outline-none focus:border-[#121212] transition-colors"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555] mb-2 block">Mensagem</label>
              <textarea
                data-testid="contact-message"
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                rows={5}
                className="w-full border-b border-[#E5E5E5] bg-transparent py-3 text-[#121212] outline-none focus:border-[#121212] transition-colors resize-none"
                placeholder="Sua mensagem..."
              />
            </div>
            <button
              data-testid="contact-submit"
              type="submit"
              disabled={sending}
              className="bg-[#121212] text-white py-3 px-8 text-sm uppercase tracking-[0.15em] hover:bg-[#333] transition-colors duration-300 flex items-center gap-2 disabled:opacity-50"
            >
              {sending ? "Enviando..." : "Enviar Mensagem"} <Send size={14} />
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
