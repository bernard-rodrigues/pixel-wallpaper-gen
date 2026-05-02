import React, { useRef, useEffect } from 'react';
import { type WallpaperConfig, DEVICE_SPECS, type AreaConfig } from '../hooks/useWallpaper';
import { hexToHSL, getRandomizedHSL, hslToCSS, interpolateHSL, type HSL } from '../utils/color';

interface CanvasProps {
  config: WallpaperConfig;
}

const Canvas: React.FC<CanvasProps> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawArea = (
    ctx: CanvasRenderingContext2D,
    area: AreaConfig,
    rect: { x: number; y: number; w: number; h: number }
  ) => {
    const pixelSize = Math.max(4, area.density);
    const cols = Math.ceil(rect.w / pixelSize);
    const rows = Math.ceil(rect.h / pixelSize);
    const baseHSL = hexToHSL(area.baseColor);

    // (seededRandom removed as it is not used in the loops yet)

    if (area.mode === 'RANDOM') {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const color = getRandomizedHSL(baseHSL, area.hueRange, area.satRange, area.lightRange);
          ctx.fillStyle = hslToCSS(color);
          ctx.fillRect(rect.x + c * pixelSize, rect.y + r * pixelSize, pixelSize, pixelSize);
        }
      }
    } else {
      const gradientColors: HSL[] = [];
      for (let i = 0; i < area.gradientColors; i++) {
        gradientColors.push(getRandomizedHSL(baseHSL, area.hueRange, area.satRange, area.lightRange));
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let t = 0;
          if (area.gradientDirection === 'HORIZONTAL') {
            t = c / cols;
          } else if (area.gradientDirection === 'VERTICAL') {
            t = r / rows;
          } else {
            t = (c / cols + r / rows) / 2;
          }

          const scaledT = t * (gradientColors.length - 1);
          const index = Math.floor(scaledT);
          const nextIndex = Math.min(index + 1, gradientColors.length - 1);
          const localT = scaledT - index;

          const color = interpolateHSL(gradientColors[index], gradientColors[nextIndex], localT);
          ctx.fillStyle = hslToCSS(color);
          ctx.fillRect(rect.x + c * pixelSize, rect.y + r * pixelSize, pixelSize, pixelSize);
        }
      }
    }
  };

  const drawSun = (
    ctx: CanvasRenderingContext2D,
    sun: AreaConfig & { x: number; y: number; radius: number },
    canvasW: number,
    canvasH: number,
    splitY: number
  ) => {
    const pixelSize = Math.max(4, sun.density);
    
    // Convert percentages to absolute pixels
    const sunX = (sun.x / 100) * canvasW;
    const sunY = (sun.y / 100) * canvasH;
    const sunRadius = (sun.radius / 100) * Math.min(canvasW, canvasH);
    
    // Calculate bounding box in grid units
    const startX = Math.floor((sunX - sunRadius) / pixelSize);
    const endX = Math.ceil((sunX + sunRadius) / pixelSize);
    const startY = Math.floor((sunY - sunRadius) / pixelSize);
    const endY = Math.ceil((sunY + sunRadius) / pixelSize);
    
    const baseHSL = hexToHSL(sun.baseColor);
    // (seededRandom removed as it is not used in the loops yet)

    // Pre-generate gradient colors if needed
    const gradientColors: HSL[] = [];
    if (sun.mode === 'GRADIENT') {
      for (let i = 0; i < sun.gradientColors; i++) {
        gradientColors.push(getRandomizedHSL(baseHSL, sun.hueRange, sun.satRange, sun.lightRange));
      }
    }

    for (let r = startY; r <= endY; r++) {
      const py = r * pixelSize;
      
      // Horizon Clip: Don't draw below the split line
      if (py >= splitY) continue;

      for (let c = startX; c <= endX; c++) {
        const px = c * pixelSize;
        
        // Distance check for circular shape (center of pixel)
        const dx = px + pixelSize / 2 - sunX;
        const dy = py + pixelSize / 2 - sunY;
        if (dx * dx + dy * dy <= sunRadius * sunRadius) {
          
          let color: HSL;
          if (sun.mode === 'RANDOM') {
            color = getRandomizedHSL(baseHSL, sun.hueRange, sun.satRange, sun.lightRange);
          } else {
            let t = 0;
            const relX = (px - (sunX - sunRadius)) / (sunRadius * 2);
            const relY = (py - (sunY - sunRadius)) / (sunRadius * 2);
            
            if (sun.gradientDirection === 'HORIZONTAL') t = relX;
            else if (sun.gradientDirection === 'VERTICAL') t = relY;
            else t = (relX + relY) / 2;
            
            t = Math.max(0, Math.min(1, t));
            const scaledT = t * (gradientColors.length - 1);
            const index = Math.floor(scaledT);
            const nextIndex = Math.min(index + 1, gradientColors.length - 1);
            const localT = scaledT - index;
            color = interpolateHSL(gradientColors[index], gradientColors[nextIndex], localT);
          }
          
          ctx.fillStyle = hslToCSS(color);
          ctx.fillRect(px, py, pixelSize, pixelSize);
        }
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const spec = DEVICE_SPECS[config.device];
    let width, height;
    if (config.orientation === spec.native) {
      width = spec.width;
      height = spec.height;
    } else {
      width = spec.height;
      height = spec.width;
    }

    canvas.width = width;
    canvas.height = height;

    if (config.splitAxis === 'HORIZONTAL') {
      const splitY = Math.floor((config.splitPos / 100) * height);
      drawArea(ctx, config.sideA, { x: 0, y: 0, w: width, h: splitY });
      drawArea(ctx, config.sideB, { x: 0, y: splitY, w: width, h: height - splitY });
      
      // Draw Sun on top of Side A, clipped by splitY
      if (config.sun.enabled) {
        drawSun(ctx, config.sun, width, height, splitY);
      }
    } else {
      const splitX = Math.floor((config.splitPos / 100) * width);
      drawArea(ctx, config.sideA, { x: 0, y: 0, w: splitX, h: height });
      drawArea(ctx, config.sideB, { x: splitX, y: 0, w: width - splitX, h: height });
    }
  }, [config]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `dual-wallpaper-${config.device}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} className="wallpaper-canvas" />
      <button onClick={handleDownload} className="export-button">Export PNG</button>
    </div>
  );
};

export default Canvas;
