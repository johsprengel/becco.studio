import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="bg-[#0A0A0A] text-white py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-6">
            <h2 className="font-['Outfit'] text-5xl sm:text-6xl font-light tracking-tighter leading-none text-white mb-6">
              ATELIER
            </h2>
            <p className="text-[#888] text-base max-w-md leading-relaxed">
              Arte, design e criatividade transformados em produtos unicos. Cada peca conta uma historia.
            </p>
          </div>
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#888] mb-6">Navegacao</h3>
            <div className="flex flex-col gap-3">
              <Link to="/" className="text-white/70 hover:text-white transition-colors duration-300 text-sm">Inicio</Link>
              <Link to="/category/branding" className="text-white/70 hover:text-white transition-colors duration-300 text-sm">Branding</Link>
              <Link to="/category/roupas-acessorios" className="text-white/70 hover:text-white transition-colors duration-300 text-sm">Roupas & Acessorios</Link>
              <Link to="/category/artigos-decorativos" className="text-white/70 hover:text-white transition-colors duration-300 text-sm">Artigos Decorativos</Link>
            </div>
          </div>
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#888] mb-6">Contato</h3>
            <div className="flex flex-col gap-3">
              <Link to="/about" className="text-white/70 hover:text-white transition-colors duration-300 text-sm">Sobre o Artista</Link>
              <Link to="/about" className="text-white/70 hover:text-white transition-colors duration-300 text-sm">Fale Conosco</Link>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-[#555] text-xs tracking-[0.1em]">&copy; {new Date().getFullYear()} ATELIER. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
