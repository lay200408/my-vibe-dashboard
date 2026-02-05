import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Weather from './components/Weather';
import Poetry from './components/Poetry';
import Pomodoro from './components/Pomodoro';
import TodoList from './components/TodoList';
import ColorCustomizer from './components/ColorCustomizer';
import Soundscape from './components/Soundscape';
import BackgroundEffects from './components/BackgroundEffects';

type View = 'weather' | 'poetry' | 'pomodoro' | 'todo';
export interface Todo { id: string; text: string; completed: boolean; totalFocusTime: number; }

function App() {
  const [currentView, setCurrentView] = useState<View>('pomodoro');
  const [themeHue, setThemeHue] = useState(200);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isZenMode, setIsZenMode] = useState(false);
  const [todayFocusMinutes, setTodayFocusMinutes] = useState(0);

  const timeStyles = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) return { brightness: '1', contrast: '1', saturate: '1' };
    if (hour >= 18 && hour < 21) return { brightness: '0.8', contrast: '1.1', saturate: '0.8' };
    return { brightness: '0.6', contrast: '1.2', saturate: '0.5' };
  }, []);

  const syncTodayStats = useCallback(() => {
    const savedHistory = localStorage.getItem('pomodoro_focus_history');
    if (!savedHistory) return setTodayFocusMinutes(0);
    try {
      const history = JSON.parse(savedHistory);
      const today = new Date().toDateString();
      setTodayFocusMinutes(history.filter((ts: number) => new Date(ts).toDateString() === today).length);
    } catch (e) { setTodayFocusMinutes(0); }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) try { setTodos(JSON.parse(saved)); } catch (e) { console.error(e); }
    syncTodayStats();
    window.addEventListener('storage', syncTodayStats);
    return () => window.removeEventListener('storage', syncTodayStats);
  }, [syncTodayStats]);

  useEffect(() => { localStorage.setItem('todos', JSON.stringify(todos)); }, [todos]);

  return (
    <div className="min-h-screen w-full flex overflow-hidden relative transition-all duration-[2000ms]"
      style={{ 
        background: `linear-gradient(135deg, hsl(${themeHue}, 70%, 85%), hsl(${themeHue + 20}, 60%, 90%))`,
        filter: `brightness(${timeStyles.brightness}) contrast(${timeStyles.contrast}) saturate(${timeStyles.saturate})` 
      }}>
      
      <BackgroundEffects themeHue={themeHue} />

      <motion.div animate={{ opacity: isZenMode ? 0 : 1, x: isZenMode ? -40 : 0 }}>
        <Sidebar currentView={currentView} onViewChange={setCurrentView} themeHue={themeHue} />
      </motion.div>

      <main className="flex-1 flex items-center justify-center p-8 pl-32 relative z-10">
        <LayoutGroup>
          {/* 🛡️ 唯一、固定的母盒容器 */}
          <motion.div 
            layout // ✅ 高度伸缩的核心：自动计算子元素高度并平滑过渡
            className={`relative w-full max-w-3xl backdrop-blur-3xl rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] p-12 border overflow-hidden transition-colors duration-1000 ${
              isZenMode ? 'bg-white/5 border-transparent shadow-none' : 'bg-white/30 border-white/60'
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full h-full"
              >
                {currentView === 'weather' && <Weather themeHue={themeHue} onWeatherUpdate={setThemeHue} />}
                {currentView === 'poetry' && <Poetry themeHue={themeHue} />}
                
                {currentView === 'pomodoro' && (
                  <Pomodoro 
                    themeHue={themeHue} 
                    todos={todos} 
                    onUpdateTodoFocusTime={(id, m) => setTodos(prev => prev.map(t => t.id === id ? {...t, totalFocusTime: t.totalFocusTime + m} : t))} 
                    onZenChange={setIsZenMode} 
                    onStatsUpdate={syncTodayStats} 
                  />
                )}

                {currentView === 'todo' && (
                  <TodoList 
                    themeHue={themeHue} 
                    todos={todos} 
                    onAddTodo={(text) => setTodos([...todos, { id: Date.now().toString(), text, completed: false, totalFocusTime: 0 }])} 
                    onToggleTodo={(id) => setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))} 
                    onDeleteTodo={(id) => setTodos(todos.filter(t => t.id !== id))} 
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {!isZenMode && (
              <motion.div layout className="mt-12 pt-8 border-t border-white/20 text-center">
                <span className="text-[10px] font-black tracking-[0.5em] uppercase text-gray-500/50">
                  Focus • {todayFocusMinutes} Minutes Achieved
                </span>
              </motion.div>
            )}
          </motion.div>
        </LayoutGroup>
      </main>

      <motion.div animate={{ opacity: isZenMode ? 0 : 1, y: isZenMode ? 20 : 0 }}>
        <ColorCustomizer themeHue={themeHue} onHueChange={setThemeHue} />
      </motion.div>
      
      <Soundscape themeHue={themeHue} /> 
    </div>
  );
}

export default App;