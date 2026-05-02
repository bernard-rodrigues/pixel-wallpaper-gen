import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import type { WallpaperConfig, Device, Mode, GradientDirection, AreaConfig, SunConfig } from '../hooks/useWallpaper';

interface ControlsProps {
  config: WallpaperConfig;
  updateGlobal: (updates: Partial<Omit<WallpaperConfig, 'sideA' | 'sideB' | 'sun'>>) => void;
  updateSide: (side: 'sideA' | 'sideB' | 'sun', updates: Partial<AreaConfig> | Partial<SunConfig>) => void;
  regenerateSide: (side: 'sideA' | 'sideB' | 'sun') => void;
}

const Controls: React.FC<ControlsProps> = ({ config, updateGlobal, updateSide, regenerateSide }) => {
  const [activeTab, setActiveTab] = useState<'GLOBAL' | 'SIDE_A' | 'SIDE_B' | 'SUN'>('GLOBAL');

  const renderAreaControls = (side: 'sideA' | 'sideB' | 'sun') => {
    const area = config[side];
    const isSun = side === 'sun';
    
    return (
      <div className="tab-content">
        {isSun && (
          <div className="control-group">
            <label className="toggle-label">
              Enabled
              <input 
                type="checkbox" 
                checked={config.sun.enabled} 
                onChange={(e) => updateSide('sun', { enabled: e.target.checked })} 
              />
            </label>
          </div>
        )}

        {(!isSun || config.sun.enabled) && (
          <>
            {isSun && (
              <>
                <div className="control-group">
                  <label>Pos X: {config.sun.x}%</label>
                  <div className="slider-controls">
                    <input 
                      type="range" min="0" max="100" 
                      value={config.sun.x} 
                      onChange={(e) => updateSide('sun', { x: parseInt(e.target.value) })} 
                    />
                    <div className="step-buttons">
                      <button onClick={() => updateSide('sun', { x: Math.max(0, config.sun.x - 1) })}>-</button>
                      <button onClick={() => updateSide('sun', { x: Math.min(100, config.sun.x + 1) })}>+</button>
                    </div>
                  </div>
                </div>
                <div className="control-group">
                  <label>Pos Y: {config.sun.y}%</label>
                  <div className="slider-controls">
                    <input 
                      type="range" min="0" max="100" 
                      value={config.sun.y} 
                      onChange={(e) => updateSide('sun', { y: parseInt(e.target.value) })} 
                    />
                    <div className="step-buttons">
                      <button onClick={() => updateSide('sun', { y: Math.max(0, config.sun.y - 1) })}>-</button>
                      <button onClick={() => updateSide('sun', { y: Math.min(100, config.sun.y + 1) })}>+</button>
                    </div>
                  </div>
                </div>
                <div className="control-group">
                  <label>Radius: {config.sun.radius}%</label>
                  <div className="slider-controls">
                    <input 
                      type="range" min="1" max="50" 
                      value={config.sun.radius} 
                      onChange={(e) => updateSide('sun', { radius: parseInt(e.target.value) })} 
                    />
                    <div className="step-buttons">
                      <button onClick={() => updateSide('sun', { radius: Math.max(1, config.sun.radius - 1) })}>-</button>
                      <button onClick={() => updateSide('sun', { radius: Math.min(50, config.sun.radius + 1) })}>+</button>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="control-group">
              <label>Base Color: {area.baseColor}</label>
              <HexColorPicker 
                color={area.baseColor} 
                onChange={(color) => updateSide(side, { baseColor: color })} 
              />
            </div>

            <div className="control-group">
              <label>Pixel Size: {area.density}px</label>
              <div className="slider-controls">
                <input 
                  type="range" min="4" max="200" 
                  value={area.density} 
                  onChange={(e) => updateSide(side, { density: parseInt(e.target.value) })} 
                />
                <div className="step-buttons">
                  <button onClick={() => updateSide(side, { density: Math.max(4, area.density - 1) })}>-</button>
                  <button onClick={() => updateSide(side, { density: Math.min(200, area.density + 1) })}>+</button>
                </div>
              </div>
            </div>

            <div className="control-group">
              <label>Hue Var: ±{area.hueRange}°</label>
              <div className="slider-controls">
                <input 
                  type="range" min="0" max="180" 
                  value={area.hueRange} 
                  onChange={(e) => updateSide(side, { hueRange: parseInt(e.target.value) })} 
                />
                <div className="step-buttons">
                  <button onClick={() => updateSide(side, { hueRange: Math.max(0, area.hueRange - 1) })}>-</button>
                  <button onClick={() => updateSide(side, { hueRange: Math.min(180, area.hueRange + 1) })}>+</button>
                </div>
              </div>
            </div>

            <div className="control-group">
              <label>Saturation Var: ±{area.satRange}%</label>
              <div className="slider-controls">
                <input 
                  type="range" min="0" max="100" 
                  value={area.satRange} 
                  onChange={(e) => updateSide(side, { satRange: parseInt(e.target.value) })} 
                />
                <div className="step-buttons">
                  <button onClick={() => updateSide(side, { satRange: Math.max(0, area.satRange - 1) })}>-</button>
                  <button onClick={() => updateSide(side, { satRange: Math.min(100, area.satRange + 1) })}>+</button>
                </div>
              </div>
            </div>

            <div className="control-group">
              <label>Lightness Var: ±{area.lightRange}%</label>
              <div className="slider-controls">
                <input 
                  type="range" min="0" max="100" 
                  value={area.lightRange} 
                  onChange={(e) => updateSide(side, { lightRange: parseInt(e.target.value) })} 
                />
                <div className="step-buttons">
                  <button onClick={() => updateSide(side, { lightRange: Math.max(0, area.lightRange - 1) })}>-</button>
                  <button onClick={() => updateSide(side, { lightRange: Math.min(100, area.lightRange + 1) })}>+</button>
                </div>
              </div>
            </div>

            <div className="control-group">
              <label>Mode</label>
              <select value={area.mode} onChange={(e) => updateSide(side, { mode: e.target.value as Mode })}>
                <option value="RANDOM">Random</option>
                <option value="GRADIENT">Gradient</option>
              </select>
            </div>

            {area.mode === 'GRADIENT' && (
              <>
                <div className="control-group">
                  <label>Colors: {area.gradientColors}</label>
                  <div className="slider-controls">
                    <input 
                      type="range" min="2" max="10" 
                      value={area.gradientColors} 
                      onChange={(e) => updateSide(side, { gradientColors: parseInt(e.target.value) })} 
                    />
                    <div className="step-buttons">
                      <button onClick={() => updateSide(side, { gradientColors: Math.max(2, area.gradientColors - 1) })}>-</button>
                      <button onClick={() => updateSide(side, { gradientColors: Math.min(10, area.gradientColors + 1) })}>+</button>
                    </div>
                  </div>
                </div>
                <div className="control-group">
                  <label>Direction</label>
                  <select 
                    value={area.gradientDirection} 
                    onChange={(e) => updateSide(side, { gradientDirection: e.target.value as GradientDirection })}
                  >
                    <option value="HORIZONTAL">Horizontal</option>
                    <option value="VERTICAL">Vertical</option>
                    <option value="DIAGONAL">Diagonal</option>
                  </select>
                </div>
              </>
            )}
            <button className="regenerate-button" onClick={() => regenerateSide(side)}>
              Regenerate {isSun ? 'Sun' : side === 'sideA' ? 'A' : 'B'}
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="controls-panel">
      <h1>Wallpaper Gen</h1>
      
      <div className="tabs">
        <button className={activeTab === 'GLOBAL' ? 'active' : ''} onClick={() => setActiveTab('GLOBAL')}>Setup</button>
        <button className={activeTab === 'SIDE_A' ? 'active' : ''} onClick={() => setActiveTab('SIDE_A')}>Side A</button>
        <button className={activeTab === 'SIDE_B' ? 'active' : ''} onClick={() => setActiveTab('SIDE_B')}>Side B</button>
        {config.splitAxis === 'HORIZONTAL' && (
          <button className={activeTab === 'SUN' ? 'active' : ''} onClick={() => setActiveTab('SUN')}>Sun</button>
        )}
      </div>

      {activeTab === 'GLOBAL' && (
        <div className="tab-content">
          <div className="control-group">
            <label>Device</label>
            <select value={config.device} onChange={(e) => updateGlobal({ device: e.target.value as Device })}>
              <option value="S23">Galaxy S23</option>
              <option value="TAB_S10_FE">Galaxy Tab S10 FE+</option>
            </select>
          </div>

          <div className="control-group">
            <label>Orientation</label>
            <div className="toggle-group">
              <button 
                className={config.orientation === 'PORTRAIT' ? 'active' : ''} 
                onClick={() => updateGlobal({ orientation: 'PORTRAIT' })}
              >Portrait</button>
              <button 
                className={config.orientation === 'LANDSCAPE' ? 'active' : ''} 
                onClick={() => updateGlobal({ orientation: 'LANDSCAPE' })}
              >Landscape</button>
            </div>
          </div>

          <div className="control-group split-setup">
            <label>Split Axis</label>
            <div className="toggle-group">
              <button 
                className={config.splitAxis === 'HORIZONTAL' ? 'active' : ''} 
                onClick={() => updateGlobal({ splitAxis: 'HORIZONTAL' })}
              >Horizontal</button>
              <button 
                className={config.splitAxis === 'VERTICAL' ? 'active' : ''} 
                onClick={() => updateGlobal({ splitAxis: 'VERTICAL' })}
              >Vertical</button>
            </div>
          </div>

          <div className="control-group">
            <label>Split Position: {config.splitPos}%</label>
            <div className="slider-controls">
              <input 
                type="range" min="0" max="100" 
                value={config.splitPos} 
                onChange={(e) => updateGlobal({ splitPos: parseInt(e.target.value) })} 
              />
              <div className="step-buttons">
                <button onClick={() => updateGlobal({ splitPos: Math.max(0, config.splitPos - 1) })}>-</button>
                <button onClick={() => updateGlobal({ splitPos: Math.min(100, config.splitPos + 1) })}>+</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'SIDE_A' && renderAreaControls('sideA')}
      {activeTab === 'SIDE_B' && renderAreaControls('sideB')}
      {activeTab === 'SUN' && config.splitAxis === 'HORIZONTAL' && renderAreaControls('sun')}
    </div>
  );
};

export default Controls;
