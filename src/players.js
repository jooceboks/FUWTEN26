import * as THREE from 'three';
import { scene, isMobile } from './scene.js';
import { players } from './data.js';

export const ballGroup = new THREE.Group();
ballGroup.name = 'ballGroup';

export const hoverScaleTarget = {};

const ballPositions = [
  { x: -5.5, y: 1.4,  z: -8.5 }, { x: 2.5,  y: 1.7,  z: -6.5 }, { x: -1.5, y: 1.5,  z: -10  },
  { x: 6.5,  y: 1.6,  z: -7.5 }, { x: -7.5, y: 1.45, z: -5.5 },
  { x: -4.5, y: 1.65, z: 5.5  }, { x: 5.5,  y: 1.9,  z: 7.5  }, { x: -6.5, y: 2.0,  z: 9.5  },
  { x: 1.5,  y: 1.75, z: 8.5  }, { x: 7.5,  y: 1.8,  z: 4.5  },
];

function createBallTexture() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(128, 110, 20, 128, 128, 128);
  g.addColorStop(0, '#d4e04c'); g.addColorStop(0.6, '#c5d035'); g.addColorStop(1, '#8a9920');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(40, 128); ctx.bezierCurveTo(80, 50, 176, 50, 216, 128); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(40, 128); ctx.bezierCurveTo(80, 206, 176, 206, 216, 128); ctx.stroke();
  return new THREE.CanvasTexture(c);
}

function createNameLabel(name) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 128;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 512, 128);
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath(); ctx.roundRect(76, 39, 360, 50, 25); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.font = '700 34px "Inter", Arial, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(name, 256, 64);
  return new THREE.CanvasTexture(c);
}

const ballTexture = createBallTexture();

players.forEach((player, i) => {
  const pos = ballPositions[i];

  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, isMobile ? 16 : 32, isMobile ? 16 : 32),
    new THREE.MeshStandardMaterial({ map: ballTexture, roughness: 0.8, metalness: 0.05 })
  );
  ball.name = `ball_${i}_${player.name}`;
  ball.position.set(pos.x, pos.y, pos.z);
  ball.castShadow = !isMobile;
  ball.userData = { type: 'player', index: i, ...player, baseY: pos.y, phase: Math.random() * Math.PI * 2 };
  ballGroup.add(ball);

  const glowRing = new THREE.Mesh(
    new THREE.RingGeometry(0.3, 0.7, 32),
    new THREE.MeshBasicMaterial({ color: 0xcc0000, transparent: true, opacity: 0.12, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  glowRing.rotation.x = -Math.PI / 2;
  glowRing.position.set(pos.x, 0.02, pos.z);
  ballGroup.add(glowRing);

  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 0.6),
    new THREE.MeshBasicMaterial({ map: createNameLabel(player.name), transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false })
  );
  label.name = `label_${i}`;
  label.position.set(pos.x, pos.y + 1.0, pos.z);
  ballGroup.add(label);
});

scene.add(ballGroup);
