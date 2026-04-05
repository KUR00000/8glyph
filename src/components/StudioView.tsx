import React, { useState, useEffect } from 'react';
import { PixelIcon, AnimationType } from './PixelIcon';
import { Paintbrush, Eraser, RefreshCw, Palette } from 'lucide-react';

const PREDEFINED_PALETTES = [
  { name: 'Cyberpunk', c1: '#ff003c', c2: '#00f0ff' },
  { name: 'Vaporwave', c1: '#ff71ce', c2: '#01cdfe' },
  { name: 'Retro Game', c1: '#8b9bb4', c2: '#c0cbdc' },
  { name: 'Neon Forest', c1: '#39ff14', c2: '#00ff00' },
  { name: 'Sunset', c1: '#ff7a45', c2: '#ff004c' },
  { name: 'Ocean', c1: '#00c8ff', c2: '#0055ff' },
  { name: 'Gold', c1: '#ffd700', c2: '#ff8c00' },
  { name: 'Monochrome', c1: '#ffffff', c2: '#555555' },
];

export default function StudioView() {
  const [matrixSize, setMatrixSize] = useState(7);
  const [matrix, setMatrix] = useState<string[]>(Array(7).fill('0000000'));
  
  const [color1, setColor1] = useState('#ff7a45');
  const [color2, setColor2] = useState('#00c8ff');
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState<'draw' | 'erase'>('draw');
  const [animation, setAnimation] = useState<AnimationType>('glitch');

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [255, 255, 255];
  };

  const handleCellInteract = (row: number, col: number) => {
    setMatrix(prev => {
      const newMatrix = [...prev];
      const rowStr = newMatrix[row];
      const char = drawMode === 'draw' ? '1' : '0';
      newMatrix[row] = rowStr.substring(0, col) + char + rowStr.substring(col + 1);
      return newMatrix;
    });
  };

  const handlePointerDown = (row: number, col: number) => {
    setIsDrawing(true);
    handleCellInteract(row, col);
  };

  const handlePointerEnter = (row: number, col: number) => {
    if (isDrawing) {
      handleCellInteract(row, col);
    }
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  useEffect(() => {
    window.addEventListener('pointerup', handlePointerUp);
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, []);

  const clearGrid = () => {
    setMatrix(Array(matrixSize).fill('0'.repeat(matrixSize)));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 flex-1 w-full">
      {/* Page Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <div className="text-[9px] tracking-[0.2em] text-white/25 uppercase mb-1">Create</div>
          <h1 className="text-3xl font-bold tracking-tighter">Pixel Studio</h1>
        </div>
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/8 rounded-xl p-1">
          <button
            onClick={() => setDrawMode('draw')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all ${drawMode === 'draw' ? 'bg-[#ff7a45] text-black' : 'text-white/40 hover:text-white'}`}
          >
            <Paintbrush size={13} /> Draw
          </button>
          <button
            onClick={() => setDrawMode('erase')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all ${drawMode === 'erase' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
          >
            <Eraser size={13} /> Erase
          </button>
          <div className="w-px h-5 bg-white/10 mx-1" />
          <button
            onClick={clearGrid}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wider text-white/40 hover:text-white transition-colors"
          >
            <RefreshCw size={13} /> Clear
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Canvas + Grid Size */}
        <div className="flex flex-col items-center gap-5">
          {/* Grid Size Selector */}
          <div className="flex items-center gap-3 self-start">
            <span className="text-[9px] font-bold tracking-[0.15em] text-white/30 uppercase">Grid</span>
            <div className="flex gap-1.5">
              {[5, 7, 9].map(size => (
                <button
                  key={size}
                  onClick={() => {
                    setMatrixSize(size);
                    setMatrix(Array(size).fill('0'.repeat(size)));
                  }}
                  className={`w-9 h-9 text-[10px] tracking-widest font-bold rounded-lg transition-all ${matrixSize === size ? 'bg-white text-black' : 'bg-white/[0.04] border border-white/8 text-white/40 hover:text-white hover:border-white/20'}`}
                >
                  {size}²
                </button>
              ))}
            </div>
          </div>

          {/* Drawing Canvas */}
          <div
            className="bg-[#080808] border border-white/10 p-3 rounded-2xl shadow-2xl touch-none relative"
            onPointerLeave={handlePointerUp}
            style={{
              backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.02) 0%, transparent 70%)'
            }}
          >
            <div
              className="grid gap-1.5"
              style={{ gridTemplateColumns: `repeat(${matrixSize}, minmax(0, 1fr))` }}
            >
              {matrix.map((row, rIdx) =>
                row.split('').map((cell, cIdx) => (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    onPointerDown={() => handlePointerDown(rIdx, cIdx)}
                    onPointerEnter={() => handlePointerEnter(rIdx, cIdx)}
                    className={`w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg cursor-crosshair transition-all duration-75 ${
                      cell === '1'
                        ? 'shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                        : 'bg-white/[0.04] hover:bg-white/10 border border-white/5'
                    }`}
                    style={cell === '1' ? {
                      background: `linear-gradient(135deg, ${color1}, ${color2})`
                    } : {}}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Preview + Colors */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Live Preview */}
          <div
            className="bg-[#080808] border border-white/8 rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[220px]"
            style={{ background: `radial-gradient(ellipse at 50% 40%, rgba(${hexToRgb(color1)[0]},${hexToRgb(color1)[1]},${hexToRgb(color1)[2]},0.12) 0%, #080808 65%)` }}
          >
            <div className="absolute inset-0 opacity-[0.05]" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }} />
            <div className="text-[9px] tracking-[0.2em] text-white/20 uppercase mb-8 relative z-10">Preview</div>
            <div className="scale-[1.8] relative z-10 mb-10">
              <PixelIcon
                matrix={matrix}
                color1={hexToRgb(color1)}
                color2={hexToRgb(color2)}
                pixelSize={6}
                animationType={animation}
                animateOn="always"
              />
            </div>
            <div className="relative z-10 flex flex-wrap gap-1.5 justify-center">
              {(['glitch', 'bounce', 'disco', 'pulse', 'wave', 'flicker'] as AnimationType[]).map((anim) => (
                <button
                  key={anim}
                  onClick={() => setAnimation(anim)}
                  className={`px-3 py-1.5 text-[9px] tracking-widest font-bold rounded-lg uppercase transition-all ${animation === anim ? 'bg-[#ff7a45] text-black' : 'bg-white/[0.06] text-white/40 hover:text-white border border-white/5'}`}
                >
                  {anim}
                </button>
              ))}
            </div>
          </div>

          {/* Color Controls */}
          <div className="bg-[#080808] border border-white/8 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Palette size={14} className="text-[#ff7a45]" />
              <span className="text-[9px] font-bold tracking-[0.15em] text-white/40 uppercase">Colors</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Gradient Start', value: color1, setter: setColor1 },
                { label: 'Gradient End', value: color2, setter: setColor2 },
              ].map(({ label, value, setter }) => (
                <div key={label} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex items-center gap-3">
                  <label className="cursor-pointer relative">
                    <div
                      className="w-9 h-9 rounded-lg border-2 border-white/20 shadow-lg"
                      style={{ backgroundColor: value }}
                    />
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </label>
                  <div>
                    <div className="text-[9px] text-white/30 tracking-wider mb-0.5">{label}</div>
                    <div className="font-mono text-xs text-white/70">{value.toUpperCase()}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold tracking-[0.15em] text-white/25 uppercase mb-3">Palettes</div>
            <div className="grid grid-cols-4 gap-2">
              {PREDEFINED_PALETTES.map(palette => (
                <button
                  key={palette.name}
                  onClick={() => { setColor1(palette.c1); setColor2(palette.c2); }}
                  title={palette.name}
                  className={`group flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                    color1 === palette.c1 && color2 === palette.c2
                      ? 'border-white/30 bg-white/5'
                      : 'border-white/5 hover:border-white/20 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex w-full h-5 rounded-md overflow-hidden">
                    <div className="flex-1" style={{ backgroundColor: palette.c1 }} />
                    <div className="flex-1" style={{ backgroundColor: palette.c2 }} />
                  </div>
                  <span className="text-[8px] tracking-wide text-white/40 group-hover:text-white/60 transition-colors">{palette.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
