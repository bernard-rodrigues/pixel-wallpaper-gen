import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import type { WallpaperConfig, Device, Mode, GradientDirection, AreaConfig, SunConfig } from '../hooks/useWallpaper';

interface ControlsProps {
  config: WallpaperConfig;
  updateGlobal: (updates: Partial<Omit<WallpaperConfig, 'sideA' | 'sideB' | 'sun'>>) => void;
  updateSide: (side: 'sideA' | 'sideB' | 'sun', updates: Partial<AreaConfig> | Partial<SunConfig>) => void;
  regenerateSide: (side: 'sideA' | 'sideB' | 'sun') => void;
}

interface ExpandableSliderProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (val: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const ExpandableSlider: React.FC<ExpandableSliderProps> = ({ 
  label, value, unit, min, max, onChange, isOpen, onToggle 
}) => {
  return (
    <div className={`expandable-control ${isOpen ? 'full-width' : ''}`}>
      <button className={`expand-button ${isOpen ? 'active' : ''}`} onClick={onToggle}>
        <span className="prop-name">{label}:</span>
        <span className="prop-value">{value}{unit}</span>
      </button>
      {isOpen && (
        <div className="slider-popover">
          <input 
            type="range" min={min} max={max} 
            value={value} 
            onChange={(e) => onChange(parseInt(e.target.value))} 
          />
          <div className="step-buttons">
            <button onClick={() => onChange(Math.max(min, value - 1))}>-</button>
            <button onClick={() => onChange(Math.min(max, value + 1))}>+</button>
          </div>
        </div>
      )}
    </div>
  );
};

const Controls: React.FC<ControlsProps> = ({ config, updateGlobal, updateSide, regenerateSide }) => {
  const [activeTab, setActiveTab] = useState<'GLOBAL' | 'SIDE_A' | 'SIDE_B' | 'SUN'>('GLOBAL');
  const [openSlider, setOpenSlider] = useState<string | null>(null);

  const toggleSlider = (id: string) => {
    setOpenSlider(openSlider === id ? null : id);
  };

  const renderAreaControls = (side: 'sideA' | 'sideB' | 'sun') => {
    const area = config[side];
    const isSun = side === 'sun';
    const prefix = side.toUpperCase();
    
    return (
      <div className="tab-content">
        <div className="control-group">
          <label>Style & Mode</label>
          <select value={area.mode} onChange={(e) => updateSide(side, { mode: e.target.value as Mode })}>
            <option value="RANDOM">Random (Pixelated)</option>
            <option value="GRADIENT">Gradient</option>
          </select>
          
          <button className="expand-button" onClick={() => toggleSlider(`${prefix}_COLOR`)}>
            <span>Base Color</span>
            <div style={{ width: 20, height: 20, borderRadius: 4, backgroundColor: area.baseColor, border: '1px solid #555' }} />
          </button>
          {openSlider === `${prefix}_COLOR` && (
            <div className="slider-popover">
              <HexColorPicker 
                color={area.baseColor} 
                onChange={(color) => updateSide(side, { baseColor: color })} 
              />
            </div>
          )}
        </div>

        {isSun && (
          <div className="control-group">
            <label>Sun Configuration</label>
            <div className="toggle-group">
              <button className={config.sun.enabled ? 'active' : ''} onClick={() => updateSide('sun', { enabled: true })}>Enabled</button>
              <button className={!config.sun.enabled ? 'active' : ''} onClick={() => updateSide('sun', { enabled: false })}>Disabled</button>
            </div>
            <div className="toggle-group">
              <button className={config.sun.reflection ? 'active' : ''} onClick={() => updateSide('sun', { reflection: true })}>Reflection On</button>
              <button className={!config.sun.reflection ? 'active' : ''} onClick={() => updateSide('sun', { reflection: false })}>Reflection Off</button>
            </div>
          </div>
        )}

        {(!isSun || config.sun.enabled) && (
          <>
            {isSun && (
              <div className="control-group">
                <label>Position & Size</label>
                <ExpandableSlider label="Pos X" value={config.sun.x} unit="%" min={0} max={100} onChange={(v) => updateSide('sun', { x: v })} isOpen={openSlider === 'SUN_X'} onToggle={() => toggleSlider('SUN_X')} />
                <ExpandableSlider label="Pos Y" value={config.sun.y} unit="%" min={0} max={100} onChange={(v) => updateSide('sun', { y: v })} isOpen={openSlider === 'SUN_Y'} onToggle={() => toggleSlider('SUN_Y')} />
                <ExpandableSlider label="Radius" value={config.sun.radius} unit="%" min={1} max={50} onChange={(v) => updateSide('sun', { radius: v })} isOpen={openSlider === 'SUN_R'} onToggle={() => toggleSlider('SUN_R')} />
              </div>
            )}

            <div className="control-group">
              <label>Variations</label>
              <ExpandableSlider label="Pixel Size" value={area.density} unit="px" min={4} max={200} onChange={(v) => updateSide(side, { density: v })} isOpen={openSlider === `${prefix}_DEN`} onToggle={() => toggleSlider(`${prefix}_DEN`)} />
              <ExpandableSlider label="Hue" value={area.hueRange} unit="°" min={0} max={180} onChange={(v) => updateSide(side, { hueRange: v })} isOpen={openSlider === `${prefix}_HUE`} onToggle={() => toggleSlider(`${prefix}_HUE`)} />
              <ExpandableSlider label="Saturation" value={area.satRange} unit="%" min={0} max={100} onChange={(v) => updateSide(side, { satRange: v })} isOpen={openSlider === `${prefix}_SAT`} onToggle={() => toggleSlider(`${prefix}_SAT`)} />
              <ExpandableSlider label="Lightness" value={area.lightRange} unit="%" min={0} max={100} onChange={(v) => updateSide(side, { lightRange: v })} isOpen={openSlider === `${prefix}_LIT`} onToggle={() => toggleSlider(`${prefix}_LIT`)} />
            </div>

            {area.mode === 'GRADIENT' && (
              <div className="control-group">
                <label>Gradient Settings</label>
                <ExpandableSlider label="Color Count" value={area.gradientColors} unit="" min={2} max={10} onChange={(v) => updateSide(side, { gradientColors: v })} isOpen={openSlider === `${prefix}_GCOL`} onToggle={() => toggleSlider(`${prefix}_GCOL`)} />
                <select 
                  value={area.gradientDirection} 
                  onChange={(e) => updateSide(side, { gradientDirection: e.target.value as GradientDirection })}
                >
                  <option value="HORIZONTAL">Horizontal</option>
                  <option value="VERTICAL">Vertical</option>
                  <option value="DIAGONAL">Diagonal</option>
                </select>
              </div>
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
      <h1>Pixel Sunset Gen</h1>
      
      <div className="tabs">
        <button className={activeTab === 'GLOBAL' ? 'active' : ''} onClick={() => setActiveTab('GLOBAL')}>Setup</button>
        <button className={activeTab === 'SIDE_A' ? 'active' : ''} onClick={() => setActiveTab('SIDE_A')}>Area A</button>
        <button className={activeTab === 'SIDE_B' ? 'active' : ''} onClick={() => setActiveTab('SIDE_B')}>Area B</button>
        {config.splitAxis === 'HORIZONTAL' && (
          <button className={activeTab === 'SUN' ? 'active' : ''} onClick={() => setActiveTab('SUN')}>Sun</button>
        )}
      </div>

      {activeTab === 'GLOBAL' && (
        <div className="tab-content">
          <div className="control-group">
            <label>Device Specification</label>
            <select value={config.device} onChange={(e) => updateGlobal({ device: e.target.value as Device })}>
              <option value="S23">Galaxy S23</option>
              <option value="TAB_S10_FE">Galaxy Tab S10 FE+</option>
              <option value="CUSTOM">Custom</option>
            </select>
            
            {config.device === 'CUSTOM' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--label-color)', fontWeight: 700 }}>Width</span>
                  <input 
                    type="number" 
                    value={config.customWidth} 
                    onChange={(e) => updateGlobal({ customWidth: parseInt(e.target.value) || 0 })}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color)', 
                      backgroundColor: 'var(--input-bg)', 
                      color: 'var(--text-color)',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--label-color)', fontWeight: 700 }}>Height</span>
                  <input 
                    type="number" 
                    value={config.customHeight} 
                    onChange={(e) => updateGlobal({ customHeight: parseInt(e.target.value) || 0 })}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color)', 
                      backgroundColor: 'var(--input-bg)', 
                      color: 'var(--text-color)',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  />
                </div>
              </>
            )}

            <div className="toggle-group">
              <button className={config.orientation === 'PORTRAIT' ? 'active' : ''} onClick={() => updateGlobal({ orientation: 'PORTRAIT' })}>Portrait</button>
              <button className={config.orientation === 'LANDSCAPE' ? 'active' : ''} onClick={() => updateGlobal({ orientation: 'LANDSCAPE' })}>Landscape</button>
            </div>
          </div>

          <div className="control-group">
            <label>Interface Theme</label>
            <div className="toggle-group">
              <button 
                className={config.themeMode === 'LIGHT' ? 'active' : ''} 
                onClick={() => updateGlobal({ themeMode: 'LIGHT' })}
              >Light</button>
              <button 
                className={config.themeMode === 'DARK' ? 'active' : ''} 
                onClick={() => updateGlobal({ themeMode: 'DARK' })}
              >Dark</button>
            </div>
          </div>

          <div className="control-group">
            <label>Canvas Division</label>
            <div className="toggle-group">
              <button className={config.splitAxis === 'HORIZONTAL' ? 'active' : ''} onClick={() => updateGlobal({ splitAxis: 'HORIZONTAL' })}>Horizontal</button>
              <button className={config.splitAxis === 'VERTICAL' ? 'active' : ''} onClick={() => updateGlobal({ splitAxis: 'VERTICAL' })}>Vertical</button>
            </div>
            <ExpandableSlider label="Split Position" value={config.splitPos} unit="%" min={0} max={100} onChange={(v) => updateGlobal({ splitPos: v })} isOpen={openSlider === 'GLOBAL_SPLIT'} onToggle={() => toggleSlider('GLOBAL_SPLIT')} />
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
