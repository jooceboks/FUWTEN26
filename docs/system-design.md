# FUWTEN26 System Design

## Module Map

| File | Exports | Purpose |
|------|---------|---------|
| `src/data.js` | `players`, `playerImages`, `HIT_SFX_URL`, `AMBIENT_URL`, `highlightMedia` | Pure data — no imports |
| `src/scene.js` | `scene`, `camera`, `renderer`, `controls`, `clock` | Three.js core + lights + bg + resize |
| `src/court.js` | `courtGroup`, `courtMat`, `glowMat`, `logoMaterial`, `fuMat`, `wtenMat`, `particles`, `PARTICLE_COUNT` | Court geometry, lines, net, logo, ground, particles |
| `src/players.js` | `ballGroup`, `hoverScaleTarget` | 10 tennis balls + name labels + glow rings |
| `src/audio.js` | `initAudio`, `playHitSound`, `getAmbientAudio` | Web Audio hit SFX + ambient loop |
| `src/props.js` | `buildTrophy`, `buildJacket`, `buildRacket`, `build3DCamera`, `buildPlaque` | 3D scene props (each takes `clickableObjects[]`) |
| `src/ui.js` | `header`, `instDiv`, `audioBtn`, `galleryPanel`, `toggleGallery`, `modalOverlay`, `modalBadge`, `modalTitle`, `modalNumber`, `modalNote`, `modalImageWrap`, `modalCloseBtn` | CSS injection + all DOM, gallery, lightbox |
| `index.js` | — | Orchestrator: wires everything, raycaster, camera tween, animate loop |

## Design Tokens

| Token | Value |
|-------|-------|
| Primary red | `#cc0000` / `0xcc0000` |
| Gold accent | `#ffd700` / `0xffd700` |
| Background dark | `#080000` → `#3a0000` (radial) |
| Fog | `FogExp2(0x1a0000, 0.012)` |
| Court surface | `MeshPhysicalMaterial`, `transmission:0.55`, `opacity:0.92` |

## Scene Structure

```
scene
├── courtGroup          (court.js)
│   ├── courtMesh       glass surface
│   ├── glowMesh        red under-court glow
│   ├── court lines     (BoxGeometry)
│   ├── dividerMesh     net divider
│   ├── netMesh + tape  net
│   ├── net posts
│   ├── logoMesh        /assets/stagslogoT.png  ← must be real PNG
│   ├── fuMesh          FAIRFIELD UNIVERSITY text
│   └── wtenMesh        WTEN 26 text
├── ground              PlaneGeometry(100,100)
├── particles           Points (gold confetti, 100 pts)
├── ballGroup           (players.js)
│   ├── ball_0..9       SphereGeometry clickable
│   ├── glowRing_0..9   RingGeometry on floor
│   └── label_0..9      PlaneGeometry billboard
├── trophyGroup         (props.js) pos(-10,0,-3)
├── jacketGroup         (props.js) pos(-10,0, 3)
├── racketGroup         (props.js) pos(10,1.2,3)
├── cameraGroup         (props.js) pos(10,1.5,-3)
├── creatorsPlaqueGroup (props.js) pos(3.5,0,1.8)
└── lights
    ├── AmbientLight(0xffffff, 0.5)
    ├── DirectionalLight(0xfff5e6, 1.8)  shadows: 1024x1024
    ├── DirectionalLight(0xcc0000, 0.8)  rim
    ├── PointLight(0xffcccc, 0.6, 50)    fill
    ├── RectAreaLight(0xffeedd, 2.5)     stadium flood
    └── SpotLight x2(0xcc0011)           accent floods
```

## Performance Fixes Applied

1. **Shadow map**: `PCFShadowMap` (was `PCFSoftShadowMap`) + `1024×1024` (was `2048×2048`)
2. **No bloom**: Removed `EffectComposer` + `UnrealBloomPass` → `renderer.render(scene, camera)`
3. **No env map**: Removed `CubeCamera` — court reflection is static
4. **Hoisted Vector3**: `_dirToCenter` declared outside animate loop

## Adding Content

**New player photo**: add entry to `playerImages` in `src/data.js`, place file in `public/assets/roster/`

**Highlight media**: add `{ type:'video'|'image', src:'URL', caption:'...' }` to `highlightMedia` in `src/data.js`

**Court logo**: replace `public/assets/stagslogoT.png` with real PNG (transparent background recommended)

## Asset Paths

All static assets must live in `public/` so Vite serves them at `/`. Example:
- `public/assets/stagslogoT.png` → served as `/assets/stagslogoT.png`
- `public/assets/roster/imgi_13_Cassidy.jpg` → served as `/assets/roster/imgi_13_Cassidy.jpg`
