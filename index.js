import * as THREE from 'three';
import { scene, camera, renderer, controls, clock } from './src/scene.js';
import { courtGroup, glowMat, logoMaterial, fuMat, wtenMat, particles, PARTICLE_COUNT } from './src/court.js';
import { ballGroup, hoverScaleTarget } from './src/players.js';
import { buildTrophy, buildJacket, buildRacket, build3DCamera, buildPlaque, buildRing } from './src/props.js';
import { playerImages, results, upcoming } from './src/data.js';
import {
  header, instDiv, toggleGallery, openCarousel,
  modalOverlay, modalBadge, modalTitle, modalNumber, modalNote, modalImageWrap, modalCloseBtn,
} from './src/ui.js';

// ─── CLICKABLE OBJECTS ───
const clickableObjects = [];

// ─── BUILD PROPS ───
const trophy     = buildTrophy(clickableObjects);
const jacket     = buildJacket(clickableObjects);
const racket     = buildRacket(clickableObjects);
const camera3D   = build3DCamera(clickableObjects);
const creatorPlaque = buildPlaque(clickableObjects);
const ring          = buildRing(clickableObjects);

// Register balls as clickable (already added to scene in players.js)
ballGroup.children.forEach(c => {
  if (c.userData && c.userData.type === 'player') clickableObjects.push(c);
});

// ─── CAMERA ANIMATION ───
let cameraAnimating = false;
const cameraStart       = new THREE.Vector3();
const cameraEnd         = new THREE.Vector3();
const cameraTargetStart = new THREE.Vector3();
const cameraTargetEnd   = new THREE.Vector3();
const savedCameraPos    = new THREE.Vector3();
const savedCameraTarget = new THREE.Vector3();
let cameraProgress = 0;
const cameraDuration = 0.8;
let cameraCallback = null;

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function animateCameraTo(targetPos, lookAt, callback) {
  savedCameraPos.copy(camera.position);
  savedCameraTarget.copy(controls.target);
  cameraStart.copy(camera.position);
  cameraEnd.copy(targetPos);
  cameraTargetStart.copy(controls.target);
  cameraTargetEnd.copy(lookAt);
  cameraProgress = 0;
  cameraAnimating = true;
  cameraCallback = callback;
}

function animateCameraBack() {
  cameraStart.copy(camera.position);
  cameraEnd.copy(savedCameraPos);
  cameraTargetStart.copy(controls.target);
  cameraTargetEnd.copy(savedCameraTarget);
  cameraProgress = 0;
  cameraAnimating = true;
  cameraCallback = () => { controls.enabled = true; };
}

// ─── MODAL ───
let modalOpen = false;

function openModal(data) {
  modalOpen = true;
  controls.enabled = false;

  modalImageWrap.style.display = 'none';
  modalImageWrap.textContent = '';
  const ring = document.createElement('div'); ring.className = 'placeholder-ring';
  const icon = document.createElement('span'); icon.className = 'placeholder-icon'; icon.textContent = '👤';
  modalImageWrap.append(ring, icon);

  // Reset styles
  modalBadge.style.display = '';
  modalTitle.style.cssText = '';
  modalNumber.style.display = 'none';

  if (data.type === 'player') {
    modalBadge.textContent = data.number || '';
    modalTitle.textContent = data.name;
    modalNote.textContent  = data.note;

    modalImageWrap.style.display = 'flex';
    const imgUrl = playerImages[data.name] || '';
    if (imgUrl) {
      modalImageWrap.textContent = '';
      const img = document.createElement('img');
      img.src = imgUrl; img.alt = data.name;
      modalImageWrap.appendChild(img);
    } else {
      const initials = data.name.split(' ').map(w => w[0]).join('');
      modalImageWrap.textContent = '';
      const r2 = document.createElement('div'); r2.className = 'placeholder-ring';
      const ic2 = document.createElement('span');
      ic2.className = 'placeholder-icon';
      ic2.style.cssText = 'font-size:24px;opacity:0.25;font-family:"Inter",sans-serif;font-weight:700;letter-spacing:1px;';
      ic2.textContent = initials;
      modalImageWrap.append(r2, ic2);
    }
  } else if (data.type === 'trophy') {
    modalBadge.textContent = 'CHAMPIONS TROPHY';
    modalTitle.textContent = 'A Symbol of Our Effort';
    modalNote.innerHTML = '<span style="color:rgba(255,255,255,0.92);line-height:1.6;display:block;">This trophy represents the hard work and effort we poured into every set, but to me, we are winners because of the <strong><span style="color:#C8102E;">people themselves</span></strong>\u2014not just the outcomes of the matches. I truly appreciate having such a supportive team to look back on. You all created a truly incredible senior year for me, and that is the <strong><span style="color:#C8102E;">real win</span></strong>.</span>';
  } else if (data.type === 'ring') {
    modalBadge.textContent = 'ASSISTANT COACH';
    modalTitle.textContent = 'Daniella Medvedeva';
    modalTitle.style.cssText = 'background:linear-gradient(135deg,#fff,#c0c0c0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:22px;font-weight:700;margin-bottom:6px;';
    modalNote.innerHTML = '<span style="color:rgba(255,255,255,0.92);line-height:1.7;display:block;">' + data.note + '</span>';
  } else if (data.type === 'jacket') {
    modalBadge.style.display = 'none';
    modalTitle.textContent = 'The Coaching Staff';
    modalTitle.style.cssText = 'background:linear-gradient(135deg,#fff,#fff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:24px;font-weight:700;margin-bottom:6px;';
    modalNumber.style.display = 'block';
    modalNumber.innerHTML = '<span style="color:#A2AAAD;font-size:13px;letter-spacing:3px;font-weight:500;">Jeff Bricker \xb7 Chris Pappas \xb7 Ed Paiges</span>';
    modalNote.innerHTML = '<span style="color:rgba(255,255,255,0.82);line-height:1.6;display:block;">To <strong><span style="color:#cc0000;">Jeff Bricker</span></strong>, <strong><span style="color:#cc0000;">Chris Pappas</span></strong>, and <strong><span style="color:#cc0000;">Ed Paiges</span></strong>: Thank you for the countless unseen efforts, the life lessons beyond the court, and for being the steady foundation of this team. Your impact reaches far beyond the game.</span>';
  } else if (data.type === 'racket') {
    const wins   = results.filter(r => r.result === 'W').length;
    const losses = results.filter(r => r.result === 'L').length;
    const maacW  = results.filter(r => r.maac && r.result === 'W').length;
    const maacL  = results.filter(r => r.maac && r.result === 'L').length;

    const modalCard = document.getElementById('modal-card');
    modalCard.style.maxWidth = '520px';

    modalBadge.textContent  = 'FAIRFIELD STAGS \xb7 2025\u201326';
    modalTitle.textContent  = 'Our Results';
    modalTitle.style.cssText = 'background:linear-gradient(135deg,#ffffff,#ffd700);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:26px;font-weight:800;margin-bottom:10px;';

    const statsRow = `<div style="display:flex;gap:10px;margin-bottom:16px;">
      <div style="flex:1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:12px;text-align:center;">
        <div style="font-size:22px;font-weight:800;color:#fff;">${wins}\u2013${losses}</div>
        <div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.35);text-transform:uppercase;margin-top:2px;">Overall</div>
      </div>
      <div style="flex:1;background:rgba(255,215,0,0.07);border:1px solid rgba(255,215,0,0.18);border-radius:12px;padding:12px;text-align:center;">
        <div style="font-size:22px;font-weight:800;color:#ffd700;">${maacW}\u2013${maacL}</div>
        <div style="font-size:9px;letter-spacing:2px;color:rgba(255,215,0,0.5);text-transform:uppercase;margin-top:2px;">MAAC</div>
      </div>
    </div>`;

    const rows = results.map(r => {
      const isW = r.result === 'W';
      const maacTag = r.maac ? '<span style="font-size:8px;color:rgba(255,215,0,0.5);margin-left:5px;letter-spacing:1px;">MAAC</span>' : '';
      return `<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
        <span style="font-size:10px;color:rgba(255,255,255,0.3);width:42px;flex-shrink:0;">${r.date}</span>
        <span style="flex:1;font-size:12px;font-weight:500;color:rgba(255,255,255,${isW ? '0.9' : '0.55'});">${r.opp}${maacTag}</span>
        <span style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);width:30px;text-align:right;">${r.score}</span>
        <span style="width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;flex-shrink:0;background:${isW ? 'rgba(180,220,80,0.15)' : 'rgba(204,0,0,0.2)'};color:${isW ? '#b4dc50' : '#ff6666'};">${r.result}</span>
      </div>`;
    }).join('');

    const upcomingRows = upcoming.map(u =>
      `<div style="display:flex;gap:10px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.03);">
        <span style="font-size:10px;color:rgba(255,215,0,0.4);width:60px;flex-shrink:0;">${u.date}</span>
        <span style="font-size:11px;color:rgba(255,255,255,0.4);">${u.opp}</span>
      </div>`
    ).join('');

    modalNote.innerHTML = statsRow +
      '<div style="max-height:220px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(204,0,0,0.3) transparent;margin-bottom:14px;">' + rows + '</div>' +
      '<div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.2);text-transform:uppercase;margin-bottom:8px;">Upcoming</div>' +
      upcomingRows;
  } else if (data.type === 'creator') {
    modalBadge.textContent = 'CREATOR NOTE';
    modalTitle.textContent = 'A Message from Sliu';
    modalTitle.style.cssText = 'background:linear-gradient(135deg,#fff,#ffd700);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:21.6px;font-weight:700;white-space:nowrap;margin-bottom:6px;';
    modalImageWrap.style.display = 'block';
    modalImageWrap.innerHTML = '';
    const creatorImg = document.createElement('img');
    creatorImg.src = '/assets/creator.jpg';
    creatorImg.alt = 'Sarah Liu';
    creatorImg.style.cssText = 'width:100%;height:100%;object-fit:cover;object-position:center top;border-radius:12px;display:block;';
    modalImageWrap.appendChild(creatorImg);
    modalNote.innerHTML = '<span style="color:rgba(255,255,255,0.92);line-height:1.6;display:block;">To my 2025\u20132026 team: Building this was my way of bottling up the energy, the late-night bus rides, and the absolute grind we shared on these courts. I wanted to create something as permanent as the memories we made. As I graduate, I\u2019m leaving a piece of this court behind with you. Roll Stags!</span><div class="modal-creator-signature" style="margin-top:18px;padding-top:14px;border-top:1px solid rgba(255,215,0,0.15);text-align:right;"><span style="font-family:Georgia,serif;font-style:italic;font-size:18px;color:rgba(255,215,0,0.7);letter-spacing:1px;">Sarah Liu \'26 \uD83C\uDF93</span></div>';
  }

  modalOverlay.classList.add('active');
}

function closeModal() {
  modalOpen = false;
  modalOverlay.classList.remove('active');
  document.getElementById('modal-card').style.maxWidth = '';
  controls.enabled = true;
  animateCameraBack();
}

modalCloseBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

// ─── INTRO ───
let introActive = true;
const introStart       = new THREE.Vector3(0, 38, 0);
const introEnd         = new THREE.Vector3(0, 16, 18);
const introTargetStart = new THREE.Vector3(0, 0, 0);
const introTargetEnd   = new THREE.Vector3(0, 0, 0);
let introProgress = 0;
const introDuration = 2.5;

// ─── HOVER ───
let hoveredObject = null;

// ─── RAYCASTER ───
const raycaster = new THREE.Raycaster();
const mouse     = new THREE.Vector2();

renderer.domElement.addEventListener('mousemove', (e) => {
  mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(clickableObjects, false);

  if (hits.length > 0 && !modalOpen && !introActive) {
    renderer.domElement.style.cursor = 'pointer';
    const obj = hits[0].object;
    if (hoveredObject !== obj) {
      if (hoveredObject?.userData?.type === 'player') hoverScaleTarget[hoveredObject.name] = 1.0;
      hoveredObject = obj;
      if (obj.userData?.type === 'player') hoverScaleTarget[obj.name] = 1.12;
    }
  } else {
    renderer.domElement.style.cursor = 'default';
    if (hoveredObject?.userData?.type === 'player') hoverScaleTarget[hoveredObject.name] = 1.0;
    hoveredObject = null;
  }
});

renderer.domElement.addEventListener('click', async (e) => {
  if (modalOpen || cameraAnimating || introActive) return;
  mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(clickableObjects, false);
  if (!hits.length) return;

  const obj  = hits[0].object;
  const data = obj.userData;
  if (!data.type) return;
  if (data.type === 'camera3d') { openCarousel(); return; }

  let camPos, targetLook;
  if      (data.type === 'player')  { camPos = new THREE.Vector3(obj.position.x+2.5, obj.position.y+1.5, obj.position.z+3); targetLook = obj.position.clone(); }
  else if (data.type === 'trophy')  { camPos = new THREE.Vector3(-7,3,0);   targetLook = new THREE.Vector3(-10,1.5,-3); }
  else if (data.type === 'jacket')  { camPos = new THREE.Vector3(-7,3,6);   targetLook = new THREE.Vector3(-10,1.5,3);  }
  else if (data.type === 'racket')  { camPos = new THREE.Vector3(7,4,6);    targetLook = new THREE.Vector3(10,3.5,3);   }
  else if (data.type === 'ring')    { camPos = new THREE.Vector3(-6,3,3);   targetLook = new THREE.Vector3(-8.5,1.5,1.2); }
  else if (data.type === 'creator') { camPos = new THREE.Vector3(6,3,5);    targetLook = new THREE.Vector3(3.5,1.5,1.8); }

  animateCameraTo(camPos, targetLook, () => openModal(data));
});


// ─── ANIMATE ───
// Hoisted to avoid per-frame allocations (perf fix 4)
const _dirToCenter = new THREE.Vector3();

function animate() {
  const time  = clock.getElapsedTime();
  const delta = clock.getDelta() || 0.016;

  // ── Intro dolly ──
  if (introActive) {
    introProgress += delta / introDuration;
    if (introProgress >= 1) {
      introProgress = 1; introActive = false; controls.enabled = true;
      camera.position.copy(introEnd);
      controls.target.copy(introTargetEnd);
      header.classList.add('visible');
      instDiv.classList.add('visible');

    } else {
      const t = easeInOutCubic(introProgress);
      camera.position.lerpVectors(introStart, introEnd, t);
      controls.target.lerpVectors(introTargetStart, introTargetEnd, t);
    }
    camera.lookAt(controls.target);
  }

  // ── Balls ──
  ballGroup.children.forEach((child) => {
    if (child.userData?.type === 'player') {
      const d = child.userData;
      child.position.y = d.baseY + Math.sin(time * 1.2 + d.phase) * 0.25;
      child.rotation.x = time * 0.3 + d.phase;
      child.rotation.z = time * 0.2 + d.phase * 0.5;
      const targetScale = hoverScaleTarget[child.name] || 1.0;
      child.scale.setScalar(child.scale.x + (targetScale - child.scale.x) * 0.1);
      if (child.material) {
        const te = targetScale > 1.05 ? 0.15 : 0.0;
        child.material.emissiveIntensity += (te - child.material.emissiveIntensity) * 0.1;
        if (!child.material.emissive) child.material.emissive = new THREE.Color(0xffffff);
      }
    }
    if (child.name?.startsWith('label_')) {
      const idx  = parseInt(child.name.split('_')[1]);
      const ball = ballGroup.children.find(c => c.name?.startsWith(`ball_${idx}_`));
      if (ball) { child.position.y = ball.position.y + 1.0; child.lookAt(camera.position); }
    }
  });

  // ── Props animation ──
  trophy.rotation.y = Math.sin(time * 0.5) * 0.15;
  trophy.children.forEach(c => {
    if (c.name === 'trophyStar') { c.rotation.y = time * 2; c.rotation.x = time * 1.5; }
  });

  jacket.rotation.y = Math.sin(time * 0.4 + 1) * 0.1;

  creatorPlaque.position.y = Math.sin(time * 0.7 + 2) * 0.08;
  creatorPlaque.rotation.y = Math.sin(time * 0.5) * 0.08;
  ring.position.y = 1.5 + Math.sin(time * 1.1 + 1) * 0.1;
  ring.rotation.y = time * 0.4;
  ring.children.forEach(c => {
    if (c.name === 'ringGem') {
      c.rotation.y = time * 3;
      c.rotation.x = time * 2;
      c.material.emissiveIntensity = 0.5 + Math.abs(Math.sin(time * 4)) * 0.8;
    }
  });

  racket.position.y = 1.2 + Math.sin(time * 0.9) * 0.25;
  racket.rotation.y = -0.3 + Math.sin(time * 0.6) * 0.2;
  racket.rotation.z = 0.15 + Math.sin(time * 0.7 + 0.5) * 0.05;

  camera3D.position.y = 1.5 + Math.sin(time * 0.8 + 1.5) * 0.2;
  _dirToCenter.set(0,0,0).sub(new THREE.Vector3(10,0,-3)).normalize();
  camera3D.rotation.y = Math.atan2(_dirToCenter.x, _dirToCenter.z) + Math.sin(time * 0.4 + 0.8) * 0.08;
  const redDot = camera3D.getObjectByName('cameraRedDot');
  if (redDot) {
    const pulse = Math.sin(time * 3) > 0 ? 1.0 : 0.2;
    redDot.material.emissiveIntensity = pulse;
    redDot.scale.setScalar(0.8 + pulse * 0.4);
  }

  // ── Particles ──
  const pPos = particles.geometry.attributes.position.array;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    pPos[i * 3 + 1] += 0.005;
    if (pPos[i * 3 + 1] > 16) pPos[i * 3 + 1] = 2;
  }
  particles.geometry.attributes.position.needsUpdate = true;

  // ── Court pulse ──
  glowMat.opacity = 0.13 + Math.sin(time * 0.8) * 0.05;
  const brandPulse = 0.10 + Math.sin(time * 1.2) * 0.06;
  logoMaterial.emissiveIntensity = brandPulse;
  fuMat.emissiveIntensity  = brandPulse;
  wtenMat.emissiveIntensity = brandPulse + 0.04;

  // ── Camera tween ──
  if (cameraAnimating && !introActive) {
    cameraProgress += 0.016 / cameraDuration;
    if (cameraProgress >= 1) {
      cameraProgress = 1; cameraAnimating = false;
      camera.position.copy(cameraEnd);
      controls.target.copy(cameraTargetEnd);
      if (cameraCallback) { cameraCallback(); cameraCallback = null; }
    } else {
      const t = easeInOutCubic(cameraProgress);
      camera.position.lerpVectors(cameraStart, cameraEnd, t);
      controls.target.lerpVectors(cameraTargetStart, cameraTargetEnd, t);
    }
    controls.update();
  } else if (!introActive) {
    controls.update();
  }

  // Perf fix 2: direct render, no EffectComposer/bloom
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
