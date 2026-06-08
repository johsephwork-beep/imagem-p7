import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

let globalLenis: Lenis | null = null;

/** Retorna a instância global do Lenis para uso externo (ex: scroll para o topo). */
export function getLenis(): Lenis | null {
  return globalLenis;
}

/**
 * Inicializa o Lenis smooth scroll.
 * Deve ser chamado UMA VEZ no topo da árvore (App.tsx).
 * Integra-se ao requestAnimationFrame nativamente.
 */
export function useLenis() {
  const rafIdRef = useRef<number>(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    globalLenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }

    rafIdRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      lenis.destroy();
      globalLenis = null;
    };
  }, []);
}
