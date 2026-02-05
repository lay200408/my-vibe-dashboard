import { useState, useEffect } from 'react';
import { RefreshCw, Quote } from 'lucide-react';

interface PoetryProps {
  themeHue: number;
}

interface Poem {
  content: string;
  author: string;
  origin: string;
}

function Poetry({ themeHue }: PoetryProps) {
  const [currentPoem, setCurrentPoem] = useState<Poem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPoem = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://v1.jinrishici.com/all.json');
      const data = await response.json();

      setCurrentPoem({
        content: data.content,
        author: data.author,
        origin: data.origin,
      });
    } catch (error) {
      console.error('获取诗词失败：', error);
    } finally {
      // 增加一个小小的延迟，让过渡动画更丝滑
      setTimeout(() => setLoading(false), 400);
    }
  };

  useEffect(() => {
    fetchPoem();
  }, []);

  const primaryColor = `hsl(${themeHue}, 60%, 35%)`;
  const glassBg = `hsla(${themeHue}, 70%, 98%, 0.4)`;

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[500px] px-8 relative overflow-hidden">
      {/* 背景装饰性文字 */}
      <div className="absolute top-0 right-10 text-[20rem] font-serif opacity-5 select-none pointer-events-none" style={{ color: primaryColor }}>
        詩
      </div>

      <div
        className={`backdrop-blur-xl rounded-3xl p-16 shadow-2xl border transition-all duration-1000 ${loading ? 'opacity-0 scale-95 blur-md' : 'opacity-100 scale-100 blur-0'}`}
        style={{
          backgroundColor: glassBg,
          borderColor: `hsla(${themeHue}, 60%, 100%, 0.6)`,
          boxShadow: `0 30px 60px -12px hsla(${themeHue}, 20%, 30%, 0.1)`,
        }}
      >
        {currentPoem && (
          <div 
            className="flex flex-row-reverse gap-10 justify-center items-start min-h-[300px]"
            style={{ 
              writingMode: 'vertical-rl', 
              textOrientation: 'upright'
            }}
          >
            {/* 1. 标题 (书名号风格) */}
            <h2 
              className="font-serif text-2xl font-bold tracking-[0.3em] opacity-80"
              style={{ color: primaryColor }}
            >
              《{currentPoem.origin}》
            </h2>

            {/* 2. 诗词主体 (加大字号和间距) */}
            <p 
              className="font-serif text-4xl leading-[1.8] tracking-[0.2em] text-gray-800 h-full flex items-center"
              style={{ textUnderlineOffset: '12px' }}
            >
              {currentPoem.content}
            </p>

            {/* 3. 落款与红色印章 */}
            <div className="flex flex-col items-center gap-6 self-end pt-12">
               {/* 红色印章样式 */}
              <div 
                className="w-10 h-10 rounded-sm border-2 border-red-700 bg-red-50 text-red-800 flex items-center justify-center text-sm font-serif font-bold opacity-80 shadow-sm"
                style={{ writingMode: 'horizontal-tb' }}
              >
                {currentPoem.author.charAt(0)}
              </div>
              <span 
                className="font-serif text-base tracking-[0.5em] opacity-60"
                style={{ color: primaryColor }}
              >
                {currentPoem.author}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 控制按钮 */}
      <div className="mt-12 flex items-center gap-4">
        <button
          onClick={fetchPoem}
          disabled={loading}
          className="group flex items-center gap-2 px-8 py-3 rounded-full bg-white/40 hover:bg-white/80 transition-all shadow-sm hover:shadow-md text-gray-600 hover:text-gray-900"
        >
          <RefreshCw 
            size={18} 
            className={`transition-transform duration-1000 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} 
            style={{ color: primaryColor }}
          />
          <span className="text-xs font-bold tracking-widest uppercase">换一首</span>
        </button>
      </div>
    </div>
  );
}

export default Poetry;  