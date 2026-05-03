export interface HSL {
  h: number;
  s: number;
  l: number;
}

export const hexToHSL = (hex: string): HSL => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

export const hslToCSS = (hsl: HSL): string => {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
};

export const getRandomizedHSL = (
  base: HSL, 
  rangeH: number, 
  rangeS: number, 
  rangeL: number,
  rng: () => number = Math.random
): HSL => {
  const h = (base.h + (rng() * 2 - 1) * rangeH + 360) % 360;
  const s = Math.min(100, Math.max(0, base.s + (rng() * 2 - 1) * rangeS));
  const l = Math.min(100, Math.max(0, base.l + (rng() * 2 - 1) * rangeL));
  return { h, s, l };
};

export const interpolateHSL = (color1: HSL, color2: HSL, t: number): HSL => {
  // Hue interpolation (shortest path)
  let h1 = color1.h;
  let h2 = color2.h;
  const diff = h2 - h1;
  if (Math.abs(diff) > 180) {
    if (h2 > h1) h1 += 360;
    else h2 += 360;
  }
  const h = (h1 + (h2 - h1) * t + 360) % 360;
  const s = color1.s + (color2.s - color1.s) * t;
  const l = color1.l + (color2.l - color1.l) * t;
  return { h, s, l };
};
