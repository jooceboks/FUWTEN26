import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// ─── RENDERER ───
export const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap; // perf: PCF (not Soft)
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;
document.getElementById('root').appendChild(renderer.domElement);

// ─── SCENE ───
export const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x1a0000, 0.012);

// ─── CAMERA ───
export const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 38, 0);
camera.lookAt(0, 0, 0);

// ─── CONTROLS ───
export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2.1;
controls.minDistance = 8;
controls.maxDistance = 40;
controls.target.set(0, 0, 0);
controls.enablePan = false;
controls.enabled = false;

// ─── CLOCK ───
export const clock = new THREE.Clock();

// ─── BACKGROUND ───
const bgCanvas = document.createElement('canvas');
bgCanvas.width = 512; bgCanvas.height = 512;
const bgCtx = bgCanvas.getContext('2d');
const grad = bgCtx.createRadialGradient(256, 180, 40, 256, 256, 400);
grad.addColorStop(0, '#3a0000');
grad.addColorStop(0.45, '#1a0000');
grad.addColorStop(1, '#080000');
bgCtx.fillStyle = grad;
bgCtx.fillRect(0, 0, 512, 512);
bgCtx.globalAlpha = 0.08;
[
  [130, 100, 180], [380, 140, 160], [256, 400, 200],
].forEach(([x, y, r]) => {
  const spot = bgCtx.createRadialGradient(x, y, 10, x, y, r);
  spot.addColorStop(0, '#cc0000');
  spot.addColorStop(1, 'transparent');
  bgCtx.fillStyle = spot;
  bgCtx.fillRect(0, 0, 512, 512);
});
scene.background = new THREE.CanvasTexture(bgCanvas);

// ─── LIGHTS ───
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const mainLight = new THREE.DirectionalLight(0xfff5e6, 1.8);
mainLight.position.set(10, 20, 10);
mainLight.castShadow = true;
mainLight.shadow.mapSize.set(1024, 1024); // perf: 1024 (was 2048)
mainLight.shadow.camera.near = 0.5;
mainLight.shadow.camera.far = 50;
mainLight.shadow.camera.left = -20; mainLight.shadow.camera.right = 20;
mainLight.shadow.camera.top = 20;   mainLight.shadow.camera.bottom = -20;
mainLight.shadow.bias = -0.001;
mainLight.shadow.normalBias = 0.02;
scene.add(mainLight);

const rimLight = new THREE.DirectionalLight(0xcc0000, 0.8);
rimLight.position.set(-10, 10, -10);
scene.add(rimLight);

const fillLight = new THREE.PointLight(0xffcccc, 0.6, 50);
fillLight.position.set(0, 8, 15);
scene.add(fillLight);

const stadiumLight = new THREE.RectAreaLight(0xffeedd, 2.5, 14, 22);
stadiumLight.position.set(0, 18, 0);
stadiumLight.lookAt(0, 0, 0);
scene.add(stadiumLight);

const floodL = new THREE.SpotLight(0xcc0011, 1.2, 40, Math.PI / 6, 0.6, 1);
floodL.position.set(-15, 15, 0);
floodL.target.position.set(0, 0, 0);
scene.add(floodL); scene.add(floodL.target);

const floodR = new THREE.SpotLight(0xcc0011, 1.2, 40, Math.PI / 6, 0.6, 1);
floodR.position.set(15, 15, 0);
floodR.target.position.set(0, 0, 0);
scene.add(floodR); scene.add(floodR.target);

// ─── RESIZE ───
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
