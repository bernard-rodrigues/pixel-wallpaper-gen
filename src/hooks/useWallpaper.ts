import { useState, useCallback } from 'react';

export type Device = 'S23' | 'TAB_S10_FE';
export type Orientation = 'PORTRAIT' | 'LANDSCAPE';
export type Mode = 'RANDOM' | 'GRADIENT';
export type GradientDirection = 'HORIZONTAL' | 'VERTICAL' | 'DIAGONAL';
export type SplitAxis = 'HORIZONTAL' | 'VERTICAL';
export type ThemeMode = 'LIGHT' | 'DARK';

export interface AreaConfig {
  mode: Mode;
  baseColor: string;
  density: number;
  hueRange: number;
  satRange: number;
  lightRange: number;
  gradientColors: number;
  gradientDirection: GradientDirection;
  seed: number;
}

export interface SunConfig extends AreaConfig {
  enabled: boolean;
  reflection: boolean;
  x: number;
  y: number;
  radius: number;
}

export interface WallpaperConfig {
  device: Device;
  orientation: Orientation;
  splitAxis: SplitAxis;
  splitPos: number;
  themeMode: ThemeMode;
  sideA: AreaConfig;
  sideB: AreaConfig;
  sun: SunConfig;
}

const THEMES = [
  {
    name: 'Mountain Dusk',
    sky: '#2c3e50',
    land: '#2c2c54',
    sun: '#ff793f',
    split: 65,
    sunY: 60
  },
  {
    name: 'Ocean Sunset',
    sky: '#ff9ff3',
    land: '#00d2d3',
    sun: '#feca57',
    split: 70,
    sunY: 65
  },
  {
    name: 'Desert Dawn',
    sky: '#ffbe76',
    land: '#e056fd',
    sun: '#ff7979',
    split: 80,
    sunY: 75
  },
  {
    name: 'Forest Morning',
    sky: '#48dbfb',
    land: '#1dd1a1',
    sun: '#feca57',
    split: 60,
    sunY: 20
  }
];

const getRandomTheme = () => THEMES[Math.floor(Math.random() * THEMES.length)];

const initialArea = (color: string): AreaConfig => ({
  mode: ['RANDOM', 'GRADIENT'][Math.floor(Math.random() * 2)] as Mode, // Default to pixelated
  baseColor: color,
  density: 40,
  hueRange: 15,
  satRange: 15,
  lightRange: 10,
  gradientColors: 3,
  gradientDirection: 'VERTICAL',
  seed: Math.random(),
});

export const DEVICE_SPECS = {
  S23: { width: 1080, height: 2340, native: 'PORTRAIT' as Orientation },
  TAB_S10_FE: { width: 2880, height: 1800, native: 'LANDSCAPE' as Orientation },
};

export const useWallpaper = () => {
  const [config, setConfig] = useState<WallpaperConfig>(() => {
    const theme = getRandomTheme();
    const splitPos = Math.floor(Math.random() * 30) + 45; // 45% to 75%
    const sunY = Math.floor(Math.random() * (splitPos + 10)) + 5; // Anywhere from sky to slightly submerged
    
    return {
      device: 'S23',
      orientation: 'PORTRAIT',
      splitAxis: 'HORIZONTAL',
      splitPos: splitPos,
      themeMode: 'DARK',
      sideA: initialArea(theme.sky),
      sideB: initialArea(theme.land),
      sun: {
        ...initialArea(theme.sun),
        enabled: true,
        reflection: true,
        x: Math.floor(20 + Math.random() * 60),
        y: Math.floor(sunY),
        radius: Math.floor(10 + Math.random() * 40),
      },
    };
  });

  const regenerateSide = useCallback((side: 'sideA' | 'sideB' | 'sun') => {
    setConfig((prev) => ({
      ...prev,
      [side]: { ...prev[side], seed: Math.random() }
    }));
  }, []);

  const updateGlobal = (updates: Partial<Omit<WallpaperConfig, 'sideA' | 'sideB' | 'sun'>>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const updateSide = (side: 'sideA' | 'sideB' | 'sun', updates: Partial<AreaConfig | SunConfig>) => {
    setConfig((prev) => ({
      ...prev,
      [side]: { ...prev[side], ...updates }
    }));
  };

  return { config, updateGlobal, updateSide, regenerateSide };
};
