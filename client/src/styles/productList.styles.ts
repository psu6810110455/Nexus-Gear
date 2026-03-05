/**
 * productList.styles.ts
 * Styles สำหรับ ProductListPage
 * ดึงสีจาก CSS variables ที่กำหนดใน index.css
 */

export const LIST_FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600;700&family=Orbitron:wght@400;700;900&display=swap');";

export const productListStyles = `
  ${LIST_FONT_IMPORT}

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Hero Header ── */
  .pl-hero {
    width: 100%; padding: 4rem 5vw 3rem;
    background: radial-gradient(ellipse at 50% 0%, rgba(127,29,29,0.2) 0%, transparent 65%);
    border-bottom: 1px solid var(--color-border); text-align: center;
  }
  .pl-hero-title {
    font-family: 'Orbitron', sans-serif; font-weight: 900;
    font-size: clamp(2rem, 5vw, 3.5rem); letter-spacing: 0.05em;
    color: transparent;
    background: linear-gradient(135deg, #fff 30%, var(--color-primary) 100%);
    -webkit-background-clip: text; background-clip: text;
    margin: 0 0 0.5rem; line-height: 1;
    filter: drop-shadow(0 0 20px var(--color-primary-glow));
  }
  .pl-hero-sub {
    font-family: 'Orbitron', sans-serif; font-size: 0.65rem;
    letter-spacing: 0.35em; color: var(--color-text-muted); text-transform: uppercase;
  }

  /* ── Search Bar ── */
  .pl-search-wrap {
    position: relative; max-width: 640px; margin: 2.5rem auto 0;
  }
  .pl-search-icon {
    position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%);
    color: var(--color-text-muted); pointer-events: none; transition: color 0.3s;
  }
  .pl-search-wrap:focus-within .pl-search-icon { color: var(--color-primary); }
  .pl-search-input {
    width: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px);
    border: 1px solid var(--color-border); border-radius: 50px;
    padding: 1rem 1.5rem 1rem 3.5rem; color: var(--color-text); font-size: 0.95rem;
    font-family: 'Kanit', sans-serif; outline: none; transition: all 0.3s;
    box-sizing: border-box;
  }
  .pl-search-input::placeholder { color: var(--color-text-dim); }
  .pl-search-input:focus { border-color: var(--color-primary); box-shadow: 0 0 20px var(--color-primary-glow); }

  /* ── Body Layout ── */
  .pl-body { display: flex; gap: 2rem; padding: 2.5rem 5vw; align-items: flex-start; }
  @media(max-width:768px) { .pl-body { flex-direction: column; } }
`;