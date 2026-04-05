<div align="center">

<br />

```
  ░█████╗░  ░██████╗░  ██╗░░░░░  ██╗░░░██╗  ██████╗░  ██╗  ░░███╗░░
  ██╔══██╗  ██╔════╝░  ██║░░░░░  ╚██╗░██╔╝  ██╔══██╗  ██║  ░████║░░
  ╚█████╔╝  ██║░░██╗░  ██║░░░░░  ░╚████╔╝░  ██████╔╝  ██║  ██╔██║░░
  ██╔══██╗  ██║░░╚██╗  ██║░░░░░  ░░╚██╔╝░░  ██╔═══╝░  ██║  ╚═╝██║░░
  ╚█████╔╝  ╚██████╔╝  ███████╗  ░░░██║░░░  ██║░░░░░  ██║  ███████╗
  ░╚════╝░  ░╚═════╝░  ╚══════╝  ░░░╚═╝░░░  ╚═╝░░░░░  ╚═╝  ╚══════╝
```

**Animated pixel icons for React — with unique per-icon hover animations.**

[![GitHub stars](https://img.shields.io/github/stars/thor-op/8glyph?style=flat-square&color=ff7a45&labelColor=0a0a0a&logo=github)](https://github.com/thor-op/8glyph/stargazers)
[![MIT License](https://img.shields.io/badge/license-MIT-00c8ff?style=flat-square&labelColor=0a0a0a)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&labelColor=0a0a0a&logo=react)](https://react.dev)
[![Motion](https://img.shields.io/badge/Motion-12-a855f7?style=flat-square&labelColor=0a0a0a)](https://motion.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&labelColor=0a0a0a&logo=typescript)](https://typescriptlang.org)
[![Zero extra deps](https://img.shields.io/badge/extra_deps-0-00e87a?style=flat-square&labelColor=0a0a0a)](package.json)

<br />

> Retro-style pixel icons with 6 animation types, 100+ icons across 6 categories,  
> and one-click copy of React-ready code. Zero dependencies beyond Motion.

<br />

</div>

---

## ✦ Features

- **100+ pixel icons** across 6 categories — Numbers, Common, Fun, Weather, Tech, Dev/Brand
- **6 animation types** — `wave`, `flicker`, `pulse`, `disco`, `glitch`, `none`
- **Per-icon custom animations** — every icon ships with a hand-picked default animation
- **Hover or always-on** trigger mode
- **Vivid neon color cycling** on color-shifting animations
- **Copy React code** in one click — paste directly into any project
- **Zero extra dependencies** — only needs `motion` (Framer Motion)
- **Pixel-art aesthetic** — hard edges, L-corner decorations, scanline dot background
- **Fully typed** TypeScript API
- **Responsive** — works on all screen sizes

---

## ⚡ Quick Start

### 1 — Install Motion

```bash
npm install motion
```

### 2 — Copy `PixelIcon.tsx`

Grab [`src/components/PixelIcon.tsx`](src/components/PixelIcon.tsx) and drop it anywhere in your project. It is fully self-contained — no other files needed.

### 3 — Use it

```tsx
import { PixelIcon } from './PixelIcon';

<PixelIcon
  matrix={[
    '0110110',
    '1111111',
    '1111111',
    '0111110',
    '0011100',
    '0001000',
  ]}
  color1={[255, 30, 80]}
  color2={[255, 130, 0]}
  pixelSize={6}
  animationType="pulse"
  animateOn="hover"
/>
```

That's it. No imports, no setup, no config.

---

## 🎛 Props Reference

| Prop | Type | Default | Description |
|---|---|---|---|
| `matrix` | `string[]` | **required** | Array of row strings. `"1"` = filled pixel, `"0"` = empty. |
| `color1` | `number[]` | **required** | Gradient start colour as `[R, G, B]`. |
| `color2` | `number[]` | **required** | Gradient end colour as `[R, G, B]`. |
| `pixelSize` | `number` | `6` | Size of each pixel square in px. |
| `animationType` | `'wave' \| 'flicker' \| 'pulse' \| 'disco' \| 'glitch' \| 'none'` | `'wave'` | Which animation plays. |
| `animateOn` | `'hover' \| 'always'` | `'hover'` | Trigger: on mouse-enter or continuous. |

---

## 🎨 Animations

| Type | Effect | Best for |
|---|---|---|
| `wave` | Pixels collapse and bounce back in a diagonal wave | Arrows, directional icons |
| `flicker` | CRT-style random opacity drops + colour spikes | Stars, lightning, fire |
| `pulse` | Smooth scale breathe in/out | Hearts, bells, status icons |
| `disco` | Neon colour cycling — each pixel offset for scatter effect | Coins, gems, party icons |
| `glitch` | Red/cyan RGB-split jitter + position shake | Rockets, terminals, glitch art |
| `none` | Static — no animation | Decorative use, filter UI |

---

## 🗂 Icon Categories

| Category | Count | Examples |
|---|---|---|
| `numbers` | 10 | `00` – `09` pixel digits |
| `common` | 24 | `heart`, `star`, `lock`, `bell`, `search`… |
| `fun` | 34 | `ghost`, `alien`, `dragon`, `wizard`, `ufo`, `mushroom`… |
| `weather` | 14 | `sun`, `moon`, `flame`, `snowflake`, `galaxy`… |
| `tech` | 9 | `laptop`, `wifi`, `chip`, `gamepad`, `signal`… |
| `dev` | 15 | `github`, `react`, `docker`, `terminal`, `git`, `npm`… |
| `food` | 8 | `apple`, `pizza`, `donut`, `sushi`, `taco`… |

---

## 🖥 Run Locally

**Prerequisites:** Node.js ≥ 18

```bash
# Clone the repo
git clone https://github.com/thor-op/8glyph.git
cd 8glyph

# Install dependencies
npm install

# Start dev server at http://localhost:3000
npm run dev
```

### Other scripts

```bash
npm run build    # Production build → dist/
npm run preview  # Preview the production build
npm run lint     # TypeScript type check
```

---

## 🏗 Project Structure

```
8glyph/
├── src/
│   ├── App.tsx                  # Main app, icon data, all UI components
│   ├── components/
│   │   ├── PixelIcon.tsx        # ← The component you copy into your project
│   │   └── PixelCorners.tsx     # L-shaped pixel corner decorations
│   ├── main.tsx
│   └── index.css                # Global styles, pixel dot bg, scrollbar
├── index.html
├── vite.config.ts
└── package.json
```

---

## 🧱 Building Your Own Icon

A matrix is just an array of equal-length strings. `1` = filled, `0` = empty.

```tsx
// 7×7 custom star
const myIcon = {
  matrix: [
    '0001000',
    '0001000',
    '1111111',
    '0111110',
    '0011100',
    '0101010',
    '1000001',
  ],
  color1: [255, 200, 0],   // gold
  color2: [255, 80, 0],    // orange
};

<PixelIcon {...myIcon} pixelSize={8} animationType="disco" animateOn="hover" />
```

Tips:
- Odd-sized matrices (7×7, 9×9) look most natural
- `color1` maps to the top-left corner, `color2` to the bottom-right
- Use `pixelSize={4}` for small icons, `pixelSize={8}` for hero/display use

---

## 🤝 Contributing

Contributions welcome! To add icons:

1. Fork the repo
2. Add your icon(s) to the `iconsData` array in `src/App.tsx`
3. Follow the existing format: `{ id, matrix, color1, color2, category, defaultAnimation }`
4. Open a pull request

---

## 📄 License

MIT © [thor-op](https://github.com/thor-op)

---

<div align="center">

**If 8Glyph saves you time, drop a ⭐ on the repo — it means a lot.**

[![Star on GitHub](https://img.shields.io/github/stars/thor-op/8glyph?style=for-the-badge&color=ff7a45&labelColor=0a0a0a&logo=github&label=Star%208Glyph)](https://github.com/thor-op/8glyph)

</div>
