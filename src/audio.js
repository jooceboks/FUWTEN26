import { HIT_SFX_URL, AMBIENT_URL } from './data.js';

let audioContext, hitBuffer, ambientAudio;
let audioInitialized = false;

export async function initAudio() {
  if (audioInitialized) return;
  audioInitialized = true;
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  try {
    const resp = await fetch(HIT_SFX_URL);
    hitBuffer = await audioContext.decodeAudioData(await resp.arrayBuffer());
  } catch (e) { console.warn('Could not load hit SFX', e); }
  ambientAudio = new Audio(AMBIENT_URL);
  ambientAudio.loop = true;
  ambientAudio.volume = 0.25;
  ambientAudio.play().catch(() => {});
}

export function playHitSound() {
  if (!audioContext || !hitBuffer) return;
  const source = audioContext.createBufferSource();
  source.buffer = hitBuffer;
  const gain = audioContext.createGain();
  gain.gain.value = 0.5;
  source.connect(gain);
  gain.connect(audioContext.destination);
  source.start(0);
}

export function getAmbientAudio() { return ambientAudio; }
