/**
 * productDetail.styles.ts
 * Styles สำหรับ ProductDetail
 * ดึงสีจาก CSS variables ที่กำหนดใน index.css
 */

export const DETAIL_FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600;700&family=Orbitron:wght@400;700;900&display=swap');";

export const productDetailStyles = `
  ${DETAIL_FONT_IMPORT}

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Hero Layout ── */
  .pd-hero {
    display: grid; grid-template-columns: 55% 45%;
    gap: 0; min-height: 85vh; align-items: stretch;
  }
  @media(max-width:768px) { .pd-hero { grid-template-columns: 1fr; } }

  /* ── Image Panel ── */
  .pd-img-panel {
    background: #fff; display: flex; align-items: center; justify-content: center;
    padding: 3rem; position: relative; overflow: hidden; min-height: 500px;
  }
  .pd-img-panel::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(220,38,38,0.04) 0%, transparent 60%);
    pointer-events: none;
  }
  .pd-new-badge {
    position: absolute; top: 1.5rem; left: 1.5rem;
    background: var(--color-primary); color: #fff; font-family: 'Orbitron', sans-serif;
    font-size: 0.6rem; font-weight: 700; padding: 5px 14px; border-radius: 3px;
    letter-spacing: 0.15em; text-transform: uppercase; z-index: 2;
    box-shadow: 0 0 16px var(--color-primary-glow);
  }

  /* ── Info Panel ── */
  .pd-info-panel {
    background: var(--color-bg-deep); padding: 3rem 3rem 3rem 2.5rem;
    display: flex; flex-direction: column; border-left: 1px solid var(--color-border);
  }
  .pd-category-badge {
    display: inline-block; color: var(--color-primary); font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    border: 1px solid rgba(220,38,38,0.35); padding: 4px 10px; border-radius: 3px;
    margin-bottom: 1.25rem; font-family: 'Orbitron', sans-serif;
    background: rgba(220,38,38,0.06);
  }
  .pd-title {
    font-family: 'Orbitron', sans-serif; font-weight: 900;
    font-size: clamp(1.4rem, 2.5vw, 2.2rem); line-height: 1.15;
    margin: 0 0 1rem; color: var(--color-text);
  }
  .pd-rating-row {
    display: flex; align-items: center; gap: 0.75rem; font-size: 0.8rem;
    margin-bottom: 1.5rem; padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .pd-price-label { color: var(--color-text-muted); font-size: 0.78rem; margin-bottom: 0.3rem; }
  .pd-price-row { display: flex; align-items: flex-end; gap: 0.75rem; margin-bottom: 2rem; }
  .pd-price {
    font-family: 'Orbitron', sans-serif; font-size: 2.5rem; font-weight: 700;
    color: var(--color-primary); text-shadow: 0 0 20px var(--color-primary-glow);
  }
  .pd-price-old { color: var(--color-text-dim); font-size: 1.1rem; margin-bottom: 6px; text-decoration: line-through; }

  /* ── Quantity ── */
  .pd-qty-box {
    background: rgba(0,0,0,0.4); border: 1px solid var(--color-border);
    border-radius: 8px; padding: 1rem; margin-bottom: 1.75rem;
  }
  .pd-qty-label { display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 0.75rem; }
  .pd-qty-controls {
    display: flex; align-items: center;
    background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 6px; width: fit-content; overflow: hidden;
  }
  .pd-qty-btn {
    width: 2.5rem; height: 2.5rem; background: none; border: none;
    cursor: pointer; color: var(--color-text-muted); font-size: 1.3rem;
    transition: background 0.2s, color 0.2s; display: flex; align-items: center; justify-content: center;
  }
  .pd-qty-btn:hover { background: rgba(220,38,38,0.2); color: #fff; }
  .pd-qty-val { width: 3rem; text-align: center; font-weight: 700; font-size: 1rem; color: var(--color-text); }

  /* ── CTA Buttons ── */
  .pd-cta-row { display: flex; gap: 0.75rem; margin-top: auto; }
  .pd-btn-cart {
    flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15);
    color: #fff; padding: 0.9rem; border-radius: 6px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    transition: background 0.2s, border-color 0.2s; font-family: 'Orbitron', sans-serif;
    font-size: 0.72rem; letter-spacing: 0.1em;
  }
  .pd-btn-cart:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); }
  .pd-btn-buy {
    flex: 1; background: var(--color-primary); color: #fff; border: none;
    padding: 0.9rem; border-radius: 6px; font-weight: 700; cursor: pointer;
    font-family: 'Orbitron', sans-serif; font-size: 0.72rem; letter-spacing: 0.1em;
    box-shadow: 0 0 24px var(--color-primary-glow); transition: all 0.2s;
  }
  .pd-btn-buy:hover { background: var(--color-primary-hover); transform: translateY(-1px); }

  /* ── Content Area ── */
  .pd-content { padding: 4rem 5vw; }
  .pd-section-title {
    font-family: 'Orbitron', sans-serif; font-size: 1rem; font-weight: 700;
    display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;
    color: var(--color-text); letter-spacing: 0.05em;
  }
  .pd-section-bar { width: 5px; height: 1.5rem; background: var(--color-primary); border-radius: 999px; flex-shrink: 0; }
  .pd-desc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem; }
  @media(max-width:600px) { .pd-desc-grid { grid-template-columns: 1fr; } }
  .pd-desc-card {
    background: rgba(0,0,0,0.35); padding: 1.25rem; border-radius: 8px;
    border: 1px solid var(--color-border-subtle);
  }
  .pd-desc-card h3 { font-weight: 700; font-size: 0.85rem; margin: 0 0 0.75rem; font-family: 'Orbitron', sans-serif; letter-spacing: 0.05em; }

  /* ── Reviews ── */
  .pd-reviews { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
  @media(max-width:600px) { .pd-reviews { grid-template-columns: 1fr; } }
  .pd-review-card {
    background: var(--color-bg-card); border: 1px solid var(--color-border-subtle);
    border-radius: 10px; padding: 1.25rem; display: flex; gap: 1rem; transition: border-color 0.2s;
  }
  .pd-review-card:hover { border-color: rgba(220,38,38,0.3); }
  .pd-avatar {
    width: 2.75rem; height: 2.75rem; border-radius: 50%;
    background: linear-gradient(135deg, #374151, #111);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 0.75rem; color: var(--color-text-muted); flex-shrink: 0;
  }

  /* ── Related Products ── */
  .pd-related-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
  @media(max-width:900px) { .pd-related-grid { grid-template-columns: repeat(2,1fr); } }
  .pd-rel-card {
    background: var(--color-bg-card); border: 1px solid var(--color-border-subtle);
    border-radius: 10px; overflow: hidden; cursor: pointer;
    transition: border-color 0.3s, transform 0.2s;
  }
  .pd-rel-card:hover { border-color: rgba(220,38,38,0.5); transform: translateY(-4px); }

  .red-divider { width: 100%; height: 1px; background: linear-gradient(90deg, transparent, var(--color-primary), transparent); }
`;