import { useState, useEffect } from 'react';
import { Plus, Check, Trash2 } from 'lucide-react';

interface TodoListProps {
  themeHue: number;
}

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

function TodoList({ themeHue }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        title: newTodo.trim(),
        completed: false,
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[400px] max-h-[600px]">
      <div
        className="text-3xl font-medium mb-6 text-center"
        style={{ color: `hsl(${themeHue}, 60%, 35%)` }}
      >
        今日待办
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="添加新任务..."
          className="flex-1 px-4 py-3 rounded-xl border outline-none"
          style={{
            backgroundColor: `hsla(${themeHue}, 70%, 100%, 0.6)`,
            borderColor: `hsl(${themeHue}, 60%, 85%)`,
            color: `hsl(${themeHue}, 60%, 30%)`,
          }}
        />
        <button
          onClick={addTodo}
          className="px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: `hsla(${themeHue}, 70%, 90%, 0.6)`,
            color: `hsl(${themeHue}, 60%, 40%)`,
          }}
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {todos.length === 0 ? (
          <div
            className="text-center py-12"
            style={{ color: `hsl(${themeHue}, 40%, 60%)` }}
          >
            暂无待办事项
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-[1.02]"
              style={{
                backgroundColor: `hsla(${themeHue}, 70%, 98%, 0.6)`,
              }}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className="flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300"
                style={{
                  borderColor: todo.completed
                    ? `hsl(${themeHue}, 60%, 50%)`
                    : `hsl(${themeHue}, 40%, 70%)`,
                  backgroundColor: todo.completed
                    ? `hsl(${themeHue}, 60%, 50%)`
                    : 'transparent',
                }}
              >
                {todo.completed && <Check size={16} className="text-white" />}
              </button>

              <span
                className={`flex-1 ${todo.completed ? 'line-through' : ''}`}
                style={{
                  color: todo.completed
                    ? `hsl(${themeHue}, 30%, 60%)`
                    : `hsl(${themeHue}, 60%, 30%)`,
                }}
              >
                {todo.title}
              </span>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="flex-shrink-0 p-2 rounded-lg transition-all duration-300 hover:scale-110"
                style={{
                  color: `hsl(${themeHue}, 50%, 50%)`,
                }}
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

export default TodoList;
