import * as THREE from 'three';
import { scene, isMobile } from './scene.js';

export const courtGroup = new THREE.Group();
courtGroup.name = 'courtGroup';

// ─── COURT SURFACE ───
const courtGeo = new THREE.BoxGeometry(16, 0.15, 24);
export const courtMat = isMobile
  ? new THREE.MeshStandardMaterial({ color: 0x2a0000, metalness: 0.15, roughness: 0.3, transparent: true, opacity: 0.88, side: THREE.DoubleSide })
  : new THREE.MeshPhysicalMaterial({ color: 0x2a0000, metalness: 0.15, roughness: 0.05, transparent: true, opacity: 0.88, clearcoat: 1.0, clearcoatRoughness: 0.05, side: THREE.DoubleSide });
export const courtMesh = new THREE.Mesh(courtGeo, courtMat);
courtMesh.name = 'courtSurface';
courtMesh.receiveShadow = true;
courtGroup.add(courtMesh);

// Court glow
const glowGeo = new THREE.PlaneGeometry(16.5, 24.5);
export const glowMat = new THREE.MeshBasicMaterial({
  color: 0xcc0000, transparent: true, opacity: 0.18, side: THREE.DoubleSide,
});
const glowMesh = new THREE.Mesh(glowGeo, glowMat);
glowMesh.rotation.x = -Math.PI / 2;
glowMesh.position.y = -0.1;
courtGroup.add(glowMesh);

// ─── COURT LINES ───
function createLine(width, depth, x, z) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.16, depth),
    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.3, roughness: 0.3 })
  );
  mesh.position.set(x, 0, z);
  courtGroup.add(mesh);
}
createLine(16, 0.06, 0, -12); createLine(16, 0.06, 0, 12);
createLine(0.06, 24, -8, 0);  createLine(0.06, 24, 8, 0);
createLine(12, 0.04, 0, -6.4); createLine(12, 0.04, 0, 6.4);
createLine(0.04, 24, -6, 0);  createLine(0.04, 24, 6, 0);

const dividerMesh = new THREE.Mesh(
  new THREE.BoxGeometry(16, 0.16, 0.06),
  new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5, roughness: 0.3,
    transparent: true, opacity: 0.4, depthWrite: false, blending: THREE.AdditiveBlending,
  })
);
courtGroup.add(dividerMesh);

// ─── NET ───
const netMesh = new THREE.Mesh(
  new THREE.BoxGeometry(16.5, 1.2, 0.06),
  new THREE.MeshStandardMaterial({
    color: 0xffffff, roughness: 0.3, transparent: true, opacity: 0.4,
    side: THREE.DoubleSide, emissive: 0xffffff, emissiveIntensity: 0.08,
  })
);
netMesh.position.set(0, 0.68, 0);
courtGroup.add(netMesh);

const netTape = new THREE.Mesh(
  new THREE.BoxGeometry(16.5, 0.08, 0.08),
  new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.4, roughness: 0.2 })
);
netTape.position.set(0, 1.28, 0);
courtGroup.add(netTape);

for (const side of [-1, 1]) {
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 1.4, 12),
    new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 })
  );
  post.position.set(side * 8.25, 0.7, 0);
  courtGroup.add(post);
}

scene.add(courtGroup);

// ─── COURT LOGO ───
// NOTE: /assets/stagslogoT.png must be a real PNG in public/assets/.
// MeshBasicMaterial renders regardless of lighting — no emissive needed.
const logoTexture = new THREE.TextureLoader().load('/assets/stagslogoT.png');
logoTexture.anisotropy = isMobile ? 4 : 16;
logoTexture.colorSpace = THREE.SRGBColorSpace;

export const logoMaterial = new THREE.MeshBasicMaterial({
  map: logoTexture,
  transparent: true,
  alphaTest: 0.01,
  opacity: 0.6,
  side: THREE.DoubleSide,
  depthWrite: false,
  color: 0xffffff,
});
const logoMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 3.5), logoMaterial);
logoMesh.name = 'courtLogo';
logoMesh.renderOrder = 2;
logoMesh.rotation.x = -Math.PI / 2;
logoMesh.position.set(0, 0.12, -1.65);
courtGroup.add(logoMesh);

// ─── COURT BRANDING TEXT ───
function createCourtText(text, fontSize, color, w, h, spacing) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = color;
  ctx.font = `800 ${fontSize}px "Inter", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = spacing || '6.6px';
  ctx.fillText(text, w / 2, h / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = isMobile ? 4 : 16;
  return tex;
}

const courtTextMat = (tex, emissiveIntensity = 0.12) => new THREE.MeshStandardMaterial({
  map: tex, transparent: true, alphaTest: 0.05, roughness: 0.2, metalness: 0.15,
  emissive: 0xcc0000, emissiveIntensity,
  polygonOffset: true, polygonOffsetFactor: -1,
  side: THREE.DoubleSide, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending,
});

export const fuMat = courtTextMat(createCourtText('FAIRFIELD UNIVERSITY', 64, '#ffffff', 1024, 128));
const fuMesh = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 0.48), fuMat);
fuMesh.rotation.x = -Math.PI / 2;
fuMesh.position.set(0, 0.081, 0.55);
courtGroup.add(fuMesh);

export const wtenMat = courtTextMat(createCourtText('WTEN 26', 56, '#C8102E', 512, 128), 0.25);
const wtenMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 0.45), wtenMat);
wtenMesh.rotation.x = -Math.PI / 2;
wtenMesh.position.set(0, 0.081, 1.2);
courtGroup.add(wtenMesh);

// ─── GROUND ───
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0x1a0000, roughness: 0.9 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.08;
ground.receiveShadow = true;
scene.add(ground);

// ─── PARTICLES ───
export const PARTICLE_COUNT = 100;
const pGeo = new THREE.BufferGeometry();
const pPos = new Float32Array(PARTICLE_COUNT * 3);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const angle = Math.random() * Math.PI * 2;
  const r = Math.random() * 14;
  pPos[i * 3]     = Math.cos(angle) * r;
  pPos[i * 3 + 1] = Math.random() * 12 + 2;
  pPos[i * 3 + 2] = Math.sin(angle) * r;
}
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
export const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
  color: 0xffd700, size: 0.1, transparent: true, opacity: 0.5,
  blending: THREE.AdditiveBlending, sizeAttenuation: true,
}));
scene.add(particles);
