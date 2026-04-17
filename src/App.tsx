import React, { useState, useCallback } from 'react';
import { PixelIcon, AnimationType } from './components/PixelIcon';
import { Search, Sparkles, CheckCircle2, X, Activity, Zap, Radio, Square, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';

// Helper function to show toasts
function fireToast(message: string, type: 'success' | 'error' | 'info' = 'success', icon?: string) {
  if (type === 'success') {
    toast.success(message, { icon: icon || '✓' });
  } else if (type === 'error') {
    toast.error(message, { icon: icon || '✕' });
  } else {
    toast(message, { icon: icon || 'ℹ' });
  }
}

const iconsData: { id: string, matrix: string[], color1: number[], color2: number[], category: string, defaultAnimation: AnimationType }[] = [
  // ── Numbers ──────────────────────────────────────────────────────────────
  { id: '00', matrix: ['01111110', '11000011', '11000011', '11000011', '11000011', '11000011', '11000011', '01111110'], color1: [255, 80, 0], color2: [255, 200, 0], category: 'numbers', defaultAnimation: 'wave' },
  { id: '01', matrix: ['00011000', '00111000', '01011000', '00011000', '00011000', '00011000', '00011000', '01111110'], color1: [0, 120, 255], color2: [0, 220, 255], category: 'numbers', defaultAnimation: 'wave' },
  { id: '02', matrix: ['01111110', '11000011', '00000011', '00000110', '00011100', '00110000', '01100000', '11111111'], color1: [200, 0, 255], color2: [0, 200, 255], category: 'numbers', defaultAnimation: 'wave' },
  { id: '03', matrix: ['01111110', '11000011', '00000011', '00011110', '00000011', '00000011', '11000011', '01111110'], color1: [0, 220, 255], color2: [255, 0, 220], category: 'numbers', defaultAnimation: 'wave' },
  { id: '04', matrix: ['00000110', '00001110', '00011010', '00110010', '01100010', '11111111', '00000010', '00000010'], color1: [255, 50, 50], color2: [255, 220, 0], category: 'numbers', defaultAnimation: 'wave' },
  { id: '05', matrix: ['11111111', '11000000', '11000000', '11111110', '00000011', '00000011', '11000011', '01111110'], color1: [0, 230, 100], color2: [100, 255, 50], category: 'numbers', defaultAnimation: 'wave' },
  { id: '06', matrix: ['00111110', '01100000', '11000000', '11111110', '11000011', '11000011', '11000011', '01111110'], color1: [150, 0, 255], color2: [0, 180, 255], category: 'numbers', defaultAnimation: 'wave' },
  { id: '07', matrix: ['11111111', '00000011', '00000110', '00001100', '00011000', '00110000', '00110000', '00110000'], color1: [255, 0, 180], color2: [255, 255, 255], category: 'numbers', defaultAnimation: 'wave' },
  { id: '08', matrix: ['01111110', '11000011', '11000011', '01111110', '11000011', '11000011', '11000011', '01111110'], color1: [255, 150, 0], color2: [255, 255, 0], category: 'numbers', defaultAnimation: 'wave' },
  { id: '09', matrix: ['01111110', '11000011', '11000011', '11000011', '01111111', '00000011', '00000110', '01111100'], color1: [255, 0, 100], color2: [255, 180, 0], category: 'numbers', defaultAnimation: 'wave' },

  // ── Common ────────────────────────────────────────────────────────────────
  { id: 'heart', matrix: ['0110110', '1111111', '1111111', '1111111', '0111110', '0011100', '0001000'], color1: [255, 30, 80], color2: [255, 130, 0], category: 'common', defaultAnimation: 'pulse' },
  { id: 'star', matrix: ['0001000', '0001000', '1111111', '0111110', '0011100', '0101010', '1000001'], color1: [255, 210, 0], color2: [255, 110, 0], category: 'common', defaultAnimation: 'disco' },
  { id: 'home', matrix: ['0001000', '0011100', '0111110', '1111111', '1100011', '1101101', '1111111'], color1: [0, 180, 255], color2: [0, 60, 255], category: 'common', defaultAnimation: 'wave' },
  { id: 'arrowUp', matrix: ['0001000', '0011100', '0111110', '1111111', '0001000', '0001000', '0001000'], color1: [180, 0, 255], color2: [0, 255, 220], category: 'common', defaultAnimation: 'wave' },
  { id: 'arrowRight', matrix: ['0010000', '0011000', '0011100', '0011110', '0011100', '0011000', '0010000'], color1: [180, 0, 255], color2: [0, 255, 220], category: 'common', defaultAnimation: 'wave' },
  { id: 'play', matrix: ['1000000', '1100000', '1110000', '1111000', '1111100', '1111000', '1110000', '1100000', '1000000'], color1: [0, 230, 100], color2: [0, 100, 60], category: 'common', defaultAnimation: 'pulse' },
  { id: 'user', matrix: ['0011100', '0111110', '0111110', '0011100', '0111110', '1111111', '1111111'], color1: [0, 230, 150], color2: [0, 150, 255], category: 'common', defaultAnimation: 'wave' },
  { id: 'settings', matrix: ['0010100', '1111111', '0111110', '1100011', '0111110', '1111111', '0010100'], color1: [160, 160, 160], color2: [255, 255, 255], category: 'common', defaultAnimation: 'wave' },
  { id: 'mail', matrix: ['1111111', '1100011', '1010101', '1001001', '1000001', '1000001', '1111111'], color1: [255, 80, 80], color2: [255, 0, 120], category: 'common', defaultAnimation: 'wave' },
  { id: 'lock', matrix: ['0011100', '0100010', '0100010', '1111111', '1101011', '1101011', '1111111'], color1: [255, 210, 0], color2: [255, 110, 0], category: 'common', defaultAnimation: 'wave' },
  { id: 'unlock', matrix: ['0011100', '0100010', '0100000', '1111111', '1101011', '1101011', '1111111'], color1: [0, 230, 100], color2: [0, 180, 255], category: 'common', defaultAnimation: 'wave' },
  { id: 'lightning', matrix: ['0011100', '0111000', '1111110', '0111110', '0011100', '0001000', '0011000'], color1: [255, 240, 0], color2: [255, 140, 0], category: 'common', defaultAnimation: 'flicker' },
  { id: 'check', matrix: ['0000001', '0000011', '0000111', '0001110', '1101100', '1111000', '0110000'], color1: [0, 230, 80], color2: [0, 180, 0], category: 'common', defaultAnimation: 'pulse' },
  { id: 'cross', matrix: ['1100011', '0110110', '0011100', '0001000', '0011100', '0110110', '1100011'], color1: [255, 50, 50], color2: [180, 0, 0], category: 'common', defaultAnimation: 'flicker' },
  { id: 'key', matrix: ['0111100', '1100110', '1100110', '0111100', '0100000', '0111000', '0100000'], color1: [255, 210, 0], color2: [255, 110, 0], category: 'common', defaultAnimation: 'wave' },
  { id: 'bell', matrix: ['0001000', '0011100', '0111110', '0111110', '1111111', '1111111', '0001000'], color1: [255, 240, 0], color2: [255, 150, 0], category: 'common', defaultAnimation: 'wave' },
  { id: 'flag', matrix: ['1111110', '1111110', '1111100', '1110000', '1000000', '1000000', '1000000'], color1: [255, 60, 60], color2: [255, 255, 255], category: 'common', defaultAnimation: 'wave' },
  { id: 'book', matrix: ['0111110', '1111111', '1011011', '1111111', '1011011', '1111111', '0111110'], color1: [210, 140, 60], color2: [140, 70, 20], category: 'common', defaultAnimation: 'wave' },
  { id: 'map', matrix: ['1000001', '1100011', '1110111', '1111111', '0111110', '0011100', '0001000'], color1: [0, 200, 100], color2: [0, 100, 255], category: 'common', defaultAnimation: 'wave' },
  { id: 'search', matrix: ['0111110', '1000001', '1011001', '1011001', '1000001', '0111110', '0000111'], color1: [200, 200, 200], color2: [255, 255, 255], category: 'common', defaultAnimation: 'wave' },
  { id: 'share', matrix: ['0000110', '0001110', '0011110', '0111110', '0001110', '0001110', '0000110'], color1: [0, 180, 255], color2: [0, 80, 255], category: 'common', defaultAnimation: 'wave' },
  { id: 'trash', matrix: ['1111111', '0111110', '0100010', '0100010', '0111110', '0100010', '0111110'], color1: [255, 80, 80], color2: [180, 0, 0], category: 'common', defaultAnimation: 'wave' },
  { id: 'edit', matrix: ['0000011', '0000111', '0001110', '0011100', '0111000', '1110010', '1100011'], color1: [0, 200, 255], color2: [0, 80, 255], category: 'common', defaultAnimation: 'wave' },

  // ── Fun / Game ────────────────────────────────────────────────────────────
  { id: 'sword', matrix: ['0000011', '0000111', '0001100', '0011000', '0110000', '1101000', '1000000'], color1: [200, 210, 230], color2: [120, 140, 255], category: 'fun', defaultAnimation: 'wave' },
  { id: 'potion', matrix: ['0001000', '0011100', '0011100', '0111110', '1111111', '1111111', '0111110'], color1: [255, 0, 200], color2: [120, 0, 255], category: 'fun', defaultAnimation: 'pulse' },
  { id: 'ghost', matrix: ['0111110', '1111111', '1010101', '1111111', '1111111', '1010101', '1010101'], color1: [210, 210, 255], color2: [255, 255, 255], category: 'fun', defaultAnimation: 'flicker' },
  { id: 'alien', matrix: ['0111110', '1111111', '1011101', '1111111', '0111110', '0101010', '1000001'], color1: [0, 255, 120], color2: [0, 180, 80], category: 'fun', defaultAnimation: 'disco' },
  { id: 'skull', matrix: ['0111110', '1111111', '1010101', '1111111', '0111110', '0101010', '0111110'], color1: [240, 240, 240], color2: [150, 150, 160], category: 'fun', defaultAnimation: 'flicker' },
  { id: 'shield', matrix: ['1111111', '1111111', '1111111', '0111110', '0111110', '0011100', '0001000'], color1: [0, 160, 255], color2: [0, 60, 255], category: 'fun', defaultAnimation: 'pulse' },
  { id: 'rocket', matrix: ['0001000', '0011100', '0111110', '1111111', '0111110', '0101010', '0010100'], color1: [255, 110, 0], color2: [255, 240, 0], category: 'fun', defaultAnimation: 'glitch' },
  { id: 'diamond', matrix: ['0001000', '0011100', '0111110', '1111111', '0111110', '0011100', '0001000'], color1: [0, 240, 255], color2: [0, 100, 255], category: 'fun', defaultAnimation: 'disco' },
  { id: 'bomb', matrix: ['0001100', '0011100', '0111110', '1111111', '1111111', '0111110', '0011100'], color1: [120, 120, 130], color2: [255, 60, 60], category: 'fun', defaultAnimation: 'pulse' },
  { id: 'crown', matrix: ['1000001', '1000001', '1010101', '1111111', '1111111', '1111111', '0111110'], color1: [255, 215, 0], color2: [220, 160, 30], category: 'fun', defaultAnimation: 'disco' },
  { id: 'trophy', matrix: ['1111111', '1111111', '0111110', '0011100', '0011100', '0111110', '1111111'], color1: [255, 215, 0], color2: [255, 140, 0], category: 'fun', defaultAnimation: 'pulse' },
  { id: 'target', matrix: ['0011100', '0111110', '1100011', '1011101', '1100011', '0111110', '0011100'], color1: [255, 60, 60], color2: [200, 0, 0], category: 'fun', defaultAnimation: 'pulse' },
  { id: 'music', matrix: ['0001110', '0001100', '0001000', '0001000', '0111001', '1111011', '0110011'], color1: [255, 0, 150], color2: [0, 200, 255], category: 'fun', defaultAnimation: 'disco' },
  { id: 'car', matrix: ['0011110', '0111111', '1111111', '1111111', '0100010', '0100010', '0000000'], color1: [0, 160, 255], color2: [0, 60, 255], category: 'fun', defaultAnimation: 'wave' },
  { id: 'coin', matrix: ['0111110', '1111111', '1100011', '1011101', '1100011', '1111111', '0111110'], color1: [255, 215, 0], color2: [255, 140, 0], category: 'fun', defaultAnimation: 'disco' },
  { id: 'gem', matrix: ['0110110', '1111111', '1111111', '0111110', '0011100', '0001000', '0000000'], color1: [0, 240, 255], color2: [180, 0, 255], category: 'fun', defaultAnimation: 'disco' },
  { id: 'map_pin', matrix: ['0011100', '0111110', '1111111', '1111111', '0111110', '0011100', '0001000'], color1: [255, 60, 80], color2: [255, 0, 150], category: 'fun', defaultAnimation: 'pulse' },
  { id: 'controller', matrix: ['0111110', '1111111', '1010101', '1101011', '1111111', '1111111', '0111110'], color1: [0, 230, 100], color2: [255, 0, 200], category: 'fun', defaultAnimation: 'disco' },
  { id: 'chess', matrix: ['0101010', '1111111', '0101010', '1010101', '0101010', '1111111', '0101010'], color1: [255, 255, 255], color2: [100, 100, 100], category: 'fun', defaultAnimation: 'wave' },
  { id: 'pacman', matrix: ['0111110', '1111111', '1111110', '1110000', '1111110', '1111111', '0111110'], color1: [255, 230, 0], color2: [255, 150, 0], category: 'fun', defaultAnimation: 'disco' },

  // ── Weather ───────────────────────────────────────────────────────────────
  { id: 'sun', matrix: ['1001001', '0101010', '0011100', '1111111', '0011100', '0101010', '1001001'], color1: [255, 210, 0], color2: [255, 110, 0], category: 'weather', defaultAnimation: 'pulse' },
  { id: 'moon', matrix: ['0011100', '0111000', '1110000', '1100000', '1110000', '0111000', '0011100'], color1: [120, 160, 255], color2: [210, 210, 255], category: 'weather', defaultAnimation: 'wave' },
  { id: 'cloud', matrix: ['0011100', '0111110', '1111111', '1111111', '1111111', '0000000', '0000000'], color1: [200, 200, 210], color2: [255, 255, 255], category: 'weather', defaultAnimation: 'wave' },
  { id: 'flame', matrix: ['0001000', '0011100', '0111110', '1111111', '1111110', '0111100', '0011000'], color1: [255, 110, 0], color2: [255, 30, 0], category: 'weather', defaultAnimation: 'flicker' },
  { id: 'droplet', matrix: ['0001000', '0011100', '0111110', '1111111', '1111111', '0111110', '0011000'], color1: [0, 210, 255], color2: [0, 100, 255], category: 'weather', defaultAnimation: 'wave' },
  { id: 'leaf', matrix: ['0000100', '0001110', '0011111', '0111110', '1111100', '1110000', '1000000'], color1: [60, 210, 60], color2: [0, 140, 0], category: 'weather', defaultAnimation: 'wave' },
  { id: 'tree', matrix: ['0001000', '0011100', '0111110', '1111111', '0011100', '0011100', '0011100'], color1: [0, 200, 80], color2: [140, 70, 20], category: 'weather', defaultAnimation: 'wave' },
  { id: 'snowflake', matrix: ['1001001', '0111110', '1111111', '1111111', '1111111', '0111110', '1001001'], color1: [180, 220, 255], color2: [255, 255, 255], category: 'weather', defaultAnimation: 'disco' },
  { id: 'wind', matrix: ['0111110', '1000000', '0111100', '0000000', '0111100', '0000001', '0111110'], color1: [160, 200, 255], color2: [220, 240, 255], category: 'weather', defaultAnimation: 'wave' },
  { id: 'lightning2', matrix: ['0001110', '0011100', '0111000', '1111110', '0001100', '0011000', '0010000'], color1: [255, 255, 100], color2: [255, 180, 0], category: 'weather', defaultAnimation: 'flicker' },

  // ── Food ──────────────────────────────────────────────────────────────────
  { id: 'coffee', matrix: ['0010100', '0010100', '0111110', '0111111', '0111110', '0011100', '0011100'], color1: [150, 80, 20], color2: [210, 140, 60], category: 'food', defaultAnimation: 'wave' },
  { id: 'apple', matrix: ['0001000', '0010100', '0111110', '1111111', '1111111', '1111111', '0111110'], color1: [255, 60, 60], color2: [200, 0, 0], category: 'food', defaultAnimation: 'pulse' },
  { id: 'pizza', matrix: ['0001000', '0011100', '0111110', '1111111', '1011011', '1100011', '1000001'], color1: [255, 160, 0], color2: [255, 60, 0], category: 'food', defaultAnimation: 'pulse' },
  { id: 'burger', matrix: ['0111110', '1111111', '0000000', '0111110', '1111111', '0000000', '0111110'], color1: [210, 130, 60], color2: [255, 180, 0], category: 'food', defaultAnimation: 'wave' },

  // ── Tech ──────────────────────────────────────────────────────────────────
  { id: 'laptop', matrix: ['000000000', '011111110', '010101010', '011111110', '000000000', '011111110', '111111111'], color1: [160, 160, 170], color2: [220, 220, 230], category: 'tech', defaultAnimation: 'flicker' },
  { id: 'smartphone', matrix: ['01110', '11111', '10001', '11011', '11011', '11111', '01110'], color1: [100, 100, 120], color2: [200, 200, 220], category: 'tech', defaultAnimation: 'flicker' },
  { id: 'wifi', matrix: ['0000000', '0111110', '1000001', '0011100', '0100010', '0001000', '0001000'], color1: [0, 200, 255], color2: [0, 100, 255], category: 'tech', defaultAnimation: 'pulse' },
  { id: 'battery', matrix: ['0111111', '1100011', '1011101', '1100011', '0111111'], color1: [0, 230, 100], color2: [0, 160, 60], category: 'tech', defaultAnimation: 'pulse' },
  { id: 'gamepad', matrix: ['0111110', '1111111', '1010101', '1111111', '1111111', '0110110', '0000000'], color1: [0, 230, 100], color2: [255, 0, 200], category: 'tech', defaultAnimation: 'disco' },
  { id: 'camera', matrix: ['0111100', '1111111', '1011101', '1111111', '1011101', '1111111', '0111100'], color1: [255, 200, 0], color2: [255, 60, 60], category: 'tech', defaultAnimation: 'flicker' },
  { id: 'cursor', matrix: ['1000000', '1100000', '1110000', '1111000', '1111100', '1110000', '1100100'], color1: [255, 255, 255], color2: [180, 180, 255], category: 'tech', defaultAnimation: 'wave' },
  { id: 'chip', matrix: ['0101010', '1111111', '0101010', '1111111', '0101010', '1111111', '0101010'], color1: [0, 200, 100], color2: [0, 100, 255], category: 'tech', defaultAnimation: 'disco' },
  { id: 'signal', matrix: ['0000001', '0000011', '0000111', '0001111', '0011111', '0111111', '1111111'], color1: [0, 220, 100], color2: [0, 120, 255], category: 'tech', defaultAnimation: 'pulse' },

  // ── Extra Fun / Crazy ─────────────────────────────────────────────────────
  { id: 'dragon', matrix: ['1000010', '1100110', '1111110', '0111100', '1111110', '1101011', '1000001'], color1: [255, 40, 0], color2: [255, 180, 0], category: 'fun', defaultAnimation: 'glitch' },
  { id: 'wizard', matrix: ['0001000', '0011100', '0111110', '0011100', '0111110', '1111111', '0110110'], color1: [180, 0, 255], color2: [0, 200, 255], category: 'fun', defaultAnimation: 'disco' },
  { id: 'ufo', matrix: ['0011100', '0111110', '1111111', '0111110', '0011100', '0001000', '0001000'], color1: [0, 255, 200], color2: [0, 100, 255], category: 'fun', defaultAnimation: 'glitch' },
  { id: 'fire_skull', matrix: ['0111110', '1111111', '1010101', '1111111', '0111110', '0101010', '0111110'], color1: [255, 50, 0], color2: [255, 200, 0], category: 'fun', defaultAnimation: 'flicker' },
  { id: 'spider', matrix: ['1010101', '0111110', '1111111', '0111110', '1111111', '0111110', '1010101'], color1: [200, 0, 255], color2: [100, 0, 180], category: 'fun', defaultAnimation: 'pulse' },
  { id: 'ninja', matrix: ['0011100', '0111110', '0011100', '1111111', '0011100', '0101010', '1000001'], color1: [40, 40, 60], color2: [150, 0, 255], category: 'fun', defaultAnimation: 'glitch' },
  { id: 'robot', matrix: ['0111110', '1010101', '1111111', '0111110', '1111111', '1010101', '0101010'], color1: [100, 200, 255], color2: [0, 80, 200], category: 'fun', defaultAnimation: 'disco' },
  { id: 'eye', matrix: ['0000000', '0111110', '1111111', '1011101', '1111111', '0111110', '0000000'], color1: [0, 220, 255], color2: [255, 0, 100], category: 'fun', defaultAnimation: 'pulse' },
  { id: 'tornado', matrix: ['1111111', '0111110', '0011100', '0111100', '1111110', '0111000', '0001000'], color1: [180, 200, 255], color2: [80, 100, 200], category: 'fun', defaultAnimation: 'glitch' },
  { id: 'virus', matrix: ['0101010', '1010101', '0111110', '1111111', '0111110', '1010101', '0101010'], color1: [0, 255, 100], color2: [0, 180, 50], category: 'fun', defaultAnimation: 'disco' },
  { id: 'laser', matrix: ['0000001', '0000011', '1111111', '1111111', '1111111', '0000011', '0000001'], color1: [255, 0, 80], color2: [255, 200, 0], category: 'fun', defaultAnimation: 'glitch' },
  { id: 'cactus', matrix: ['0010100', '0111110', '0010100', '1110111', '0010100', '0011100', '0111110'], color1: [0, 200, 80], color2: [0, 120, 40], category: 'fun', defaultAnimation: 'wave' },
  { id: 'mushroom', matrix: ['0111110', '1111111', '1111111', '0111110', '0011100', '0111110', '0011100'], color1: [255, 60, 60], color2: [255, 255, 255], category: 'fun', defaultAnimation: 'pulse' },
  { id: 'portal', matrix: ['0111110', '1111111', '1011101', '1000001', '1011101', '1111111', '0111110'], color1: [100, 0, 255], color2: [0, 200, 255], category: 'fun', defaultAnimation: 'disco' },
  { id: 'katana', matrix: ['0000001', '0000011', '0000110', '0001100', '0011000', '0110000', '1100000'], color1: [200, 220, 255], color2: [255, 50, 50], category: 'fun', defaultAnimation: 'glitch' },

  // ── Extra Weather ─────────────────────────────────────────────────────────
  { id: 'rainbow', matrix: ['0111110', '1000001', '1011101', '1011101', '0111110', '0000000', '0000000'], color1: [255, 100, 0], color2: [100, 0, 255], category: 'weather', defaultAnimation: 'disco' },
  { id: 'aurora', matrix: ['1010101', '0101010', '1111111', '0101010', '1010101', '0000000', '0000000'], color1: [0, 255, 150], color2: [100, 0, 255], category: 'weather', defaultAnimation: 'disco' },
  { id: 'meteor', matrix: ['0000001', '0000110', '0011000', '0110000', '1111000', '0111000', '0010000'], color1: [255, 150, 0], color2: [255, 50, 0], category: 'weather', defaultAnimation: 'glitch' },
  { id: 'galaxy', matrix: ['0101010', '1010101', '0111110', '1111111', '0111110', '1010101', '0101010'], color1: [150, 0, 255], color2: [0, 200, 255], category: 'weather', defaultAnimation: 'disco' },

  // ── Extra Food ────────────────────────────────────────────────────────────
  { id: 'ice_cream', matrix: ['0011100', '0111110', '0111110', '0011100', '0001000', '0001000', '0111110'], color1: [255, 180, 220], color2: [200, 100, 255], category: 'food', defaultAnimation: 'pulse' },
  { id: 'donut', matrix: ['0111110', '1111111', '1100011', '1011101', '1100011', '1111111', '0111110'], color1: [255, 150, 80], color2: [255, 80, 150], category: 'food', defaultAnimation: 'disco' },
  { id: 'sushi', matrix: ['0000000', '0111110', '1111111', '1011101', '1111111', '0111110', '0000000'], color1: [255, 80, 80], color2: [255, 220, 180], category: 'food', defaultAnimation: 'wave' },
  { id: 'taco', matrix: ['0001000', '0011100', '0111110', '1111111', '1111111', '1111111', '0000000'], color1: [255, 180, 0], color2: [255, 80, 0], category: 'food', defaultAnimation: 'wave' },

  // ── Dev / Brand ───────────────────────────────────────────────────────────
  { id: 'github', matrix: ['0111110', '1100011', '1101011', '1100001', '1100001', '1100011', '0111110'], color1: [200, 200, 210], color2: [255, 255, 255], category: 'dev', defaultAnimation: 'pulse' },
  { id: 'apple', matrix: ['0011100', '0111110', '1111111', '1111111', '1111110', '0111100', '0011000'], color1: [200, 200, 200], color2: [255, 255, 255], category: 'dev', defaultAnimation: 'wave' },
  { id: 'react', matrix: ['0001000', '1101011', '0111110', '1111111', '0111110', '1101011', '0001000'], color1: [0, 210, 255], color2: [0, 120, 200], category: 'dev', defaultAnimation: 'disco' },
  { id: 'vscode', matrix: ['0100001', '0110011', '0111111', '0101010', '0111111', '0110011', '0100001'], color1: [0, 130, 220], color2: [0, 200, 255], category: 'dev', defaultAnimation: 'flicker' },
  { id: 'terminal', matrix: ['1111111', '1000000', '1011000', '1001100', '1011000', '1000000', '1111111'], color1: [0, 230, 100], color2: [0, 180, 60], category: 'dev', defaultAnimation: 'glitch' },
  { id: 'database', matrix: ['0111110', '1111111', '1111111', '0111110', '1111111', '1111111', '0111110'], color1: [0, 180, 255], color2: [0, 80, 200], category: 'dev', defaultAnimation: 'wave' },
  { id: 'git', matrix: ['0011100', '0111110', '0100010', '1100001', '0100011', '0111110', '0011100'], color1: [255, 80, 50], color2: [255, 160, 0], category: 'dev', defaultAnimation: 'pulse' },
  { id: 'docker', matrix: ['0000000', '0110110', '0110110', '1111111', '0111110', '0011100', '0001000'], color1: [0, 160, 230], color2: [0, 220, 255], category: 'dev', defaultAnimation: 'wave' },
  { id: 'npm', matrix: ['1111111', '1000001', '1011101', '1011101', '1000001', '1000001', '1111111'], color1: [200, 0, 0], color2: [255, 60, 60], category: 'dev', defaultAnimation: 'pulse' },
  { id: 'figma', matrix: ['0111110', '0111110', '0111110', '0111110', '0011100', '0011100', '0011100'], color1: [255, 100, 60], color2: [180, 0, 255], category: 'dev', defaultAnimation: 'disco' },
  { id: 'python', matrix: ['0111100', '1100010', '1111110', '1111110', '0100011', '0011110', '0000000'], color1: [60, 130, 200], color2: [255, 210, 50], category: 'dev', defaultAnimation: 'wave' },
  { id: 'chrome', matrix: ['0011100', '0111110', '1110011', '1101111', '1110011', '0111110', '0011100'], color1: [255, 80, 60], color2: [0, 200, 100], category: 'dev', defaultAnimation: 'disco' },
  { id: 'code', matrix: ['0001100', '0011000', '0110000', '1100000', '0110000', '0011000', '0001100'], color1: [150, 100, 255], color2: [0, 200, 255], category: 'dev', defaultAnimation: 'glitch' },
  { id: 'api', matrix: ['1111110', '0001000', '0001000', '0111100', '0001000', '0001000', '1111110'], color1: [0, 220, 180], color2: [0, 120, 255], category: 'dev', defaultAnimation: 'pulse' },
  { id: 'bug', matrix: ['0101010', '0111110', '1111111', '1111111', '1111111', '0111110', '0101010'], color1: [255, 60, 60], color2: [200, 0, 80], category: 'dev', defaultAnimation: 'glitch' },
];

export default function App() {
  const [currentView, setCurrentView] = useState<'library' | 'docs'>('library');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<typeof iconsData[0] | null>(null);
  const [dialogAnimation, setDialogAnimation] = useState<AnimationType>('wave');
  const [dialogAnimateOn, setDialogAnimateOn] = useState<'always' | 'hover'>('always');
  const [githubStars, setGithubStars] = useState<number | null>(null);

  // Detect reduced motion preference
  const prefersReducedMotion = React.useMemo(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  React.useEffect(() => {
    fetch('https://api.github.com/repos/thor-op/8glyph')
      .then(r => r.json())
      .then(d => { if (typeof d.stargazers_count === 'number') setGithubStars(d.stargazers_count); })
      .catch(() => { });
  }, []);

  // Escape key handler for modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedIcon) {
        setSelectedIcon(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedIcon]);
  const filteredIcons = iconsData.filter(icon => {
    const matchesCategory = activeCategory === 'all' || icon.category === activeCategory;
    const matchesSearch = icon.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (id: string) => {
    const icon = iconsData.find(i => i.id === id);
    if (!icon) return;
    const code = `<PixelIcon\n  matrix={${JSON.stringify(icon.matrix)}}\n  color1={[${icon.color1}]}\n  color2={[${icon.color2}]}\n  pixelSize={6}\n  animationType="${icon.defaultAnimation}"\n  animateOn="hover"\n/>`;
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedId(id);
    fireToast(`Copied "${id}" to clipboard`, 'success', '📋');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen text-white font-mono selection:bg-[#ff7a45]/30 flex flex-col overflow-x-hidden">
      <Toaster 
        position="bottom-right" 
        theme="dark"
        toastOptions={{
          style: {
            background: 'rgba(17, 17, 17, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            borderRadius: 'var(--radius-md)',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.02em',
          },
        }}
      />
      {/* Floating Navbar */}
      <div className="fixed top-4 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 180, delay: 0.1 }}
          className="pointer-events-auto relative flex items-center gap-2 px-3 py-2 border border-white/10 bg-[#07070a]/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          {/* Logo */}
          <motion.button
            onClick={() => setCurrentView('library')}
            className="flex items-center gap-2 px-2 py-1.5 flex-shrink-0"
            whileHover="active"
            initial="initial"
          >
            <motion.div
              className="w-5 h-5 grid grid-cols-2 grid-rows-2 gap-[1.5px]"
              variants={{ initial: { rotate: 0 }, active: { rotate: 90, scale: 1.15 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <div className="bg-[#ff7a45]"></div>
              <div className="bg-[#ff9c73]"></div>
              <div className="bg-[#e65c22]"></div>
              <div className="bg-[#ffb394]"></div>
            </motion.div>
            <motion.span
              className="text-sm font-bold tracking-tight"
              variants={{ initial: { color: '#ffffff' }, active: { color: '#ff7a45' } }}
            >
              8Glyph
            </motion.span>
          </motion.button>

          <div className="w-px h-4 bg-white/10 mx-1" />

          {/* Nav Pills */}
          <nav className="flex items-center gap-1">
            {(['library', 'docs'] as const).map((view) => (
              <motion.button
                key={view}
                onClick={() => setCurrentView(view)}
                className="relative px-4 py-1.5 text-[10px] tracking-widest font-bold"
                style={{ borderRadius: 'var(--radius-md)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', damping: 20, stiffness: 400 }}
              >
                {currentView === view && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-[#ff7a45]/10 border border-[#ff7a45]/30"
                    style={{ borderRadius: 'var(--radius-md)' }}
                    transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                  />
                )}
                <span className={`relative z-10 transition-colors ${currentView === view ? 'text-[#ff7a45]' : 'text-white/35 hover:text-white/70'}`}>
                  {view.toUpperCase()}
                </span>
              </motion.button>
            ))}
          </nav>

          <div className="w-px h-4 bg-white/10 mx-1" />

          {/* GitHub Stars */}
          <motion.a
            href="https://github.com/thor-op/8glyph"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center gap-2 px-3 py-1.5 border border-white/10 bg-white/[0.03] group"
            style={{ borderRadius: 'var(--radius-md)' }}
            whileHover={{ borderColor: 'rgba(255,122,69,0.5)', backgroundColor: 'rgba(255,122,69,0.05)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="12" height="12" viewBox="0 0 7 7" fill="none" className="flex-shrink-0">
              <rect x="3" y="0" width="1" height="1" fill="#ff7a45" />
              <rect x="3" y="1" width="1" height="1" fill="#ff7a45" />
              <rect x="0" y="2" width="7" height="1" fill="#ff7a45" />
              <rect x="1" y="3" width="5" height="1" fill="#ff7a45" />
              <rect x="0" y="4" width="3" height="1" fill="#ff7a45" />
              <rect x="4" y="4" width="3" height="1" fill="#ff7a45" />
              <rect x="0" y="5" width="2" height="1" fill="#ff7a45" />
              <rect x="5" y="5" width="2" height="1" fill="#ff7a45" />
            </svg>
            <span className="text-[10px] font-bold tracking-widest text-white/40 group-hover:text-[#ff7a45] transition-colors">STAR</span>
            <span className="text-[9px] font-bold text-[#ff7a45]/70 bg-[#ff7a45]/10 px-1.5 py-0.5 border border-[#ff7a45]/20 min-w-[1.5rem] text-center" style={{ borderRadius: 'var(--radius-sm)' }}>
              {githubStars === null ? '—' : githubStars.toLocaleString()}
            </span>
          </motion.a>
        </motion.header>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-[72px]" />

      <AnimatePresence mode="wait">
        {currentView === 'library' ? (
          <motion.div
            key="library"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* ── Hero ── */}
            <section className="relative w-full overflow-hidden">
              {/* Accent glow lines */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff7a45]/40 to-transparent pointer-events-none" />
              <div className="absolute top-16 left-0 w-64 h-px bg-gradient-to-r from-[#ff7a45]/20 to-transparent pointer-events-none" />

              {/* Ambient glows */}
              <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#ff7a45]/[0.04] blur-[80px] pointer-events-none" />
              <div className="absolute top-10 right-1/4 w-72 h-72 rounded-full bg-[#7c3aed]/[0.05] blur-[80px] pointer-events-none" />

              <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-14 pb-0 grid md:grid-cols-[1fr_auto] gap-12 items-center">

                {/* Left: text */}
                <div className="pb-16 md:pb-20">
                  {/* Badge - opacity 0→1, x -16→0 (400ms, delay 0) */}
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0, ease: [0.23, 1, 0.32, 1] }}
                    className="relative inline-flex items-center gap-2 px-3 py-1.5 border border-[#ff7a45]/30 bg-[#ff7a45]/5 text-[10px] text-[#ff7a45] tracking-[0.2em] uppercase mb-10"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  >
                    <motion.span
                      className="w-1.5 h-1.5 bg-[#ff7a45]"
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.4 }}
                    />
                    <span>Pixel Icon Library — v0.1</span>
                  </motion.div>

                  {/* Headline */}
                  <div className="mb-8">
                    {/* Headline line 1 - opacity 0→1, y 30→0 (550ms, delay 60ms) */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, delay: 0.06, ease: [0.23, 1, 0.32, 1] }}
                      className="text-[clamp(3rem,8vw,6.5rem)] font-black tracking-tighter leading-[0.88] text-white"
                    >
                      Animated
                    </motion.div>
                    {/* Headline line 2 - opacity 0→1, y 30→0 (550ms, delay 140ms) */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, delay: 0.14, ease: [0.23, 1, 0.32, 1] }}
                      className="text-[clamp(3rem,8vw,6.5rem)] font-black tracking-tighter leading-[0.88] flex items-baseline gap-4 flex-wrap"
                    >
                      <span className="text-white">Pixel</span>
                      <span className="relative">
                        <span
                          className="relative z-10"
                          style={{ color: '#ff7a45', textShadow: '0 0 40px rgba(255,122,69,0.4), 0 0 80px rgba(255,122,69,0.15)' }}
                        >Icons.</span>
                      </span>
                    </motion.div>
                  </div>

                  {/* Description - opacity 0→1, y 12→0 (400ms, delay 250ms) */}
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
                    className="text-white/35 text-sm leading-relaxed max-w-sm mb-10 border-l-2 border-[#ff7a45]/30 pl-4"
                  >
                    Retro-style pixel icons with unique per-icon hover animations. Copy React-ready code in one click.
                  </motion.p>

                  {/* Stats - opacity 0→1, y 10→0 (400ms, delay 350ms) */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.35, ease: [0.23, 1, 0.32, 1] }}
                    className="flex items-center gap-3 flex-wrap"
                  >
                    {[
                      { value: `${iconsData.length}`, label: 'Icons', accent: '#ff7a45' },
                      { value: '6', label: 'Animations', accent: '#a855f7' },
                      { value: '6', label: 'Categories', accent: '#00c8ff' },
                      { value: '0', label: 'Deps', accent: '#00e87a' },
                    ].map(({ value, label, accent }) => (
                      <div key={label} className="stat-card relative border border-white/[0.06] px-4 py-3 bg-white/[0.015] group" style={{ borderRadius: 'var(--radius-md)' }}>
                        <div className="text-2xl font-black leading-none" style={{ color: accent }}>{value}</div>
                        <div className="text-[9px] text-white/25 tracking-widest uppercase mt-1">{label}</div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Right: 4×3 icon showcase grid - opacity 0→1, x 40→0 (600ms, delay 180ms) */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  className="hidden md:block self-center flex-shrink-0"
                >
                  <div className="grid grid-cols-4 border-l border-t border-white/[0.06]">
                    {([
                      'heart', 'star', 'rocket', 'crown',
                      'ghost', 'alien', 'dragon', 'mushroom',
                      'portal', 'ufo', 'wizard', 'eye',
                    ] as const).map((id) => iconsData.find(i => i.id === id)).filter(Boolean).map((icon, i) => (
                      <motion.div
                        key={icon!.id}
                        initial="initial"
                        whileHover="active"
                        className="relative w-[80px] h-[80px] flex items-center justify-center border-r border-b border-white/[0.06] bg-[#07070a] overflow-hidden"
                        style={{ borderRadius: 'var(--radius-md)' }}
                      >
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          variants={{ initial: { opacity: 0 }, active: { opacity: 1 } }}
                          transition={{ duration: 0.2 }}
                          style={{ background: `radial-gradient(circle at center, rgba(${icon!.color1[0]},${icon!.color1[1]},${icon!.color1[2]},0.2), transparent 70%)` }}
                        />
                        <PixelIcon
                          matrix={icon!.matrix}
                          color1={icon!.color1}
                          color2={icon!.color2}
                          pixelSize={5}
                          animationType={icon!.defaultAnimation}
                          animateOn="hover"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

              </div>

              {/* ── Marquee strip ── */}
              <div className="relative mt-10 border-y border-white/[0.04] overflow-hidden bg-white/[0.01] py-3">
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#07070a] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#07070a] to-transparent z-10 pointer-events-none" />
                <motion.div
                  className="flex items-center gap-8 whitespace-nowrap"
                  animate={{ x: ['0%', '-50%'] }}
                  transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
                >
                  {[...Array(2)].map((_, rep) => (
                    <React.Fragment key={rep}>
                      {([
                        { id: 'lightning', label: 'ANIMATED' },
                        { id: 'diamond', label: 'PIXEL-PERFECT' },
                        { id: 'rocket', label: 'REACT READY' },
                        { id: 'controller', label: 'GAME-STYLE' },
                        { id: 'chip', label: 'ZERO DEPS' },
                        { id: 'star', label: 'OPEN SOURCE' },
                        { id: 'galaxy', label: 'RETRO VIBES' },
                        { id: 'github', label: 'DEV ICONS' },
                        { id: 'portal', label: '6 ANIMATIONS' },
                      ]).map(({ id, label }) => {
                        const ic = iconsData.find(i => i.id === id);
                        if (!ic) return null;
                        return (
                          <div key={`${rep}-${id}`} className="flex items-center gap-3 flex-shrink-0">
                            <PixelIcon matrix={ic.matrix} color1={ic.color1} color2={ic.color2} pixelSize={3} animationType="none" animateOn="hover" />
                            <span className="text-[10px] font-bold tracking-[0.2em] text-white/20">{label}</span>
                            <span className="text-white/10 text-lg font-thin">·</span>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* Main Content */}
            <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 md:px-12 pb-24" style={{ paddingTop: 0 }}>
              {/* Filter Bar */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 sticky top-[72px] bg-[#07070a]/96 backdrop-blur-md py-4 z-30 border-b border-white/[0.06]">
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                  <FilterButton active={activeCategory === 'all'} onClick={() => setActiveCategory('all')} icon={<PixelIcon matrix={['101', '000', '101']} color1={[255, 255, 255]} color2={[150, 150, 150]} pixelSize={2} animationType="none" animateOn="hover" />} label="ALL" />
                  <FilterButton active={activeCategory === 'numbers'} onClick={() => setActiveCategory('numbers')} icon={<PixelIcon matrix={['010', '110', '010', '111']} color1={[0, 100, 255]} color2={[0, 200, 255]} pixelSize={2} animationType="none" animateOn="hover" />} label="NUMBERS" />
                  <FilterButton active={activeCategory === 'common'} onClick={() => setActiveCategory('common')} icon={<PixelIcon matrix={['010', '111', '010']} color1={[255, 200, 0]} color2={[255, 100, 0]} pixelSize={2} animationType="none" animateOn="hover" />} label="COMMON" />
                  <FilterButton active={activeCategory === 'fun'} onClick={() => setActiveCategory('fun')} icon={<PixelIcon matrix={['101', '111', '101']} color1={[0, 255, 100]} color2={[0, 150, 50]} pixelSize={2} animationType="none" animateOn="hover" />} label="FUN" />
                  <FilterButton active={activeCategory === 'weather'} onClick={() => setActiveCategory('weather')} icon={<PixelIcon matrix={['011', '111']} color1={[200, 200, 200]} color2={[255, 255, 255]} pixelSize={2} animationType="none" animateOn="hover" />} label="WEATHER" />
                  <FilterButton active={activeCategory === 'tech'} onClick={() => setActiveCategory('tech')} icon={<PixelIcon matrix={['111', '101', '111']} color1={[150, 150, 150]} color2={[100, 100, 100]} pixelSize={2} animationType="none" animateOn="hover" />} label="TECH" />
                  <FilterButton active={activeCategory === 'food'} onClick={() => setActiveCategory('food')} icon={<PixelIcon matrix={['010', '111', '010']} color1={[255, 50, 50]} color2={[200, 0, 0]} pixelSize={2} animationType="none" animateOn="hover" />} label="FOOD" />
                  <FilterButton active={activeCategory === 'dev'} onClick={() => setActiveCategory('dev')} icon={<PixelIcon matrix={['010', '100', '010']} color1={[0, 200, 255]} color2={[100, 100, 255]} pixelSize={2} animationType="none" animateOn="hover" />} label="DEV" />
                </div>

                <div className="relative w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                  <input
                    type="text"
                    placeholder="SEARCH ICONS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 py-3 pl-11 pr-4 text-xs tracking-wider text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff7a45]/50 focus:bg-white/[0.05]"
                    style={{
                      borderRadius: 'var(--radius-md)',
                      transition: 'border-color 150ms ease, background-color 150ms ease'
                    }}
                  />
                </div>
              </div>

              {/* Grid */}
              <div className="pixel-grid-wrap grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {filteredIcons.map((icon, index) => (
                  <motion.div
                    key={icon.id}
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setSelectedIcon(icon);
                      setDialogAnimation(icon.defaultAnimation);
                    }}
                    className="pixel-card group relative bg-[#080808] aspect-square flex flex-col items-center justify-center cursor-pointer overflow-hidden"
                    style={{ borderRadius: 'var(--radius-md)' }}
                    transition={{
                      default: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
                      opacity: { duration: prefersReducedMotion ? 0.00001 : 0.3, delay: prefersReducedMotion ? 0 : Math.min(index * 0.025, 0.6), ease: [0.23, 1, 0.32, 1] },
                      y: { duration: prefersReducedMotion ? 0.00001 : 0.3, delay: prefersReducedMotion ? 0 : Math.min(index * 0.025, 0.6), ease: [0.23, 1, 0.32, 1] },
                      scale: { duration: prefersReducedMotion ? 0.00001 : 0.3, delay: prefersReducedMotion ? 0 : Math.min(index * 0.025, 0.6), ease: [0.23, 1, 0.32, 1] },
                    }}
                  >
                    {/* Per-icon colour glow */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      style={{ background: `radial-gradient(ellipse at center, rgba(${icon.color1[0]},${icon.color1[1]},${icon.color1[2]},0.18) 0%, transparent 70%)` }}
                    />

                    {/* Pixel corner decorations — appear on hover */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      {/* TL */}
                      <div className="absolute top-0 left-0 w-3 h-[2px]" style={{ backgroundColor: `rgb(${icon.color1[0]},${icon.color1[1]},${icon.color1[2]})` }} />
                      <div className="absolute top-0 left-0 w-[2px] h-3" style={{ backgroundColor: `rgb(${icon.color1[0]},${icon.color1[1]},${icon.color1[2]})` }} />
                      {/* TR */}
                      <div className="absolute top-0 right-0 w-3 h-[2px]" style={{ backgroundColor: `rgb(${icon.color1[0]},${icon.color1[1]},${icon.color1[2]})` }} />
                      <div className="absolute top-0 right-0 w-[2px] h-3" style={{ backgroundColor: `rgb(${icon.color1[0]},${icon.color1[1]},${icon.color1[2]})` }} />
                      {/* BL */}
                      <div className="absolute bottom-0 left-0 w-3 h-[2px]" style={{ backgroundColor: `rgb(${icon.color1[0]},${icon.color1[1]},${icon.color1[2]})` }} />
                      <div className="absolute bottom-0 left-0 w-[2px] h-3" style={{ backgroundColor: `rgb(${icon.color1[0]},${icon.color1[1]},${icon.color1[2]})` }} />
                      {/* BR */}
                      <div className="absolute bottom-0 right-0 w-3 h-[2px]" style={{ backgroundColor: `rgb(${icon.color1[0]},${icon.color1[1]},${icon.color1[2]})` }} />
                      <div className="absolute bottom-0 right-0 w-[2px] h-3" style={{ backgroundColor: `rgb(${icon.color1[0]},${icon.color1[1]},${icon.color1[2]})` }} />
                    </motion.div>

                    <div className="scale-[1.5] relative z-10">
                      <PixelIcon
                        matrix={icon.matrix}
                        color1={icon.color1}
                        color2={icon.color2}
                        pixelSize={8}
                        animationType={icon.defaultAnimation}
                        animateOn="hover"
                      />
                    </div>

                    <motion.span
                      className="absolute bottom-3 text-[9px] tracking-widest uppercase"
                      initial={{ opacity: 0.15, color: '#ffffff' }}
                      whileHover={{ opacity: 0.7, color: `rgb(${icon.color1[0]},${icon.color1[1]},${icon.color1[2]})` }}
                      transition={{ duration: 0.2 }}
                    >
                      {icon.id}
                    </motion.span>
                  </motion.div>
                ))}
              </div>

              {filteredIcons.length === 0 && (
                <div className="py-32 text-center text-white/20 text-sm tracking-widest">
                  NO ICONS FOUND MATCHING &quot;{searchQuery}&quot;
                </div>
              )}
            </main>
          </motion.div>
        ) : (
          <motion.div
            key="docs"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <DocsView />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialog Overlay */}
      <AnimatePresence>
        {selectedIcon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-lg p-4 md:p-8"
            onClick={() => setSelectedIcon(null)}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 24 }}
              transition={{ type: 'spring', damping: 22, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#090909] border border-white/10 max-w-4xl w-full overflow-hidden shadow-2xl"
              style={{ borderRadius: 'var(--radius-xl)' }}
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between px-7 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <span className="relative text-[9px] tracking-[0.2em] text-white/40 uppercase border border-white/10 px-2.5 py-1">{selectedIcon.category}</span>
                  <h2 className="text-xl font-bold tracking-tight capitalize">{selectedIcon.id}</h2>
                  <span className="text-xs text-white/20 font-mono">{selectedIcon.matrix[0].length}×{selectedIcon.matrix.length}</span>
                </div>
                <motion.button
                  onClick={() => setSelectedIcon(null)}
                  className="text-white/20 hover:text-white/80 p-1.5 hover:bg-white/5 rounded-lg"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                >
                  <X size={18} />
                </motion.button>
              </div>

              <div className="flex flex-col md:flex-row">
                {/* Left: Icon Preview */}
                <div
                  className="flex-1 min-h-[260px] md:min-h-[380px] flex items-center justify-center relative overflow-hidden"
                  style={{ background: `radial-gradient(ellipse at center, rgba(${selectedIcon.color1[0]},${selectedIcon.color1[1]},${selectedIcon.color1[2]},0.15) 0%, #050505 65%)` }}
                >
                  <div className="absolute inset-0 opacity-[0.06]" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                    backgroundSize: '18px 18px'
                  }} />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#080808]/50" />
                  <div className="relative z-10 scale-[2] md:scale-[2.8]">
                    <PixelIcon
                      matrix={selectedIcon.matrix}
                      color1={selectedIcon.color1}
                      color2={selectedIcon.color2}
                      pixelSize={6}
                      animationType={dialogAnimation}
                      animateOn={dialogAnimateOn}
                    />
                  </div>
                </div>

                {/* Right: Controls */}
                <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-white/5 flex flex-col">
                  {/* Trigger toggle */}
                  <div className="px-6 py-5 border-b border-white/5">
                    <p className="text-[9px] font-bold tracking-[0.15em] text-white/30 uppercase mb-3">Trigger</p>
                    <div className="flex items-center gap-1 bg-white/[0.04] p-1 border border-white/5 w-fit" style={{ borderRadius: 'var(--radius-md)' }}>
                      {(['always', 'hover'] as const).map((mode) => (
                        <motion.button
                          key={mode}
                          onClick={() => setDialogAnimateOn(mode)}
                          className={`relative px-3 py-1.5 text-[10px] tracking-wider font-bold ${dialogAnimateOn === mode ? 'bg-white text-black' : 'text-white/30'}`}
                          style={{ borderRadius: 'var(--radius-md)' }}
                          whileTap={{ scale: 0.96 }}
                          transition={{ duration: 0.1 }}
                        >
                          {mode === 'always' ? 'ALWAYS' : 'ON HOVER'}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Animation type picker */}
                  <div className="px-6 py-5 flex-1">
                    <p className="text-[9px] font-bold tracking-[0.15em] text-white/30 uppercase mb-3">Animation</p>
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        { type: 'wave' as AnimationType, icon: <Activity size={13} />, label: 'Wave' },
                        { type: 'flicker' as AnimationType, icon: <Zap size={13} />, label: 'Flicker' },
                        { type: 'pulse' as AnimationType, icon: <Radio size={13} />, label: 'Pulse' },
                        { type: 'disco' as AnimationType, icon: <Sparkles size={13} />, label: 'Disco' },
                        { type: 'glitch' as AnimationType, icon: <Zap size={13} />, label: 'Glitch' },
                        { type: 'none' as AnimationType, icon: <Square size={13} />, label: 'None' },
                      ]).map(({ type, icon, label }) => (
                        <motion.button
                          key={type}
                          onClick={() => setDialogAnimation(type)}
                          className={`relative flex items-center gap-2 px-3 py-2.5 text-xs font-bold tracking-wide ${dialogAnimation === type
                            ? 'bg-[#ff7a45] text-black'
                            : 'bg-white/[0.04] text-white/40 border border-white/5'
                            }`}
                          style={{ borderRadius: 'var(--radius-md)' }}
                          whileTap={{ scale: 0.96 }}
                          transition={{ duration: 0.1 }}
                        >
                          {icon}
                          {label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Copy button */}
                  <div className="px-6 pb-6">
                    <motion.button
                      onClick={() => handleCopy(selectedIcon.id)}
                      className="relative w-full bg-white text-black py-3 text-xs font-bold tracking-widest flex items-center justify-center gap-2"
                      style={{ borderRadius: 'var(--radius-md)' }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.1 }}
                    >
                      {copiedId === selectedIcon.id ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                      {copiedId === selectedIcon.id ? 'COPIED!' : 'COPY REACT CODE'}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/[0.04]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: logo + tagline */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 grid grid-cols-2 grid-rows-2 gap-[2px]">
              <div className="bg-[#ff7a45] rounded-[2px]" />
              <div className="bg-[#ff9c73] rounded-[2px]" />
              <div className="bg-[#e65c22] rounded-[2px]" />
              <div className="bg-[#ffb394] rounded-[2px]" />
            </div>
            <span className="text-sm font-bold tracking-tight">8Glyph</span>
            <span className="text-white/10 mx-1">·</span>
            <span className="text-[10px] text-white/25 tracking-widest">PIXEL ICON LIBRARY</span>
          </div>

          {/* Center: decorative icons */}
          <div className="flex items-center gap-5 opacity-30">
            <PixelIcon matrix={['0110110', '1111111', '1111111', '0111110', '0011100', '0001000']} color1={[255, 30, 80]} color2={[255, 130, 0]} pixelSize={3} animationType="pulse" animateOn="always" />
            <PixelIcon matrix={['1001001', '0101010', '0011100', '1111111', '0011100', '0101010', '1001001']} color1={[255, 210, 0]} color2={[255, 110, 0]} pixelSize={3} animationType="disco" animateOn="always" />
            <PixelIcon matrix={['0001000', '0011100', '0111110', '1111111', '0111110', '0101010', '0010100']} color1={[255, 110, 0]} color2={[255, 240, 0]} pixelSize={3} animationType="glitch" animateOn="always" />
            <PixelIcon matrix={['0011100', '0111000', '1111110', '0111110', '0011100', '0001000', '0011000']} color1={[255, 240, 0]} color2={[255, 140, 0]} pixelSize={3} animationType="flicker" animateOn="always" />
          </div>

          {/* Right: credit */}
          <p className="text-[10px] text-white/20 tracking-widest">
            © 2026 CRAFTED BY <span className="text-white/50 font-bold">THORXOP</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

function FilterButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <motion.button
      onClick={onClick}
      className={`filter-btn ${active ? 'active' : 'inactive'}`}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.1 }}
    >
      {icon}
      {label}
    </motion.button>
  );
}

function DocsView() {
  const props = [
    { prop: 'matrix', type: 'string[]', def: '—', desc: 'Rows of pixels. "1" = filled, "0" = empty.' },
    { prop: 'color1', type: 'number[]', def: '—', desc: 'Gradient start colour as [R, G, B].' },
    { prop: 'color2', type: 'number[]', def: '—', desc: 'Gradient end colour as [R, G, B].' },
    { prop: 'pixelSize', type: 'number', def: '6', desc: 'Size of each pixel square in px.' },
    { prop: 'animationType', type: "'wave'|'flicker'|'pulse'|'disco'|'glitch'|'none'", def: "'wave'", desc: 'Which animation plays.' },
    { prop: 'animateOn', type: "'hover'|'always'", def: "'hover'", desc: 'Trigger: on mouse-enter or continuous.' },
  ];

  return (
    <div className="w-full pb-24">

      {/* ── Docs Hero Banner ── */}
      <div className="relative w-full border-b border-white/[0.04] overflow-hidden">
        {/* bg atmosphere */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00c8ff]/30 to-transparent" />
          <div className="absolute -top-20 left-1/3 w-80 h-80 bg-[#00c8ff]/[0.04] blur-[80px]" />
          <div className="absolute -top-10 right-1/4 w-60 h-60 bg-[#a855f7]/[0.05] blur-[60px]" />
        </div>
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            {/* Badge - staggered animation */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0, ease: [0.23, 1, 0.32, 1] }}
              className="relative inline-flex items-center gap-2 px-3 py-1 border border-[#00c8ff]/30 bg-[#00c8ff]/5 text-[10px] text-[#00c8ff] tracking-[0.2em] uppercase mb-6"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <motion.span className="w-1.5 h-1.5 bg-[#00c8ff]" animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1.6 }} />
              <span>API Reference</span>
            </motion.div>
            {/* Headline - staggered animation */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
              className="text-[clamp(2.4rem,6vw,5rem)] font-black tracking-tighter leading-[0.9] mb-5"
            >
              <span className="text-white">How to</span><br />
              <span style={{ color: '#00c8ff', textShadow: '0 0 40px rgba(0,200,255,0.3)' }}>Integrate.</span>
            </motion.h1>
            {/* Description - staggered animation */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.18, ease: [0.23, 1, 0.32, 1] }}
              className="text-white/35 text-sm leading-relaxed max-w-sm border-l-2 border-[#00c8ff]/30 pl-4"
            >
              Drop animated pixel icons into any React project. Zero extra packages beyond Motion.
            </motion.p>
          </div>
          {/* Mini icon strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="hidden md:grid grid-cols-3 border-l border-t border-white/[0.05] flex-shrink-0"
          >
            {[
              { matrix: ['0111110', '1111111', '1010101', '1111111', '0111110', '0101010', '0111110'], c1: [220, 220, 240] as [number, number, number], c2: [255, 255, 255] as [number, number, number], anim: 'flicker' as const },
              { matrix: ['0001000', '0011100', '0111110', '1111111', '0111110', '0101010', '0010100'], c1: [255, 110, 0] as [number, number, number], c2: [255, 240, 0] as [number, number, number], anim: 'glitch' as const },
              { matrix: ['0111110', '1111111', '1011101', '1000001', '1011101', '1111111', '0111110'], c1: [100, 0, 255] as [number, number, number], c2: [0, 200, 255] as [number, number, number], anim: 'disco' as const },
              { matrix: ['0001000', '0011100', '0111110', '1111111', '0111110', '0011100', '0001000'], c1: [0, 240, 255] as [number, number, number], c2: [0, 100, 255] as [number, number, number], anim: 'disco' as const },
              { matrix: ['1000010', '1100110', '1111110', '0111100', '1111110', '1101011', '1000001'], c1: [255, 40, 0] as [number, number, number], c2: [255, 180, 0] as [number, number, number], anim: 'glitch' as const },
              { matrix: ['0111110', '1111111', '1111111', '0111110', '0011100', '0111110', '0011100'], c1: [255, 60, 60] as [number, number, number], c2: [255, 255, 255] as [number, number, number], anim: 'pulse' as const },
            ].map((ic, i) => (
              <motion.div key={i} initial="initial" whileHover="active"
                className="w-[72px] h-[72px] flex items-center justify-center border-r border-b border-white/[0.05] bg-[#07070a] relative overflow-hidden"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                <motion.div className="absolute inset-0 pointer-events-none"
                  variants={{ initial: { opacity: 0 }, active: { opacity: 1 } }}
                  style={{ background: `radial-gradient(circle at center, rgba(${ic.c1[0]},${ic.c1[1]},${ic.c1[2]},0.2), transparent 70%)` }}
                />
                <PixelIcon matrix={ic.matrix} color1={ic.c1} color2={ic.c2} pixelSize={4} animationType={ic.anim} animateOn="hover" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 mt-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* ── Left column ── */}
        <div className="space-y-6">

          {/* Step 1 */}
          <div className="relative border border-white/[0.07] bg-[#0a0a0a] overflow-hidden" style={{ borderRadius: 'var(--radius-lg)' }}>
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.05] bg-white/[0.02]">
              <span className="relative w-6 h-6 flex items-center justify-center bg-[#ff7a45] text-black text-[10px] font-bold" style={{ borderRadius: 'var(--radius-sm)' }}>1</span>
              <h2 className="text-sm font-bold tracking-wide">Install Motion</h2>
            </div>
            <div className="px-6 py-5">
              <p className="text-white/35 text-xs mb-4">The animation engine powering every pixel.</p>
              <div className="bg-black border border-white/[0.06] px-5 py-3.5 font-mono text-sm flex items-center justify-between gap-4">
                <div><span className="text-white/20 select-none mr-2">$</span><span className="text-[#ff7a45]">npm install motion</span></div>
                <Copy size={13} className="text-white/20 hover:text-white/60 cursor-pointer transition-colors flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative border border-white/[0.07] bg-[#0a0a0a] overflow-hidden" style={{ borderRadius: 'var(--radius-lg)' }}>
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.05] bg-white/[0.02]">
              <span className="relative w-6 h-6 flex items-center justify-center bg-[#00c8ff] text-black text-[10px] font-bold" style={{ borderRadius: 'var(--radius-sm)' }}>2</span>
              <h2 className="text-sm font-bold tracking-wide">Copy PixelIcon.tsx</h2>
            </div>
            <div className="px-6 py-5">
              <p className="text-white/35 text-xs mb-4">Self-contained component — zero extra dependencies beyond Motion.</p>
              <button
                className="relative w-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-white/70 hover:text-white py-3 text-xs font-bold tracking-widest flex items-center justify-center gap-2 active:scale-[0.97]"
                style={{
                  borderRadius: 'var(--radius-md)',
                  transition: 'transform 160ms var(--ease-out), background-color 120ms ease, color 120ms ease'
                }}
              >
                <Copy size={13} />COPY PIXELICON.TSX
              </button>
            </div>
          </div>

          {/* Step 3 — code block */}
          <div className="relative border border-white/[0.07] bg-[#0a0a0a] overflow-hidden" style={{ borderRadius: 'var(--radius-lg)' }}>
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.05] bg-white/[0.02]">
              <span className="relative w-6 h-6 flex items-center justify-center bg-purple-500 text-black text-[10px] font-bold" style={{ borderRadius: 'var(--radius-sm)' }}>3</span>
              <h2 className="text-sm font-bold tracking-wide">Use It</h2>
            </div>
            <div className="relative overflow-x-auto">
              <button
                className="absolute top-3 right-4 text-white/20 hover:text-white/60 z-10 active:scale-[0.97]"
                style={{ transition: 'transform 160ms var(--ease-out), color 120ms ease' }}
              >
                <Copy size={13} />
              </button>
              <pre className="px-6 py-5 text-xs font-mono leading-6 text-white/60 overflow-x-auto">
                {`import { PixelIcon } from './PixelIcon';

<PixelIcon
  matrix={[
    '0110110',
    '1111111',
    '0111110',
    '0011100',
    '0001000',
  ]}
  color1={[255, 0, 50]}
  color2={[255, 150, 0]}
  pixelSize={6}
  animationType=`}<span className="text-[#00c8ff]">"disco"</span>{`
  animateOn=`}<span className="text-[#00c8ff]">"hover"</span>{`
/>`}
              </pre>
            </div>
          </div>

          {/* Props table */}
          <div className="relative border border-white/[0.07] bg-[#0a0a0a] overflow-hidden" style={{ borderRadius: 'var(--radius-lg)' }}>
            <div className="px-6 py-4 border-b border-white/[0.05] bg-white/[0.02]">
              <h2 className="text-sm font-bold tracking-wide">Props Reference</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.04]">
                    <th className="px-6 py-3 text-[9px] tracking-[0.18em] text-white/30 font-bold uppercase">Prop</th>
                    <th className="px-6 py-3 text-[9px] tracking-[0.18em] text-white/30 font-bold uppercase">Type</th>
                    <th className="px-6 py-3 text-[9px] tracking-[0.18em] text-white/30 font-bold uppercase">Default</th>
                    <th className="px-6 py-3 text-[9px] tracking-[0.18em] text-white/30 font-bold uppercase hidden lg:table-cell">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {props.map((row, i) => (
                    <tr key={row.prop} className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${i === props.length - 1 ? 'border-none' : ''}`}>
                      <td className="px-6 py-3.5 font-mono text-[#ff7a45] text-xs">{row.prop}</td>
                      <td className="px-6 py-3.5 font-mono text-white/35 text-[11px]">{row.type}</td>
                      <td className="px-6 py-3.5 font-mono text-white/25 text-xs">{row.def}</td>
                      <td className="px-6 py-3.5 text-white/40 text-xs hidden lg:table-cell">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* ── Right column: live preview ── */}
        <div className="space-y-6">
          <div className="relative border border-white/[0.07] bg-[#0a0a0a] overflow-hidden lg:sticky lg:top-24" style={{ borderRadius: 'var(--radius-lg)' }}>
            <div className="px-5 py-4 border-b border-white/[0.05] bg-white/[0.02]">
              <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase">Live Preview</h3>
            </div>
            {/* Preview grid */}
            <div className="p-4 grid grid-cols-3 gap-0 border-l border-t border-white/[0.05]">
              {[
                { matrix: ['0110110', '1111111', '1111111', '0111110', '0011100', '0001000'], c1: [255, 30, 80] as [number, number, number], c2: [255, 130, 0] as [number, number, number], anim: 'pulse' as const },
                { matrix: ['1001001', '0101010', '0011100', '1111111', '0011100', '0101010', '1001001'], c1: [255, 210, 0] as [number, number, number], c2: [255, 110, 0] as [number, number, number], anim: 'disco' as const },
                { matrix: ['0001000', '0011100', '0111110', '1111111', '0111110', '0101010', '0010100'], c1: [255, 110, 0] as [number, number, number], c2: [255, 240, 0] as [number, number, number], anim: 'glitch' as const },
                { matrix: ['0111110', '1111111', '1010101', '1111111', '0111110', '0101010', '0111110'], c1: [220, 220, 240] as [number, number, number], c2: [255, 255, 255] as [number, number, number], anim: 'flicker' as const },
                { matrix: ['0011100', '0111000', '1111110', '0111110', '0011100', '0001000', '0011000'], c1: [255, 240, 0] as [number, number, number], c2: [255, 140, 0] as [number, number, number], anim: 'flicker' as const },
                { matrix: ['0001000', '0011100', '0111110', '1111111', '0111110', '0011100', '0001000'], c1: [0, 240, 255] as [number, number, number], c2: [0, 100, 255] as [number, number, number], anim: 'disco' as const },
              ].map((ic, i) => (
                <motion.div
                  key={i}
                  initial="initial"
                  whileHover="active"
                  className="aspect-square flex items-center justify-center border-r border-b border-white/[0.05] bg-[#07070a] relative"
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    variants={{ initial: { opacity: 0 }, active: { opacity: 1 } }}
                    style={{ background: `radial-gradient(circle at center, rgba(${ic.c1[0]},${ic.c1[1]},${ic.c1[2]},0.15), transparent 70%)` }}
                  />
                  <PixelIcon matrix={ic.matrix} color1={ic.c1} color2={ic.c2} pixelSize={4} animationType={ic.anim} animateOn="hover" />
                </motion.div>
              ))}
            </div>
            <div className="px-5 py-4 space-y-2 border-t border-white/[0.04]">
              <div className="text-[9px] text-white/20 tracking-widest uppercase mb-3">Animations</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {(['wave', 'flicker', 'pulse', 'disco', 'glitch', 'none'] as const).map(a => (
                  <div key={a} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#ff7a45] flex-shrink-0" />
                    <span className="text-xs text-white/35 font-mono">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
