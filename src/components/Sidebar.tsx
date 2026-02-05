import React from 'react';
import { motion } from 'framer-motion'; // ✅ 引入动效库
import { Cloud, Quote, Timer, CheckSquare, Settings } from 'lucide-react';

type View = 'weather' | 'poetry' | 'pomodoro' | 'todo';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  themeHue: number;
}

const menuItems: { id: View; icon: any; label: string }[] = [
  { id: 'weather', icon: Cloud, label: '天气' },
  { id: 'poetry', icon: Quote, label: '诗词' },
  { id: 'pomodoro', icon: Timer, label: '专注' },
  { id: 'todo', icon: CheckSquare, label: '清单' },
];

export default function Sidebar({ currentView, onViewChange, themeHue }: SidebarProps) {
  const primaryColor = `hsl(${themeHue}, 70%, 50%)`;

  return (
    <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-50">
      <div 
        className="flex flex-col gap-4 p-3 rounded-[2.5rem] backdrop-blur-2xl border border-white/40 shadow-2xl"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
      >
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className="relative w-14 h-14 flex items-center justify-center rounded-3xl transition-colors duration-300 group"
              title={item.label}
            >
              {/* ✨ 魔法滑动指示器 */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-bg" // ✅ 核心：相同 ID 触发自动滑动
                  className="absolute inset-0 rounded-[1.25rem] shadow-lg"
                  style={{ 
                    backgroundColor: 'white',
                    boxShadow: `0 10px 20px -5px hsla(${themeHue}, 50%, 30%, 0.2)` 
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                />
              )}

              {/* 图标 */}
              <motion.div
                animate={{ 
                  scale: isActive ? 1.1 : 1,
                  color: isActive ? primaryColor : 'rgba(75, 85, 99, 0.6)' 
                }}
                className="relative z-10"
              >
                <Icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </motion.div>

              {/* 悬浮提示小点 */}
              {!isActive && (
                <div 
                  className="absolute right-[-4px] w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: primaryColor }}
                />
              )}
            </button>
          );
        })}

        <div className="w-8 h-[1px] bg-white/20 mx-auto my-2" />

        {/* 设置按钮 */}
        <button className="w-14 h-14 flex items-center justify-center text-gray-400/60 hover:text-gray-600 transition-colors">
          <Settings size={22} />
        </button>
      </div>
    </aside>
  );
}