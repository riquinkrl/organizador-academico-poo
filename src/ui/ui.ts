// 1. LÓGICA DO TEMA DARK/LIGHT
const btnThemeToggle = document.getElementById('btn-theme-toggle') as HTMLButtonElement | null;
const htmlElement = document.documentElement;

// Checa a preferência salva ao abrir a página
if (localStorage.getItem('theme') === 'dark') {
  htmlElement.classList.add('dark');
}

// Adiciona o evento de clique (agora vai funcionar!)
if (btnThemeToggle) {
  btnThemeToggle.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
    
    if (htmlElement.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });
}

// 2. ANIMAÇÕES DA BIBLIOTECA LUCIDE
const cards = document.querySelectorAll<HTMLElement>('.metric-card');

cards.forEach((card) => {
  card.classList.add('is-animating');
  setTimeout(() => {
    card.classList.remove('is-animating');
  }, 1000);
});

// 3. MENU LATERAL, FUNCIONALIDADE MOBILE
const btnToggleSidebar = document.getElementById('btn-toggle-sidebar') as HTMLButtonElement | null;
const sidebar = document.getElementById('sidebar') as HTMLElement | null;
const sidebarOverlay = document.getElementById('sidebar-overlay') as HTMLElement | null;

function abrirSidebar(): void {
  if (!sidebar || !sidebarOverlay || !btnToggleSidebar) return;
  sidebar.classList.remove('-translate-x-full');
  sidebarOverlay.classList.remove('hidden');
  btnToggleSidebar.setAttribute('aria-expanded', 'true');
}

function fecharSidebar(): void {
  if (!sidebar || !sidebarOverlay || !btnToggleSidebar) return;
  sidebar.classList.add('-translate-x-full');
  sidebarOverlay.classList.add('hidden');
  btnToggleSidebar.setAttribute('aria-expanded', 'false');
}

function sidebarEstaAberta(): boolean {
  return sidebar !== null && !sidebar.classList.contains('-translate-x-full');
}

if (btnToggleSidebar && sidebar && sidebarOverlay) {
  btnToggleSidebar.setAttribute('aria-expanded', 'false');

  // Botão ☰ abre e fecha o menu
  btnToggleSidebar.addEventListener('click', () => {
    if (sidebarEstaAberta()) {
      fecharSidebar();
    } else {
      abrirSidebar();
    }
  });

  // Clicar no fundo escurecido fecha o menu
  sidebarOverlay.addEventListener('click', fecharSidebar);

  // Tecla Esc fecha o menu
  document.addEventListener('keydown', (evento: KeyboardEvent) => {
    if (evento.key === 'Escape' && sidebarEstaAberta()) {
      fecharSidebar();
    }
  });

  // Ao clicar em um link do menu, fecha (útil no celular)
  sidebar.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 1023px)').matches) {
        fecharSidebar();
      }
    });
  });

  // Se a tela crescer para desktop com o menu aberto, limpa o estado do celular
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e: MediaQueryListEvent) => {
    if (e.matches) {
      fecharSidebar();
    }
  });
}