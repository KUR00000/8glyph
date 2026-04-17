import { motion } from 'motion/react';

const interpolate = (c1: number[], c2: number[], factor: number) => {
  // Non-linear interpolation (ease-in-out cubic) for more pronounced color steps
  const easedFactor = factor < 0.5 ? 4 * factor * factor * factor : 1 - Math.pow(-2 * factor + 2, 3) / 2;
  
  let r = Math.round(c1[0] + (c2[0] - c1[0]) * easedFactor);
  let g = Math.round(c1[1] + (c2[1] - c1[1]) * easedFactor);
  let b = Math.round(c1[2] + (c2[2] - c1[2]) * easedFactor);

  // Minimum contrast threshold: if the color is too dark, slightly boost it
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
  if (luminance < 40) {
    const boost = 40 - luminance;
    r = Math.min(255, r + boost);
    g = Math.min(255, g + boost);
    b = Math.min(255, b + boost);
  }

  return `rgb(${r}, ${g}, ${b})`;
};

export type AnimationType = 'wave' | 'flicker' | 'pulse' | 'disco' | 'bounce' | 'glitch' | 'none';

interface PixelIconProps {
  matrix: string[];
  color1: number[];
  color2: number[];
  pixelSize?: number;
  animationType?: AnimationType;
  animateOn?: 'hover' | 'always';
}

export const PixelIcon = ({ 
  matrix, 
  color1, 
  color2, 
  pixelSize = 6, 
  animationType = 'wave',
  animateOn = 'hover'
}: PixelIconProps) => {
  const height = matrix.length;
  const width = matrix[0].length;

  return (
    <motion.div
      className="grid gap-[1px]"
      style={{
        gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${height}, minmax(0, 1fr))`,
        width: `${width * pixelSize}px`,
        height: `${height * pixelSize}px`,
        willChange: 'transform',
      }}
      initial="initial"
      whileHover={animateOn === 'hover' ? "active" : undefined}
      animate={animateOn === 'always' ? "active" : "initial"}
    >
      {matrix.map((row, y) =>
        row.split('').map((cell, x) => {
          if (cell === '0') return <div key={`${x}-${y}-${animationType}`} className="bg-transparent" />;

          const factor = (x / width + y / height) / 2;
          const color = interpolate(color1, color2, factor);
          const distance = x + (height - y);

          // Vivid neon palette used for color-shifting animations
          // Cycling through these gives consistent beautiful results on any icon
          const neonCycle = [
            color,               // own base color first
            `rgb(255, 60, 120)`, // hot pink
            `rgb(255, 180, 0)`,  // amber
            `rgb(0, 230, 255)`,  // cyan
            `rgb(180, 0, 255)`,  // violet
            `rgb(0, 255, 120)`,  // mint
            color,               // return to base
          ];

          // A softer 3-step shift used for flicker spikes — stays closer to base
          const flickerShift = (base: string) => [
            base,
            `rgb(255, 255, 255)`,  // white flash
            base,
            `rgb(255, 80, 0)`,     // orange spike
            base,
            `rgb(0, 200, 255)`,    // cyan spike
            base,
          ];

          // Glitch uses a sharp 2-color swap (red/cyan split — classic CRT glitch)
          const glitchColors = [
            color,
            `rgb(255, 30, 80)`,   // red channel
            `rgb(0, 230, 255)`,   // cyan channel
            `rgb(255, 255, 255)`, // white spike
            color,
          ];

          let variants: any = {
            initial: { scale: 1, opacity: 1, backgroundColor: color },
            active:  { scale: 1, opacity: 1, backgroundColor: color },
          };
          
          if (animationType === 'wave') {
            variants.active = {
              scale: [1, 0.2, 1.2, 1],
              opacity: [1, 0.5, 1, 1],
              transition: {
                duration: 0.35,
                delay: distance * 0.02,
                ease: [0.4, 0, 0.2, 1],
                repeat: animateOn === 'always' ? Infinity : 0,
                repeatDelay: animateOn === 'always' ? 1.2 : 0
              }
            };
          } else if (animationType === 'flicker') {
            variants.active = {
              opacity:         [1, 0.05, 1, 1, 0.15, 1, 0.9, 1, 1, 1],
              backgroundColor: [
                color,
                `rgb(255, 255, 255)`,
                color,
                color,
                `rgb(255, 100, 0)`,
                color,
                `rgb(0, 200, 255)`,
                color,
                color,
                color,
              ],
              transition: {
                duration: 2.0,
                repeat: animateOn === 'always' ? Infinity : 0,
                times: [0, 0.05, 0.1, 0.4, 0.45, 0.5, 0.55, 0.6, 0.9, 1],
                ease: "linear",
                delay: (x % 3) * 0.03
              }
            };
          } else if (animationType === 'pulse') {
            variants.active = {
              scale: [1, 0.85, 1],
              opacity: [1, 0.6, 1],
              transition: {
                duration: 1.2,
                repeat: animateOn === 'always' ? Infinity : 0,
                ease: [0.4, 0, 0.2, 1],
                delay: distance * 0.03
              }
            };
          } else if (animationType === 'disco') {
            // Stagger the cycle start per pixel so pixels cycle out-of-phase — disco!
            const offset = (x + y) % neonCycle.length;
            const cycled = [
              ...neonCycle.slice(offset),
              ...neonCycle.slice(0, offset),
            ];
            variants.active = {
              backgroundColor: cycled,
              scale: [1, 1.08, 1, 1.08, 1],
              transition: {
                duration: 0.6,
                repeat: animateOn === 'always' ? Infinity : 0,
                ease: "linear",
                delay: ((x * y) % 7) * 0.03,
              }
            };
          } else if (animationType === 'bounce') {
            variants.active = {
              y: [0, -10, 0],
              scale: [1, 1.1, 1],
              transition: {
                duration: 0.6,
                repeat: animateOn === 'always' ? Infinity : 0,
                ease: [0.4, 0, 0.2, 1],
                delay: distance * 0.03
              }
            };
          } else if (animationType === 'glitch') {
            variants.active = {
              x: [0, -2, 2, -1, 1, 0],
              y: [0, 1, -1, 2, -2, 0],
              backgroundColor: glitchColors,
              scale: [1, 1.1, 0.9, 1.05, 1],
              transition: {
                duration: 0.3,
                repeat: animateOn === 'always' ? Infinity : 0,
                repeatDelay: animateOn === 'always' ? 1.5 : 0,
                ease: "linear",
                delay: (x % 2) * 0.06
              }
            };
          }

          // Retro charm: small % of pixels spark with a vivid color during 'always' mode
          const pseudoRandom = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
          const isFlickerPixel = animateOn === 'always' && pseudoRandom > 0.92;

          if (isFlickerPixel) {
            variants.active.backgroundColor = flickerShift(color);
            variants.active.opacity = [1, 0.25, 1, 0.85, 1, 0.9, 1];
            variants.active.transition = {
              ...variants.active.transition,
              duration: 1.2 + pseudoRandom * 1.5,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "linear",
            };
          }

          return (
            <motion.div
              key={`${x}-${y}-${animationType}`}
              className="w-full h-full rounded-[1px]"
              style={{ 
                backgroundColor: color,
                willChange: 'transform, opacity',
              }}
              variants={variants}
            />
          );
        })
      )}
    </motion.div>
  );
};
