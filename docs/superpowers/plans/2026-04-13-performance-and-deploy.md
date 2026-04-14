# FUWTEN26 Performance Optimization & Deployment Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate the main Three.js performance bottlenecks in `index.js` and deploy the site for free on Cloudflare Pages.

**Architecture:** All changes are in a single file (`index.js`). No test infrastructure exists — this is a visual/3D app, so correctness is verified by running the dev server and eyeballing the scene after each change. Each task is a focused surgical edit followed by a visual check and commit.

**Tech Stack:** Three.js, Vite, Cloudflare Pages (deploy)

---

## File Map

| File | Change |
|------|--------|
| `index.js` | 4 targeted edits (shadow map, bloom, cubeCamera, Vector3 alloc) |
| No new files | Cloudflare Pages needs no config for a Vite project |

---

### Task 1: Reduce Shadow Map Size

The directional light at line 119 uses a 2048×2048 PCFSoft shadow map. PCFSoft samples multiple times per pixel — expensive. Dropping to 1024 + PCF cuts shadow cost by ~75%.

**Files:**
- Modify: `index.js:51-52` and `index.js:119`

- [ ] **Step 1: Edit shadow map type (line 52)**

Find this in `index.js`:
```js
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
```
Change to:
```js
renderer.shadowMap.type = THREE.PCFShadowMap;
```

- [ ] **Step 2: Edit shadow map resolution (line 119)**

Find this in `index.js`:
```js
mainLight.shadow.mapSize.set(2048, 2048);
```
Change to:
```js
mainLight.shadow.mapSize.set(1024, 1024);
```

- [ ] **Step 3: Visual check**

```bash
npm run dev
```
Open browser. Verify shadows still appear on the court. They'll be very slightly less soft — unnoticeable in practice.

- [ ] **Step 4: Commit**

```bash
git add index.js
git commit -m "perf: reduce shadow map to 1024 PCF"
```

---

### Task 2: Remove UnrealBloomPass (replace EffectComposer with direct render)

The bloom effect is barely visible (strength `0.25`) but runs a full multi-pass blur shader every frame. Replacing `composer.render()` with `renderer.render()` removes all post-processing overhead. The imports can stay — unused imports are tree-shaken by Vite.

**Files:**
- Modify: `index.js:2411`

- [ ] **Step 1: Replace composer.render with renderer.render**

Find this at the bottom of the `animate()` function (line 2411):
```js
  composer.render();
```
Change to:
```js
  renderer.render(scene, camera);
```

- [ ] **Step 2: Visual check**

```bash
npm run dev
```
Open browser. The scene should look identical or marginally sharper (bloom was very subtle). Confirm all animations still run.

- [ ] **Step 3: Commit**

```bash
git add index.js
git commit -m "perf: remove UnrealBloomPass, use direct renderer.render"
```

---

### Task 3: Disable CubeCamera Live Env Map Updates

The `cubeCamera.update()` call at line 2281 re-renders the entire scene 6 times (once per cube face) every 60 frames. It's used only for court reflections. The court material will keep its static env map captured at startup — just remove the per-frame refresh.

**Files:**
- Modify: `index.js:1196-1201` and `index.js:2270-2283`

- [ ] **Step 1: Capture env map once at startup, then stop**

Find the env map setup block (around line 1196):
```js
// ─── ENVIRONMENT CUBERENDER ───
const cubeRT = new THREE.WebGLCubeRenderTarget(256, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRT);
cubeCamera.name = 'envCubeCamera';
scene.add(cubeCamera);
courtMat.envMap = cubeRT.texture;
```
Add a one-shot update call right after `scene.add(cubeCamera)`:
```js
// ─── ENVIRONMENT CUBERENDER ───
const cubeRT = new THREE.WebGLCubeRenderTarget(256, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRT);
cubeCamera.name = 'envCubeCamera';
cubeCamera.position.set(0, 0.5, 0);
scene.add(cubeCamera);
// Capture env map once at startup — no need to refresh every frame
cubeCamera.update(renderer, scene);
courtMat.envMap = cubeRT.texture;
```

- [ ] **Step 2: Remove the per-frame refresh in animate()**

Find this block inside `animate()` (lines 2270–2283):
```js
let cubeRefreshCounter = 0;
```
...and inside `animate()`:
```js
  // Refresh env map periodically for court reflections
  cubeRefreshCounter++;
  if (cubeRefreshCounter % 60 === 0) {
    courtMesh.visible = false;
    cubeCamera.position.set(0, 0.5, 0);
    cubeCamera.update(renderer, scene);
    courtMesh.visible = true;
  }
```
Delete the `let cubeRefreshCounter = 0;` line and the entire `if (cubeRefreshCounter % 60 === 0)` block.

- [ ] **Step 3: Visual check**

```bash
npm run dev
```
Open browser. The court surface reflection should look identical (it was updating with a mostly-static scene anyway). Confirm no console errors.

- [ ] **Step 4: Commit**

```bash
git add index.js
git commit -m "perf: capture cubeCamera env map once at startup, remove per-frame refresh"
```

---

### Task 4: Fix Vector3 Allocation Inside Animation Loop

Line 2360 creates a `new THREE.Vector3()` on every frame, which triggers garbage collection and causes microstutters. Hoist it outside `animate()` and reuse it.

**Files:**
- Modify: `index.js` — add one line before `animate()`, edit one line inside it

- [ ] **Step 1: Add reusable vector before the animate function**

Find the line that declares `function animate()` (line 2272). Add this line immediately above it:
```js
const _dirToCenter = new THREE.Vector3(); // reused each frame — avoids GC pressure
function animate() {
```

- [ ] **Step 2: Replace the allocation inside animate()**

Find this line inside `animate()` (line 2360):
```js
  const dirToCenter = new THREE.Vector3(0, 0, 0).sub(new THREE.Vector3(10, 0, -3)).normalize();
```
Change to:
```js
  _dirToCenter.set(0, 0, 0).sub(_camera3DBase).normalize();
```
Then add this constant alongside the `_dirToCenter` declaration above `animate()`:
```js
const _dirToCenter = new THREE.Vector3();
const _camera3DBase = new THREE.Vector3(10, 0, -3);
function animate() {
```

- [ ] **Step 3: Visual check**

```bash
npm run dev
```
Open browser. The 3D camera object should still float and rotate normally.

- [ ] **Step 4: Commit**

```bash
git add index.js
git commit -m "perf: hoist Vector3 allocations out of animation loop"
```

---

### Task 5: Deploy to Cloudflare Pages (free forever)

Cloudflare Pages is free with unlimited bandwidth, no expiry, and a fast global CDN. A Vite project deploys with zero config.

**Files:**
- No new files needed

- [ ] **Step 1: Build the project**

```bash
npm run build
```
Expected: `dist/` folder created with `index.html` + `assets/`.

- [ ] **Step 2: Deploy via Cloudflare Pages dashboard**

1. Go to [https://pages.cloudflare.com](https://pages.cloudflare.com) and sign up / log in (free)
2. Click **"Create a project"** → **"Direct Upload"**
3. Give it a name (e.g. `fuwten26`)
4. Upload the entire `dist/` folder
5. Click **Deploy**

You'll get a URL like `fuwten26.pages.dev` — free, permanent, no credit card.

**Alternative (git-connected, auto-deploys on push):**
1. Push the repo to GitHub
2. On Cloudflare Pages → **"Connect to Git"** → select repo
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Every push to `main` auto-deploys

- [ ] **Step 3: Verify live site**

Open the `*.pages.dev` URL in a browser. Confirm scene loads, audio plays, balls are clickable, player cards open.

- [ ] **Step 4: Commit deploy note**

```bash
git add .
git commit -m "chore: production build verified, deployed to Cloudflare Pages"
```

---

## Expected Results

| Bottleneck | Before | After |
|-----------|--------|-------|
| Shadow map | 2048×2048 PCFSoft | 1024×1024 PCF — ~75% cheaper |
| Post-processing | Full UnrealBloom pass every frame | Removed — direct render |
| Env map | Scene rendered 6× every 60 frames | Captured once at startup |
| GC pressure | New Vector3 every frame | Zero allocations in loop |
| Hosting | Local only | Cloudflare Pages — free forever |
