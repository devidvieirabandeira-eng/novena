/**
 * Revelação ao rolar. A classe que esconde os elementos (`html.rv-on`)
 * só é aplicada aqui, então sem JavaScript todo o conteúdo fica visível.
 */
export function initReveal() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('rv-on');

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        el.classList.add('in');
        el.addEventListener('transitionend', () => el.classList.add('done'), { once: true });
        io.unobserve(el);
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );

  document.querySelectorAll('.rv:not(.in)').forEach((el) => io.observe(el));
}
