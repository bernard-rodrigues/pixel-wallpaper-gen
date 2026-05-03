import Controls from './components/Controls';
import Canvas from './components/Canvas';
import { useWallpaper } from './hooks/useWallpaper';
import './styles/main.css';

function App() {
  const { config, updateGlobal, updateSide, regenerateSide } = useWallpaper();

  return (
    <div className={`app-container theme-${config.themeMode.toLowerCase()}`}>
      <Controls 
        config={config} 
        updateGlobal={updateGlobal} 
        updateSide={updateSide} 
        regenerateSide={regenerateSide} 
      />
      <main className="preview-area">
        <Canvas config={config} />
      </main>
    </div>
  );
}

export default App;
