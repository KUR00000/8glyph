import React from 'react';

interface PixelCornersProps {
  color?: string;
  size?: number;   // arm length in px
  thick?: number;  // arm thickness in px
  className?: string;
}

/**
 * Renders 4 L-shaped pixel corner decorations inside a `position:relative` parent.
 * Usage: wrap your card/button with `relative overflow-visible` and put <PixelCorners /> inside.
 */
export function PixelCorners({ color = 'rgba(255,255,255,0.25)', size = 8, thick = 2, className = '' }: PixelCornersProps) {
  const corners = [
    { style: { top: 0, left: 0 } as React.CSSProperties, h: 'top', v: 'left' },
    { style: { top: 0, right: 0 } as React.CSSProperties, h: 'top', v: 'right' },
    { style: { bottom: 0, left: 0 } as React.CSSProperties, h: 'bottom', v: 'left' },
    { style: { bottom: 0, right: 0 } as React.CSSProperties, h: 'bottom', v: 'right' },
  ];

  return (
    <>
      {corners.map(({ style, h, v }, i) => (
        <span
          key={i}
          aria-hidden
          className={`absolute pointer-events-none z-20 ${className}`}
          style={style}
        >
          {/* Horizontal arm */}
          <span
            className="absolute block"
            style={{
              backgroundColor: color,
              width: size,
              height: thick,
              [h]: 0,
              [v]: 0,
            }}
          />
          {/* Vertical arm */}
          <span
            className="absolute block"
            style={{
              backgroundColor: color,
              width: thick,
              height: size,
              [h]: 0,
              [v]: 0,
            }}
          />
        </span>
      ))}
    </>
  );
}
