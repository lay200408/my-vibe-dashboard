import { Cloud, BookOpen, Timer, CheckSquare } from 'lucide-react';

type View = 'weather' | 'poetry' | 'pomodoro' | 'todo';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  themeHue: number;
}

function Sidebar({ currentView, onViewChange, themeHue }: SidebarProps) {
  const buttons = [
    { view: 'weather' as View, icon: Cloud, label: '天气' },
    { view: 'poetry' as View, icon: BookOpen, label: '诗词' },
    { view: 'pomodoro' as View, icon: Timer, label: '番茄钟' },
    { view: 'todo' as View, icon: CheckSquare, label: '待办' },
  ];

  return (
    <aside
      className="w-20 flex flex-col items-center py-8 gap-6 backdrop-blur-xl border-r"
      style={{
        backgroundColor: `hsla(${themeHue}, 70%, 95%, 0.2)`,
        borderColor: `hsla(${themeHue}, 60%, 100%, 0.3)`,
      }}
    >
      {buttons.map(({ view, icon: Icon, label }) => (
        <button
          key={view}
          onClick={() => onViewChange(view)}
          className="group relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{
            backgroundColor:
              currentView === view
                ? `hsla(${themeHue}, 70%, 90%, 0.6)`
                : `hsla(${themeHue}, 60%, 100%, 0.2)`,
            boxShadow:
              currentView === view
                ? `0 8px 20px hsla(${themeHue}, 60%, 70%, 0.3)`
                : 'none',
          }}
        >
          <Icon
            size={24}
            style={{
              color: currentView === view ? `hsl(${themeHue}, 60%, 40%)` : `hsl(${themeHue}, 40%, 60%)`,
            }}
          />
          <span
            className="absolute left-full ml-4 px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            style={{
              backgroundColor: `hsla(${themeHue}, 70%, 95%, 0.95)`,
              color: `hsl(${themeHue}, 60%, 30%)`,
            }}
          >
            {label}
          </span>
        </button>
      ))}
    </aside>
  );
}

export default Sidebar;
