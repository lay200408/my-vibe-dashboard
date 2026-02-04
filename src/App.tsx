import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Weather from './components/Weather';
import Poetry from './components/Poetry';
import Pomodoro from './components/Pomodoro';
import TodoList from './components/TodoList';
import ColorCustomizer from './components/ColorCustomizer';

type View = 'weather' | 'poetry' | 'pomodoro' | 'todo';

function App() {
  const [currentView, setCurrentView] = useState<View>('weather');
  const [themeHue, setThemeHue] = useState(200);

  return (
    <div
      className="min-h-screen w-full flex overflow-hidden relative"
      style={{
        background: `linear-gradient(135deg,
          hsl(${themeHue}, 70%, 85%) 0%,
          hsl(${themeHue + 20}, 60%, 90%) 25%,
          hsl(${themeHue - 20}, 65%, 88%) 50%,
          hsl(${themeHue + 10}, 55%, 92%) 75%,
          hsl(${themeHue}, 70%, 85%) 100%)`,
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
      }}
    >
      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      <Sidebar currentView={currentView} onViewChange={setCurrentView} themeHue={themeHue} />

      <main className="flex-1 flex items-center justify-center p-8 pl-32">
        <div
          className="w-full max-w-3xl backdrop-blur-xl rounded-3xl shadow-2xl p-8 border"
          style={{
            backgroundColor: `hsla(${themeHue}, 70%, 95%, 0.3)`,
            borderColor: `hsla(${themeHue}, 60%, 100%, 0.5)`,
          }}
        >
          {currentView === 'weather' && <Weather themeHue={themeHue} />}
          {currentView === 'poetry' && <Poetry themeHue={themeHue} />}
          {currentView === 'pomodoro' && <Pomodoro themeHue={themeHue} />}
          {currentView === 'todo' && <TodoList themeHue={themeHue} />}
        </div>
      </main>

      <ColorCustomizer themeHue={themeHue} onHueChange={setThemeHue} />
    </div>
  );
}

export default App;
