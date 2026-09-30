/** Menu mobile: abre/fecha o painel, fecha ao clicar num link, com Esc ou ao voltar para desktop. */
export function initMenu() {
  const button = document.querySelector('.menu-btn');
  const panel = document.getElementById('menu-mobile');
  if (!button || !panel) return;

  const setOpen = (open, { focusButton = false } = {}) => {
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    panel.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    if (focusButton) button.focus();
  };

  button.addEventListener('click', () => {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });

  panel.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) setOpen(false, { focusButton: true });
  });

  window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });

  // O logo também leva ao topo e deve fechar o menu.
  document.querySelector('.brand')?.addEventListener('click', () => setOpen(false));
}
