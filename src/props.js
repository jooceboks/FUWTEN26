import * as THREE from 'three';
import { scene, isMobile } from './scene.js';

const goldMat = () => new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.15, emissive: 0xaa7700, emissiveIntensity: 0.15 });
const stdMat  = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, ...opts });

// Helper: create mesh, set position, return it
function m(geo, mat, x = 0, y = 0, z = 0, name = '') {
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  if (name) mesh.name = name;
  return mesh;
}

// ─── TROPHY ───
export function buildTrophy(clickableObjects) {
  const group = new THREE.Group(); group.name = 'trophyGroup';
  const gm = goldMat();

  group.add(m(new THREE.BoxGeometry(1.4, 0.3, 1.4), gm, 0, 0.15, 0));
  group.add(m(new THREE.BoxGeometry(1.1, 0.2, 1.1), gm, 0, 0.4,  0));
  group.add(m(new THREE.CylinderGeometry(0.15, 0.2, 1.2, 16), gm, 0, 1.1, 0));

  const cup = new THREE.Mesh(new THREE.LatheGeometry([
    new THREE.Vector2(0.1,0), new THREE.Vector2(0.5,0.3), new THREE.Vector2(0.65,0.8),
    new THREE.Vector2(0.7,1.2), new THREE.Vector2(0.68,1.2), new THREE.Vector2(0.62,0.85),
    new THREE.Vector2(0.47,0.35), new THREE.Vector2(0.08,0.05),
  ], 32), gm);
  cup.position.y = 1.7; group.add(cup);

  for (const side of [-1, 1]) {
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 12, 24, Math.PI), gm);
    handle.position.set(side * 0.65, 2.4, 0);
    handle.rotation.z = side * Math.PI / 2; handle.rotation.y = Math.PI / 2;
    group.add(handle);
  }

  const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 0),
    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffd700, emissiveIntensity: 0.5, metalness: 0.9, roughness: 0.1 }));
  star.name = 'trophyStar'; star.position.y = 3.15; group.add(star);

  const pc = document.createElement('canvas'); pc.width = 256; pc.height = 64;
  const pCtx = pc.getContext('2d');
  pCtx.fillStyle = '#1a0505'; pCtx.fillRect(0, 0, 256, 64);
  pCtx.fillStyle = '#ffd700'; pCtx.font = 'bold 20px Inter,Arial,sans-serif'; pCtx.textAlign = 'center';
  pCtx.fillText('CHAMPIONS', 128, 25); pCtx.fillText('TROPHY', 128, 50);
  const plate = m(new THREE.PlaneGeometry(0.8, 0.22),
    new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(pc), metalness: 0.3, roughness: 0.5 }), 0, 0.45, 0.56);
  group.add(plate);

  group.position.set(-10, 0, -3);
  group.userData = { type: 'trophy', title: '🏆 Conference Championship Trophy',
    note: 'This golden trophy represents the blood, sweat, and tears of an entire season. Every rally, every match point, every early morning practice led to this moment. Fairfield Stags Tennis — Conference Champions!' };
  group.traverse(c => { if (c.isMesh) { c.userData = group.userData; clickableObjects.push(c); } });

  const gl = new THREE.PointLight(0xffd700, 0.8, 8);
  gl.position.set(-10, 3, -3); scene.add(gl);
  scene.add(group);
  return group;
}

// ─── VARSITY JACKET ───
export function buildJacket(clickableObjects) {
  const group = new THREE.Group(); group.name = 'jacketGroup';
  const red   = stdMat(0xcc0000, { roughness: 0.7, metalness: 0.05 });
  const white = stdMat(0xf5f5f0, { roughness: 0.6, metalness: 0.05 });

  const torso = m(new THREE.BoxGeometry(1.8, 2.2, 1.0), red, 0, 1.8, 0, 'jacketTorso');
  group.add(torso);
  group.add(m(new THREE.BoxGeometry(1.4, 0.35, 0.5), white, 0, 3.05, 0.15));

  for (const side of [-1, 1]) {
    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.3, 2.0, 12), white);
    sleeve.position.set(side * 1.2, 2.0, 0); sleeve.rotation.z = side * 0.35; group.add(sleeve);
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.2, 12), red);
    cuff.position.set(side * 1.55, 1.05, 0); cuff.rotation.z = side * 0.35; group.add(cuff);
  }
  group.add(m(new THREE.BoxGeometry(1.8, 0.2, 1.0), stdMat(0xcc0000, { roughness: 0.5, metalness: 0.1 }), 0, 0.8, 0));

  const pc = document.createElement('canvas'); pc.width = 128; pc.height = 128;
  const pCtx = pc.getContext('2d');
  pCtx.fillStyle = '#cc0000'; pCtx.fillRect(0, 0, 128, 128);
  pCtx.fillStyle = '#ffffff'; pCtx.font = 'bold 90px serif'; pCtx.textAlign = 'center'; pCtx.textBaseline = 'middle';
  pCtx.fillText('F', 64, 68);
  const patch = m(new THREE.PlaneGeometry(0.6, 0.6),
    new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(pc), roughness: 0.5 }), 0, 2.0, 0.51);
  group.add(patch);

  group.add(m(new THREE.CylinderGeometry(0.6, 0.7, 0.15, 24), stdMat(0x333333, { metalness: 0.8, roughness: 0.2 }), 0, 0.075, 0));
  group.add(m(new THREE.CylinderGeometry(0.06, 0.06, 0.7, 12), stdMat(0x555555, { metalness: 0.8, roughness: 0.2 }), 0, 0.5, 0));

  group.position.set(-10, 0, 3);
  group.userData = { type: 'jacket', title: '🧥 Fairfield Stags Varsity Jacket',
    note: 'This letterman jacket is more than fabric and thread — it\'s a symbol of belonging, of sacrifice, of the bond forged between teammates who fought side by side. Wear it with pride.' };
  group.traverse(c => { if (c.isMesh) { c.userData = group.userData; clickableObjects.push(c); } });

  const jl = new THREE.PointLight(0xcc0000, 0.5, 8);
  jl.position.set(-10, 3, 3); scene.add(jl);
  scene.add(group);
  return group;
}

// ─── TENNIS RACKET ───
export function buildRacket(clickableObjects) {
  const group = new THREE.Group(); group.name = 'racketGroup';
  const frameMat  = stdMat(0xcc0000, { metalness: 0.7, roughness: 0.2, emissive: 0xcc0000, emissiveIntensity: 0.08 });
  const whiteMat  = stdMat(0xffffff, { metalness: 0.3, roughness: 0.4 });
  const stringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 });
  const gripMat   = stdMat(0x1a0808, { roughness: 0.9, metalness: 0 });
  const silverMat = stdMat(0xaaaaaa, { metalness: 0.9, roughness: 0.1 });

  const headOuter = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.1, 16, 48), frameMat);
  headOuter.name = 'racketHead'; headOuter.position.y = 3.8; headOuter.scale.set(0.75, 1, 1); group.add(headOuter);

  const headFill = new THREE.Mesh(new THREE.CircleGeometry(1.05, 48),
    new THREE.MeshPhysicalMaterial({ color: 0x220808, transparent: true, opacity: 0.08, side: THREE.DoubleSide }));
  headFill.position.y = 3.8; headFill.scale.set(0.75, 1, 1); group.add(headFill);

  for (let i = -6; i <= 6; i++) {
    const x = i * 0.1;
    const maxH = Math.sqrt(Math.max(0, 1.05 * 1.05 - (x / 0.75) ** 2));
    if (maxH < 0.05) continue;
    const s = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, maxH * 2, 4), stringMat);
    s.position.set(x, 3.8, 0); group.add(s);
  }
  for (let i = -9; i <= 9; i++) {
    const y = i * 0.1;
    const maxW = Math.sqrt(Math.max(0, 1.05 * 1.05 - y * y)) * 0.75;
    if (maxW < 0.05) continue;
    const s = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, maxW * 2, 4), stringMat);
    s.position.set(0, 3.8 + y, 0); s.rotation.z = Math.PI / 2; group.add(s);
  }

  [[-.2, 2.5, 0.25], [.2, 2.5, -0.25]].forEach(([x, y, rz]) => {
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.7, 8), frameMat);
    t.position.set(x, y, 0); t.rotation.z = rz; group.add(t);
  });
  group.add(m(new THREE.CylinderGeometry(0.07, 0.08, 1.6, 12), frameMat, 0, 1.4, 0));
  group.add(m(new THREE.CylinderGeometry(0.09, 0.1,  1.0, 12), gripMat,  0, 0.9, 0));
  group.add(m(new THREE.CylinderGeometry(0.12, 0.12, 0.06, 16), whiteMat, 0, 0.37, 0));

  group.position.set(10, 1.2, 3); group.rotation.z = 0.15; group.rotation.y = -0.3;
  group.userData = { type: 'racket', title: '🎾 The Stags Racket',
    note: 'This racket represents every swing, every serve, every rally that defined our season. Every string vibrates with the energy of 12 warriors who gave everything for Fairfield. Swing with pride, Stags!' };
  group.traverse(c => { if (c.isMesh) { c.userData = group.userData; clickableObjects.push(c); } });

  const rl = new THREE.PointLight(0xff4466, 0.5, 8);
  rl.position.set(10, 4, 3); scene.add(rl);
  scene.add(group);
  return group;
}

// ─── 3D CAMERA ───
export function build3DCamera(clickableObjects) {
  const group = new THREE.Group(); group.name = 'cameraGroup';
  const bodyMat   = stdMat(0x222222, { metalness: 0.85, roughness: 0.15 });
  const darkMat   = stdMat(0x111111, { metalness: 0.9,  roughness: 0.1  });
  const silverMat = stdMat(0xaaaaaa, { metalness: 0.9,  roughness: 0.1  });
  const accentMat = stdMat(0xcc0000, { metalness: 0.5,  roughness: 0.3, emissive: 0xcc0000, emissiveIntensity: 0.3 });
  const lensMat   = new THREE.MeshStandardMaterial({ color: 0x112244, metalness: 0.6, roughness: 0.05, transparent: true, opacity: 0.45 });

  group.add(new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.3, 1.1), bodyMat));
  group.add(m(new THREE.BoxGeometry(0.8, 0.4, 0.9), bodyMat, 0, 0.85, 0));
  group.add(m(new THREE.BoxGeometry(0.35, 0.28, 0.2), darkMat, 0, 0.85, -0.55));

  const lb = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.5, 0.8, 32), darkMat);
  lb.rotation.x = Math.PI / 2; lb.position.set(0, 0, 0.95); group.add(lb);

  const lg = new THREE.Mesh(new THREE.CircleGeometry(0.42, 32), lensMat);
  lg.position.set(0, 0, 1.36); group.add(lg);
  group.add(m(new THREE.TorusGeometry(0.42, 0.04, 12, 32), silverMat, 0, 0, 1.36));

  const fr = new THREE.Mesh(new THREE.TorusGeometry(0.53, 0.06, 12, 32), silverMat);
  fr.rotation.x = Math.PI / 2; fr.position.set(0, 0, 0.7); group.add(fr);
  group.add(m(new THREE.BoxGeometry(2.02, 0.06, 1.12), accentMat, 0, 0.35, 0));

  const redDot = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.8 }));
  redDot.name = 'cameraRedDot'; redDot.position.set(0.7, 0.65, 0.56); group.add(redDot);

  [[0.6, 1.09, 0.1, 0.1, 0.08], [-0.6, 1.09, 0.1, 0.15, 0.12]].forEach(([x, y, z, r, h]) => {
    group.add(m(new THREE.CylinderGeometry(r, r, h, 24), silverMat, x, y, z));
  });

  const sc = document.createElement('canvas'); sc.width = 280; sc.height = 180;
  const sCtx = sc.getContext('2d');
  sCtx.fillStyle = '#0a0a12'; sCtx.fillRect(0, 0, 280, 180);
  sCtx.fillStyle = 'rgba(204,0,0,0.4)'; sCtx.font = 'bold 16px Inter,Arial,sans-serif'; sCtx.textAlign = 'center';
  sCtx.fillText('HIGHLIGHT REEL', 140, 80);
  sCtx.fillStyle = 'rgba(255,255,255,0.25)'; sCtx.font = '10px Inter,Arial,sans-serif';
  sCtx.fillText('TAP TO VIEW', 140, 105);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.9),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc) }));
  screen.position.set(0, 0, -0.56); screen.rotation.y = Math.PI; group.add(screen);

  group.position.set(10, 1.5, -3);
  const d = new THREE.Vector3(0,0,0).sub(new THREE.Vector3(10, 1.5, -3)).normalize();
  group.rotation.y = Math.atan2(d.x, d.z);
  group.scale.setScalar(0.9);
  group.userData = { type: 'camera3d', title: '🎬 Highlight Reel', note: 'gallery' };
  group.traverse(c => { if (c.isMesh) { c.userData = group.userData; clickableObjects.push(c); } });

  const cl = new THREE.PointLight(0x4488ff, 0.4, 8);
  cl.position.set(10, 3.5, -3); scene.add(cl);
  scene.add(group);
  return group;
}

// ─── CHAMPIONSHIP RING ───
export function buildRing(clickableObjects) {
  const group = new THREE.Group(); group.name = 'ringGroup';
  const silverMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, metalness: 0.96, roughness: 0.06, emissive: 0x888888, emissiveIntensity: 0.05 });

  // Simple torus hoop
  const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.07, 20, 80), silverMat);
  group.add(hoop);

  // Sparkle gem on top of the hoop
  const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.13, 0),
    new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.0, emissive: 0xffffff, emissiveIntensity: 0.8, transparent: true, opacity: 0.92 }));
  gem.name = 'ringGem';
  gem.position.set(0, 0.38, 0);
  group.add(gem);

  group.scale.setScalar(0.65);
  group.position.set(-8.5, 1.5, 1.2);
  group.userData = { type: 'ring', title: 'Assistant Coach', name: 'Daniella Medvedeva',
    note: 'Dani, you\'ve done so much for the girls and gone truly above and beyond for this team. I truly appreciate your 2 years here with us. You\'ve done the absolute most for every one of us and we\'re so lucky to have had you. You really are the goat for everything you\'ve poured into this program — thank you for being the best coach and mentor we could\'ve asked for!' };
  group.traverse(c => { if (c.isMesh) { c.userData = group.userData; clickableObjects.push(c); } });

  const rl = new THREE.PointLight(0xbbccff, 0.8, 8);
  rl.position.set(-10, 4, 6.5); scene.add(rl);
  scene.add(group);
  return group;
}

// ─── CREATOR'S PLAQUE ───
export function buildPlaque(clickableObjects) {
  const group = new THREE.Group(); group.name = 'creatorsPlaqueGroup';

  const board = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 0.08),
    isMobile
      ? new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.3, transparent: true, opacity: 0.55, emissive: 0xcc0000, emissiveIntensity: 0.06 })
      : new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.55, clearcoat: 1, clearcoatRoughness: 0.05, emissive: 0xcc0000, emissiveIntensity: 0.06 }));
  board.position.y = 1.4; group.add(board);

  const clipMat = stdMat(0xffd700, { metalness: 0.85, roughness: 0.15, emissive: 0xaa7700, emissiveIntensity: 0.1 });
  group.add(m(new THREE.BoxGeometry(0.6, 0.15, 0.14), clipMat, 0, 2.55, 0));
  group.add(m(new THREE.BoxGeometry(0.4, 0.08, 0.16), clipMat, 0, 2.64, 0));

  const pc = document.createElement('canvas'); pc.width = 512; pc.height = 700;
  const ptCtx = pc.getContext('2d');
  ptCtx.clearRect(0, 0, 512, 700);
  ptCtx.fillStyle = 'rgba(255,215,0,0.9)'; ptCtx.font = '700 36px Inter,Arial,sans-serif'; ptCtx.textAlign = 'center';
  ptCtx.fillText('FROM THE', 256, 120); ptCtx.fillText('CREATOR', 256, 165);
  ptCtx.strokeStyle = 'rgba(255,255,255,0.3)'; ptCtx.lineWidth = 1.5;
  ptCtx.beginPath(); ptCtx.moveTo(140, 200); ptCtx.lineTo(372, 200); ptCtx.stroke();
  ptCtx.fillStyle = 'rgba(204,0,0,0.6)'; ptCtx.font = '40px serif'; ptCtx.fillText('🦌', 256, 260);
  ptCtx.fillStyle = 'rgba(255,255,255,0.5)'; ptCtx.font = 'italic 22px Inter,Arial,sans-serif';
  ptCtx.fillText('— Sarah Liu \'26', 256, 560);
  ptCtx.fillStyle = 'rgba(255,255,255,0.2)'; ptCtx.font = '500 14px Inter,Arial,sans-serif';
  ptCtx.fillText('FAIRFIELD STAGS TENNIS 2025–2026', 256, 640);

  const textMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(pc), transparent: true, depthWrite: false, side: THREE.DoubleSide, opacity: 0.95 });
  const plaqueText = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 2.1), textMat);
  plaqueText.position.set(0, 1.4, 0.045); group.add(plaqueText);
  const back = plaqueText.clone(); back.position.set(0, 1.4, -0.045); back.rotation.y = Math.PI; group.add(back);

  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.6, 2.2, 0.08)),
    new THREE.LineBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.35 }));
  edges.position.y = 1.4; group.add(edges);

  group.add(m(new THREE.CylinderGeometry(0.45, 0.55, 0.1, 24), stdMat(0x333333, { metalness: 0.8, roughness: 0.2 }), 0, 0.05, 0));
  group.add(m(new THREE.CylinderGeometry(0.04, 0.04, 0.3, 12), stdMat(0x555555, { metalness: 0.8, roughness: 0.2 }), 0, 0.25, 0));

  group.position.set(3.5, 0, 1.8); group.rotation.y = -0.25;
  group.userData = { type: 'creator', title: '🦌 From the Creator',
    note: 'To my 2025–2026 team: Building this was my way of bottling up the energy and the grind we shared. As I graduate, I\'m leaving a piece of the court behind with you. Go Stags!' };
  group.traverse(c => { if (c.isMesh || c.isLineSegments) { c.userData = group.userData; if (c.isMesh) clickableObjects.push(c); } });

  const pl = new THREE.PointLight(0xffd700, 0.4, 6);
  pl.position.set(3.5, 3, 1.8); scene.add(pl);
  scene.add(group);
  return group;
}
