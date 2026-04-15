import { carouselPhotos, carouselVideos } from './data.js';

// ─── CSS ───
const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { overflow: hidden; font-family: 'Inter', sans-serif; cursor: default; }

  #hero-header {
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    text-align: center; z-index: 10; pointer-events: none;
    opacity: 0; transition: opacity 0.8s ease;
  }
  #hero-header.visible { opacity: 1; }
  #hero-header h1 {
    font-size: 14px; letter-spacing: 6px; text-transform: uppercase;
    color: rgba(255,255,255,0.5); font-weight: 300; margin-bottom: 4px;
  }
  #hero-header h2 {
    font-size: 28px; font-weight: 800; letter-spacing: 2px;
    animation: headerGlow 2.5s ease-in-out infinite, headerShimmer 4s linear infinite;
    background: linear-gradient(90deg, #cc0000 0%, #cc0000 40%, #ff4444 50%, #cc0000 60%, #cc0000 100%);
    background-size: 200% 100%;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 12px rgba(204,0,0,0.5));
  }
  @keyframes headerGlow {
    0%, 100% { filter: drop-shadow(0 0 8px rgba(204,0,0,0.4)); }
    50% { filter: drop-shadow(0 0 20px rgba(204,0,0,0.8)) drop-shadow(0 0 40px rgba(204,0,0,0.3)); }
  }
  @keyframes headerShimmer {
    0% { background-position: 200% 0; } 100% { background-position: -200% 0; }
  }
  #hero-header p {
    font-size: 11px; color: rgba(255,255,255,0.35); margin-top: 4px;
    letter-spacing: 3px; text-transform: uppercase;
  }

  #instructions {
    position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
    text-align: center; z-index: 10; pointer-events: none;
    opacity: 0; transition: opacity 0.8s ease;
  }
  #instructions.visible { opacity: 1; }
  #instructions span {
    display: inline-block; padding: 8px 20px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 100px; color: rgba(255,255,255,0.4); font-size: 11px;
    letter-spacing: 1px; backdrop-filter: blur(10px); max-width: 90vw;
  }

  .modal-creator-signature {
    margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,215,0,0.15);
    font-size: 11px; color: rgba(255,215,0,0.6); font-style: italic; text-align: right;
  }

  #memories-btn { display: none; }

  #gallery-panel {
    position: fixed; top: 0; right: -480px; width: 460px; max-width: 90vw;
    height: 100vh; z-index: 200; background: rgba(20,0,0,0.85);
    border-left: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(40px) saturate(1.4); -webkit-backdrop-filter: blur(40px) saturate(1.4);
    transition: right 0.5s cubic-bezier(0.16,1,0.3,1);
    display: flex; flex-direction: column; overflow: hidden;
  }
  #gallery-panel.open { right: 0; }
  #gallery-header { padding: 28px 28px 0 28px; flex-shrink: 0; }
  #gallery-header .gallery-label {
    font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
    color: rgba(255,255,255,0.3); margin-bottom: 6px;
  }
  #gallery-header .gallery-title {
    font-size: 22px; font-weight: 700;
    background: linear-gradient(135deg, #ffffff, #ff6666);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 4px;
  }
  #gallery-header .gallery-subtitle {
    font-size: 11px; color: rgba(255,255,255,0.3); letter-spacing: 1.5px; margin-bottom: 20px;
  }
  #gallery-header .gallery-divider {
    width: 100%; height: 1px;
    background: linear-gradient(90deg, rgba(204,0,0,0.4), rgba(255,215,0,0.2), transparent);
  }
  #gallery-close {
    position: absolute; top: 20px; right: 20px; width: 34px; height: 34px;
    border-radius: 50%; border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.5);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 15px; transition: all 0.2s; z-index: 5;
  }
  #gallery-close:hover { background: rgba(255,255,255,0.15); color: #fff; }
  #gallery-scroll {
    flex: 1; overflow-y: auto; overflow-x: hidden; padding: 20px 28px 28px 28px;
    scrollbar-width: thin; scrollbar-color: rgba(204,0,0,0.3) transparent;
  }
  #gallery-scroll::-webkit-scrollbar { width: 4px; }
  #gallery-scroll::-webkit-scrollbar-track { background: transparent; }
  #gallery-scroll::-webkit-scrollbar-thumb { background: rgba(204,17,51,0.3); border-radius: 4px; }

  .gallery-team-card {
    width: 100%; border-radius: 16px; padding: 28px; margin-bottom: 16px;
    background: linear-gradient(135deg, rgba(204,0,0,0.15), rgba(255,215,0,0.08));
    border: 1px solid rgba(255,215,0,0.12); text-align: center;
  }
  .gallery-team-card .team-emoji { font-size: 36px; margin-bottom: 10px; }
  .gallery-team-card .team-text { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.7; }
  .gallery-team-card .team-text strong { color: #ffd700; font-weight: 600; }

  .highlight-section-label {
    font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
    color: rgba(255,255,255,0.25); margin: 20px 0 12px 0; font-weight: 600;
  }
  .highlight-section-label:first-child { margin-top: 0; }
  .highlight-media-card {
    position: relative; width: 100%; border-radius: 16px; overflow: hidden;
    margin-bottom: 14px; border: 1px solid rgba(255,255,255,0.06);
    background: rgba(10,0,0,0.5); cursor: pointer;
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, border-color 0.3s;
  }
  .highlight-media-card:hover {
    transform: scale(1.015); box-shadow: 0 8px 30px rgba(204,0,0,0.12);
    border-color: rgba(204,0,0,0.25);
  }
  .highlight-media-card video, .highlight-media-card img {
    width: 100%; display: block; border-radius: 16px 16px 0 0; object-fit: cover;
  }
  .highlight-media-card img { height: 200px; }
  .highlight-media-card video { max-height: 260px; background: #000; }
  .highlight-media-info {
    padding: 12px 16px; display: flex; align-items: center; gap: 10px;
  }
  .highlight-media-info .media-type-badge {
    flex-shrink: 0; padding: 3px 8px; border-radius: 6px; font-size: 9px;
    font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
  }
  .media-type-badge.video-badge {
    background: rgba(204,0,0,0.25); border: 1px solid rgba(204,0,0,0.35); color: #ff4444;
  }
  .media-type-badge.photo-badge {
    background: rgba(255,215,0,0.15); border: 1px solid rgba(255,215,0,0.25); color: rgba(255,215,0,0.8);
  }
  .highlight-media-info .media-caption {
    font-size: 12px; color: rgba(255,255,255,0.6); font-weight: 500; line-height: 1.4; flex: 1;
  }
  .highlight-play-overlay {
    position: absolute; top: 0; left: 0; right: 0; height: 200px;
    display: flex; align-items: center; justify-content: center; pointer-events: none;
  }
  .highlight-play-btn {
    width: 50px; height: 50px; border-radius: 50%; background: rgba(204,0,0,0.8);
    border: 2px solid rgba(255,255,255,0.3); display: flex; align-items: center;
    justify-content: center; backdrop-filter: blur(8px); transition: transform 0.2s, background 0.2s;
  }
  .highlight-media-card:hover .highlight-play-btn { transform: scale(1.1); background: rgba(204,0,0,1); }
  .highlight-play-btn::after {
    content: ''; display: block; width: 0; height: 0; border-style: solid;
    border-width: 9px 0 9px 16px; border-color: transparent transparent transparent #fff; margin-left: 3px;
  }
  .highlight-empty-slot {
    width: 100%; height: 180px; border-radius: 16px; border: 2px dashed rgba(255,255,255,0.08);
    margin-bottom: 14px; display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 8px; transition: border-color 0.3s, background 0.3s; cursor: default;
  }
  .highlight-empty-slot:hover { border-color: rgba(204,0,0,0.25); background: rgba(204,0,0,0.04); }
  .highlight-empty-slot .slot-icon { font-size: 28px; opacity: 0.3; }
  .highlight-empty-slot .slot-text { font-size: 11px; color: rgba(255,255,255,0.2); letter-spacing: 1px; }
  .highlight-empty-slot .slot-hint {
    font-size: 9px; color: rgba(255,255,255,0.12); letter-spacing: 0.5px;
    max-width: 200px; text-align: center; line-height: 1.4;
  }

  #media-lightbox {
    position: fixed; inset: 0; z-index: 300; display: none; align-items: center;
    justify-content: center; background: rgba(0,0,0,0.92); backdrop-filter: blur(20px);
    opacity: 0; transition: opacity 0.35s ease;
  }
  #media-lightbox.active { display: flex; opacity: 1; }
  #media-lightbox img, #media-lightbox video {
    max-width: 90vw; max-height: 85vh; border-radius: 12px; box-shadow: 0 20px 80px rgba(0,0,0,0.6);
  }
  #media-lightbox video { background: #000; }
  #lightbox-close {
    position: absolute; top: 20px; right: 20px; width: 40px; height: 40px;
    border-radius: 50%; border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; transition: all 0.2s; z-index: 5;
  }
  #lightbox-close:hover { background: rgba(255,255,255,0.2); color: #fff; }
  #lightbox-caption {
    position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
    font-size: 13px; color: rgba(255,255,255,0.5); letter-spacing: 1px;
    text-align: center; max-width: 80vw;
  }
  /* ── CAROUSEL ── */
  #carousel-overlay {
    position: fixed; inset: 0; z-index: 400; background: rgba(0,0,0,0.92);
    display: none; flex-direction: column; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.35s;
  }
  #carousel-overlay.active { display: flex; opacity: 1; }
  #carousel-track {
    position: relative; width: 90vw; max-width: 800px;
    display: flex; align-items: center; justify-content: center;
  }
  #carousel-img {
    width: 100%; max-height: 72vh; object-fit: contain;
    border-radius: 14px; box-shadow: 0 24px 80px rgba(0,0,0,0.7);
    transition: opacity 0.25s;
  }
  .carousel-arrow {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 46px; height: 46px; border-radius: 50%; border: none; cursor: pointer;
    background: rgba(204,16,46,0.75); color: #fff; font-size: 20px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, transform 0.2s; z-index: 2; flex-shrink: 0;
  }
  .carousel-arrow:hover { background: rgba(204,16,46,1); transform: translateY(-50%) scale(1.08); }
  #carousel-prev { left: -60px; }
  #carousel-next { right: -60px; }
  .carousel-arrow.hidden { opacity: 0; pointer-events: none; }
  #carousel-footer {
    margin-top: 20px; text-align: center;
  }
  #carousel-caption {
    font-size: 14px; color: rgba(255,255,255,0.65); letter-spacing: 0.8px;
    margin-bottom: 10px;
  }
  #carousel-dots { display: flex; gap: 8px; justify-content: center; }
  .carousel-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: rgba(255,255,255,0.25); cursor: pointer; transition: background 0.2s, transform 0.2s;
  }
  .carousel-dot.active { background: #cc102e; transform: scale(1.3); }
  #carousel-close {
    position: absolute; top: 20px; right: 20px; width: 40px; height: 40px;
    border-radius: 50%; border: none; cursor: pointer;
    background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7);
    font-size: 18px; display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; z-index: 5;
  }
  #carousel-close:hover { background: rgba(255,255,255,0.2); color: #fff; }
  #carousel-counter {
    font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 2px;
    margin-top: 6px; text-transform: uppercase;
  }
  #carousel-tabs {
    display: flex; gap: 8px; margin-bottom: 20px;
  }
  .carousel-tab {
    padding: 8px 22px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.15);
    background: transparent; color: rgba(255,255,255,0.45); font-size: 13px;
    font-family: 'Inter', sans-serif; font-weight: 600; cursor: pointer;
    letter-spacing: 0.5px; transition: all 0.2s;
  }
  .carousel-tab:hover { color: rgba(255,255,255,0.75); border-color: rgba(255,255,255,0.3); }
  .carousel-tab.active { background: #cc102e; border-color: #cc102e; color: #fff; }
  #carousel-media {
    width: 100%; display: flex; align-items: center; justify-content: center;
    transition: opacity 0.25s; min-height: 200px;
  }

  #modal-overlay {
    position: fixed; inset: 0; z-index: 100; display: none; align-items: center;
    justify-content: center; background: rgba(10,2,2,0.6);
    backdrop-filter: blur(4px); opacity: 0; transition: opacity 0.4s ease;
  }
  #modal-overlay.active { display: flex; opacity: 1; }
  #modal-card {
    max-width: 460px; width: 90%; padding: 36px;
    background: rgba(40,0,0,0.6); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 20px; backdrop-filter: blur(20px) saturate(1.5);
    -webkit-backdrop-filter: blur(20px) saturate(1.5);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
    transform: translateY(20px) scale(0.95);
    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); color: #fff;
  }
  #modal-overlay.active #modal-card { transform: translateY(0) scale(1); }
  #modal-player-image-wrap {
    width: 90px; height: 90px; border-radius: 12px; margin: 0 auto 18px auto;
    border: 2px solid rgba(204,0,0,0.35); overflow: hidden; background: rgba(255,255,255,0.04);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 20px rgba(204,0,0,0.12), inset 0 0 20px rgba(0,0,0,0.25); position: relative;
  }
  #modal-player-image-wrap img {
    width: 100%; height: 100%; object-fit: cover; object-position: top; border-radius: 12px; display: block;
  }
  #modal-player-image-wrap .placeholder-icon { font-size: 32px; opacity: 0.18; color: #fff; user-select: none; }
  #modal-player-image-wrap .placeholder-ring {
    position: absolute; inset: 3px; border-radius: 10px; border: 1.5px dashed rgba(255,255,255,0.08);
  }
  #modal-card .modal-badge {
    display: inline-block; padding: 4px 12px; border-radius: 100px;
    background: rgba(204,0,0,0.3); border: 1px solid rgba(204,0,0,0.4);
    font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
    color: #ff4444; margin-bottom: 16px; font-weight: 600;
  }
  #modal-card h3 {
    font-size: 24px; font-weight: 700; margin-bottom: 6px;
    background: linear-gradient(135deg, #ffffff, #ffcccc);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  #modal-card .modal-number {
    font-size: 12px; color: rgba(255,255,255,0.35); letter-spacing: 2px; margin-bottom: 18px;
  }
  #modal-card .modal-divider {
    width: 40px; height: 2px;
    background: linear-gradient(90deg, #cc0000, #ffd700); border-radius: 2px; margin-bottom: 18px;
  }
  #modal-card .modal-note { font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.75); }
  #modal-card .modal-footer {
    margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06);
    font-size: 10px; color: rgba(255,255,255,0.25); letter-spacing: 2px; text-transform: uppercase; text-align: center;
  }
  #modal-close {
    position: absolute; top: 14px; right: 14px; width: 30px; height: 30px;
    border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.5); cursor: pointer; display: flex; align-items: center;
    justify-content: center; font-size: 14px; transition: all 0.2s;
  }
  #modal-close:hover { background: rgba(255,255,255,0.15); color: #fff; }

  /* ── MOBILE OVERRIDES ── */
  @media (max-width: 640px) {
    #hero-header {
      top: 16px; width: 92vw;
    }
    #hero-header h1 {
      font-size: 13px; letter-spacing: 4px;
      color: rgba(255,255,255,0.85);
      text-shadow: 0 1px 6px rgba(0,0,0,0.8);
    }
    #hero-header h2 {
      font-size: 34px; letter-spacing: 3px;
      filter: drop-shadow(0 2px 8px rgba(0,0,0,0.6));
    }
    #hero-header p {
      font-size: 13px; color: rgba(255,255,255,0.8);
      letter-spacing: 0.5px; text-transform: none;
      text-shadow: 0 1px 6px rgba(0,0,0,0.9);
      line-height: 1.5;
    }
    #instructions {
      bottom: 32px; width: 88vw;
    }
    #instructions span {
      font-size: 13px; letter-spacing: 0.5px; color: rgba(255,255,255,0.75);
      padding: 10px 18px; line-height: 1.5;
    }
    #audio-toggle {
      bottom: 32px; right: 16px; width: 44px; height: 44px; font-size: 18px;
    }
    #modal-card {
      width: 94%; padding: 24px 20px; border-radius: 16px;
      max-height: 88vh; overflow-y: auto;
    }
    #modal-card h3 { font-size: 22px; }
    #modal-card .modal-note {
      font-size: 15px !important; line-height: 1.75 !important;
      color: rgba(255,255,255,0.95) !important;
    }
    #modal-card .modal-note span {
      font-size: 15px !important; line-height: 1.75 !important;
      color: rgba(255,255,255,0.95) !important;
    }
    #modal-card .modal-badge { font-size: 10px; }
    #gallery-panel { width: 100vw; max-width: 100vw; }
    #carousel-prev { left: -46px; }
    #carousel-next { right: -46px; }
    .carousel-arrow { width: 36px; height: 36px; font-size: 16px; }
  }
`;
document.head.appendChild(style);

// ─── HEADER ───
export const header = document.createElement('div');
header.id = 'hero-header';
const h1 = document.createElement('h1'); h1.textContent = 'Fairfield University';
const h2 = document.createElement('h2'); h2.textContent = 'STAGS TENNIS';
const p1 = document.createElement('p');
p1.style.marginBottom = '6px';
p1.innerHTML = 'More than a season, a permanent memory.<br>An appreciation project for the 2025–2026 Fairfield Women\'s Tennis Team.';
const p2 = document.createElement('p');
p2.style.cssText = 'font-size:10px;letter-spacing:2px;text-transform:none;font-style:italic;margin-top:4px;background:linear-gradient(135deg,#ffffff,#ffd4d4,#ffffff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;';
p2.textContent = "Project by Sarah Liu '26";
header.append(h1, h2, p1, p2);
document.body.appendChild(header);

// ─── INSTRUCTIONS ───
export const instDiv = document.createElement('div');
instDiv.id = 'instructions';
const instrSpan = document.createElement('span');
instrSpan.textContent = "Click a tennis ball, trophy, jacket, racket, camera, ring, or creator's plaque to explore";
instDiv.appendChild(instrSpan);
document.body.appendChild(instDiv);


// ─── GALLERY PANEL ───
const memoriesBtn = document.createElement('button');
memoriesBtn.id = 'memories-btn';
memoriesBtn.textContent = '📸 Memories';
document.body.appendChild(memoriesBtn);

export const galleryPanel = document.createElement('div');
galleryPanel.id = 'gallery-panel';

const galleryCloseBtn = document.createElement('button');
galleryCloseBtn.id = 'gallery-close';
galleryCloseBtn.textContent = '✕';

const galleryHeaderDiv = document.createElement('div');
galleryHeaderDiv.id = 'gallery-header';
const galleryLabelEl = document.createElement('div'); galleryLabelEl.className = 'gallery-label'; galleryLabelEl.textContent = 'Highlight Reel';
const galleryTitleEl = document.createElement('div'); galleryTitleEl.className = 'gallery-title'; galleryTitleEl.textContent = '🎬 Season Highlights';
const gallerySubtitleEl = document.createElement('div'); gallerySubtitleEl.className = 'gallery-subtitle'; gallerySubtitleEl.textContent = 'Videos · Photos · Moments · 2025–2026';
const galleryDividerEl = document.createElement('div'); galleryDividerEl.className = 'gallery-divider';
galleryHeaderDiv.append(galleryLabelEl, galleryTitleEl, gallerySubtitleEl, galleryDividerEl);

const galleryScrollDiv = document.createElement('div');
galleryScrollDiv.id = 'gallery-scroll';

galleryPanel.append(galleryCloseBtn, galleryHeaderDiv, galleryScrollDiv);
document.body.appendChild(galleryPanel);

let galleryOpen = false;
export function toggleGallery() {
  galleryOpen = !galleryOpen;
  galleryPanel.classList.toggle('open', galleryOpen);
}
memoriesBtn.addEventListener('click', toggleGallery);
galleryCloseBtn.addEventListener('click', () => { galleryOpen = false; galleryPanel.classList.remove('open'); });

// ─── LIGHTBOX ───
const lightbox = document.createElement('div');
lightbox.id = 'media-lightbox';
const lbClose = document.createElement('button'); lbClose.id = 'lightbox-close'; lbClose.textContent = '✕';
const lightboxContent = document.createElement('div'); lightboxContent.id = 'lightbox-content';
const lightboxCaption = document.createElement('div'); lightboxCaption.id = 'lightbox-caption';
lightbox.append(lbClose, lightboxContent, lightboxCaption);
document.body.appendChild(lightbox);

function openLightbox(media) {
  lightboxContent.textContent = '';
  if (media.type === 'video') {
    const vid = document.createElement('video');
    vid.src = media.src; vid.controls = true; vid.autoplay = true; vid.playsInline = true;
    vid.style.cssText = 'max-width:90vw;max-height:85vh;border-radius:12px;';
    lightboxContent.appendChild(vid);
  } else {
    const img = document.createElement('img');
    img.src = media.src; img.alt = media.caption;
    img.style.cssText = 'max-width:90vw;max-height:85vh;border-radius:12px;';
    lightboxContent.appendChild(img);
  }
  lightboxCaption.textContent = media.caption;
  lightbox.classList.add('active');
}
function closeLightbox() {
  lightbox.classList.remove('active');
  setTimeout(() => {
    const vid = lightboxContent.querySelector('video');
    if (vid) vid.pause();
    lightboxContent.textContent = '';
  }, 350);
}
lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

// ─── GALLERY CONTENT ───
function makeEl(tag, props = {}, text = '') {
  const el = document.createElement(tag);
  Object.assign(el, props);
  if (text) el.textContent = text;
  return el;
}

// ─── CAROUSEL ───
const carouselOverlay = document.createElement('div');
carouselOverlay.id = 'carousel-overlay';

const carouselCloseBtn = document.createElement('button');
carouselCloseBtn.id = 'carousel-close';
carouselCloseBtn.textContent = '✕';

// Tabs
const carouselTabs = makeEl('div', { id: 'carousel-tabs' });
const tabPhotos = makeEl('button', { className: 'carousel-tab active' }, '📸 Photos');
const tabVideos = makeEl('button', { className: 'carousel-tab' }, '🎬 Videos');
carouselTabs.append(tabPhotos, tabVideos);

const carouselTrack = document.createElement('div');
carouselTrack.id = 'carousel-track';

const carouselPrev = document.createElement('button');
carouselPrev.id = 'carousel-prev';
carouselPrev.className = 'carousel-arrow';
carouselPrev.textContent = '‹';

const carouselMedia = makeEl('div', { id: 'carousel-media' });

const carouselNext = document.createElement('button');
carouselNext.id = 'carousel-next';
carouselNext.className = 'carousel-arrow';
carouselNext.textContent = '›';

carouselTrack.append(carouselPrev, carouselMedia, carouselNext);

const carouselFooter = makeEl('div', { id: 'carousel-footer' });
const carouselCaption = makeEl('div', { id: 'carousel-caption' });
const carouselDots = makeEl('div', { id: 'carousel-dots' });
const carouselCounter = makeEl('div', { id: 'carousel-counter' });
carouselFooter.append(carouselCaption, carouselDots, carouselCounter);

carouselOverlay.append(carouselCloseBtn, carouselTabs, carouselTrack, carouselFooter);
document.body.appendChild(carouselOverlay);

const photos = carouselPhotos.filter(p => p.src);
const videos = carouselVideos.filter(v => v.src);
let carouselMode = 'photos'; // 'photos' | 'videos'
let carouselIndex = 0;

function currentItems() { return carouselMode === 'photos' ? photos : videos; }

function renderCarousel() {
  const items = currentItems();
  if (!items.length) {
    carouselMedia.textContent = '';
    const empty = makeEl('div', { style: 'color:rgba(255,255,255,0.4);font-size:14px;text-align:center;padding:40px 0;' },
      carouselMode === 'photos' ? 'No photos yet' : 'No videos yet');
    carouselMedia.appendChild(empty);
    carouselCaption.textContent = '';
    carouselCounter.textContent = '';
    carouselDots.textContent = '';
    carouselPrev.classList.add('hidden');
    carouselNext.classList.add('hidden');
    return;
  }
  const item = items[carouselIndex];
  carouselMedia.style.opacity = '0';
  setTimeout(() => {
    carouselMedia.textContent = '';
    if (carouselMode === 'videos') {
      const vid = document.createElement('video');
      vid.src = item.src; vid.controls = true; vid.playsInline = true;
      vid.style.cssText = 'width:100%;max-height:65vh;border-radius:14px;background:#000;box-shadow:0 24px 80px rgba(0,0,0,0.7);';
      carouselMedia.appendChild(vid);
    } else {
      const img = document.createElement('img');
      img.src = item.src; img.alt = item.caption;
      img.style.cssText = 'width:100%;max-height:65vh;object-fit:contain;border-radius:14px;box-shadow:0 24px 80px rgba(0,0,0,0.7);';
      carouselMedia.appendChild(img);
    }
    carouselCaption.textContent = item.caption;
    carouselCounter.textContent = `${carouselIndex + 1} / ${items.length}`;
    carouselMedia.style.opacity = '1';
  }, 150);
  carouselPrev.classList.toggle('hidden', items.length <= 1);
  carouselNext.classList.toggle('hidden', items.length <= 1);
  carouselDots.textContent = '';
  items.forEach((_, i) => {
    const dot = makeEl('div', { className: 'carousel-dot' + (i === carouselIndex ? ' active' : '') });
    dot.addEventListener('click', () => { carouselIndex = i; renderCarousel(); });
    carouselDots.appendChild(dot);
  });
}

function switchTab(mode) {
  carouselMode = mode;
  carouselIndex = 0;
  tabPhotos.classList.toggle('active', mode === 'photos');
  tabVideos.classList.toggle('active', mode === 'videos');
  // pause any playing video when switching
  const vid = carouselMedia.querySelector('video');
  if (vid) vid.pause();
  renderCarousel();
}

tabPhotos.addEventListener('click', () => switchTab('photos'));
tabVideos.addEventListener('click', () => switchTab('videos'));

export function openCarousel() {
  carouselMode = 'photos';
  carouselIndex = 0;
  tabPhotos.classList.add('active');
  tabVideos.classList.remove('active');
  renderCarousel();
  carouselOverlay.classList.add('active');
}

function closeCarousel() {
  const vid = carouselMedia.querySelector('video');
  if (vid) vid.pause();
  carouselOverlay.classList.remove('active');
}

carouselCloseBtn.addEventListener('click', closeCarousel);
carouselOverlay.addEventListener('click', (e) => { if (e.target === carouselOverlay) closeCarousel(); });
carouselPrev.addEventListener('click', () => {
  const items = currentItems();
  carouselIndex = (carouselIndex - 1 + items.length) % items.length;
  renderCarousel();
});
carouselNext.addEventListener('click', () => {
  const items = currentItems();
  carouselIndex = (carouselIndex + 1) % items.length;
  renderCarousel();
});
document.addEventListener('keydown', (e) => {
  if (!carouselOverlay.classList.contains('active')) return;
  const items = currentItems();
  if (e.key === 'ArrowLeft')  { carouselIndex = (carouselIndex - 1 + items.length) % items.length; renderCarousel(); }
  if (e.key === 'ArrowRight') { carouselIndex = (carouselIndex + 1) % items.length; renderCarousel(); }
  if (e.key === 'Escape') closeCarousel();
});

// ─── MODAL ───
export const modalOverlay = makeEl('div', { id: 'modal-overlay' });
const modalCard = makeEl('div', { id: 'modal-card' });
modalCard.style.position = 'relative';

export const modalCloseBtn = makeEl('button', { id: 'modal-close' }, '✕');
export const modalImageWrap = makeEl('div', { id: 'modal-player-image-wrap' });
modalImageWrap.style.display = 'none';
const placeholderRing = makeEl('div', { className: 'placeholder-ring' });
const placeholderIcon = makeEl('span', { className: 'placeholder-icon' }, '👤');
modalImageWrap.append(placeholderRing, placeholderIcon);

export const modalBadge  = makeEl('div',  { id: 'modal-badge',  className: 'modal-badge' },  'PLAYER');
export const modalTitle  = makeEl('h3',   { id: 'modal-title' },  'Name');
export const modalNumber = makeEl('div',  { id: 'modal-number', className: 'modal-number' }, '#0');
const modalDivider = makeEl('div', { className: 'modal-divider' });
export const modalNote   = makeEl('p',    { id: 'modal-note',   className: 'modal-note' },   '');
const modalFooter = makeEl('div', { className: 'modal-footer' }, 'FAIRFIELD STAGS TENNIS · GO STAGS 🦌');

modalCard.append(modalCloseBtn, modalImageWrap, modalBadge, modalTitle, modalNumber, modalDivider, modalNote, modalFooter);
modalOverlay.appendChild(modalCard);
document.body.appendChild(modalOverlay);
