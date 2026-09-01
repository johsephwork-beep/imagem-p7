import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Quiz } from './pages/Quiz';
import { Resultado } from './pages/Resultado';
import { Desempenho } from './pages/Desempenho';
import { Topicos } from './pages/Topicos';
import { Duelo } from './pages/Duelo';
import { useLenis, getLenis } from './hooks/useLenis';

/** Sobe o scroll para o topo a cada troca de rota. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [pathname]);
  return null;
}

function AppInner() {
  useLenis();

  return (
    <div className="min-h-dvh flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/"                     element={<Dashboard />} />
          <Route path="/quiz/:topicId"        element={<Quiz />} />
          <Route path="/resultado/:sessionId" element={<Resultado />} />
          <Route path="/desempenho"           element={<Desempenho />} />
          <Route path="/topicos"              element={<Topicos />} />
          <Route path="/duelo"                element={<Duelo />} />
        </Routes>
      </main>

      <footer className="border-t border-brand-border py-6 text-center text-brand-muted text-xs">
        <p className="font-display font-600 text-brand-text/70 mb-1">IMAGEM P7 — UNIMA Afya P7 2026</p>
        <p>Monitores: Johseph Carvalho · Lucas Gabriel · José Petrúcio · Rafael Viana</p>
        <p className="mt-0.5">Professora: Érica Oliveira Alves Cardoso</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
