import React, { useState } from 'react';
import { Plus, Trash2, Check, Circle, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Todo } from '../App';

interface TodoListProps {
  themeHue: number;
  todos: Todo[];
  onAddTodo: (text: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

export default function TodoList({ themeHue, todos, onAddTodo, onToggleTodo, onDeleteTodo }: TodoListProps) {
  const [inputValue, setInputValue] = useState('');
  const [isComposing, setIsComposing] = useState(false); // 防止中文输入法回车冲突

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTodo(inputValue.trim());
      setInputValue('');
    }
  };

  const handleToggle = (id: string, completed: boolean) => {
    onToggleTodo(id);
    // 🎉 只有在“未完成 -> 完成”时才撒花
    if (!completed) {
      triggerConfetti();
    }
  };

  // ✨ 多巴胺撒花特效
  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: [`hsl(${themeHue}, 80%, 60%)`, `hsl(${themeHue + 30}, 80%, 60%)`, '#ffffff']
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  const primaryColor = `hsl(${themeHue}, 70%, 50%)`;

  return (
    <div className="h-full flex flex-col animate-in fade-in zoom-in duration-500">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2">
        <span>📝</span> 待办清单
        <span className="text-xs font-normal text-gray-400 bg-white/50 px-2 py-1 rounded-full ml-auto">
          {todos.filter(t => t.completed).length} / {todos.length}
        </span>
      </h2>

      {/* 输入框 */}
      <form onSubmit={handleSubmit} className="relative mb-6 group">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={(e) => {
             if (e.key === 'Enter' && !isComposing) handleSubmit(e);
          }}
          placeholder="添加一个新任务..."
          className="w-full p-4 pl-5 pr-12 rounded-2xl bg-white/40 border border-white/60 focus:bg-white/80 focus:ring-2 focus:ring-white/50 outline-none transition-all placeholder:text-gray-400 text-gray-700 shadow-sm group-hover:shadow-md"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 p-2 bg-white/80 rounded-xl hover:bg-white text-gray-500 hover:text-gray-800 transition-all shadow-sm hover:scale-105 active:scale-95"
          style={{ color: inputValue.trim() ? primaryColor : undefined }}
        >
          <Plus size={20} />
        </button>
      </form>

      {/* 列表区域 */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {todos.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-gray-400 opacity-60">
            <div className="text-4xl mb-2">🍃</div>
            <p className="text-sm">暂无任务，享受当下吧</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`group flex items-center gap-3 p-4 rounded-2xl border transition-all duration-500 ${
                todo.completed
                  ? 'bg-white/20 border-transparent opacity-60'
                  : 'bg-white/60 border-white/40 hover:bg-white/80 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <button
                onClick={() => handleToggle(todo.id, todo.completed)}
                className={`relative flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  todo.completed
                    ? 'border-transparent'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: todo.completed ? primaryColor : 'transparent' }}
              >
                {todo.completed && <Check size={14} className="text-white animate-in zoom-in duration-200" />}
              </button>

              <span
                className={`flex-1 text-sm font-medium transition-all duration-500 relative truncate ${
                  todo.completed ? 'text-gray-400' : 'text-gray-700'
                }`}
              >
                {todo.text}
                {/* 动态删除线 */}
                <span 
                  className={`absolute left-0 top-1/2 h-[1.5px] bg-gray-400 transition-all duration-500 ease-out ${
                    todo.completed ? 'w-full opacity-100' : 'w-0 opacity-0'
                  }`} 
                />
              </span>

              <div className="text-[10px] text-gray-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                {todo.totalFocusTime > 0 && `⏳ ${todo.totalFocusTime}m`}
              </div>

              <button
                onClick={() => onDeleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}