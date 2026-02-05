import { useState, useRef, useEffect } from 'react';
import { Music, CloudRain, Trees, Waves, Wind, Volume2, VolumeX, X, Bell, Loader2 } from 'lucide-react';

interface SoundscapeProps {
  themeHue: number;
}

const SOUND_LIST = [
    { id: 'rain', name: '夏日细雨', icon: CloudRain, url: '/sounds/rain.mp3' },
    { id: 'forest', name: '静谧森林', icon: Trees, url: '/sounds/forest.mp3' },
    { id: 'ocean', name: '深海律动', icon: Waves, url: '/sounds/ocean.mp3' },
    { id: 'zen', name: '古刹禅音', icon: Bell, url: '/sounds/zen.mp3' },
  ];

export default function Soundscape({ themeHue }: SoundscapeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [loading, setLoading] = useState(false); // ✅ 新增：加载状态
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleSound = async (sound: typeof SOUND_LIST[0]) => {
    if (activeId === sound.id) {
      audioRef.current?.pause();
      setActiveId(null);
    } else {
      setLoading(true);
      setActiveId(sound.id);
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = sound.url;
        // ✅ 关键：设置跨域属性，增加兼容性
        audioRef.current.crossOrigin = "anonymous";
        
        try {
          await audioRef.current.load();
          await audioRef.current.play();
        } catch (e) {
          console.error("音频播放失败，可能是网络问题:", e);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const primaryColor = `hsl(${themeHue}, 70%, 50%)`;

  return (
    <div className="fixed bottom-8 right-28 z-50 flex flex-col items-end">
      {/* 隐藏的音频元素 */}
      <audio ref={audioRef} loop preload="auto" />

      {isOpen && (
        <div 
          className="mb-4 p-6 rounded-3xl backdrop-blur-2xl shadow-2xl border border-white/40 animate-in slide-in-from-bottom-8 duration-500"
          style={{ background: 'rgba(255,255,255,0.25)', width: '280px' }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <Volume2 size={18} /> 氛围音场
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {SOUND_LIST.map((sound) => (
              <button
                key={sound.id}
                onClick={() => toggleSound(sound)}
                disabled={loading && activeId === sound.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 relative overflow-hidden ${
                  activeId === sound.id 
                  ? 'bg-white/50 border-white shadow-lg' 
                  : 'bg-white/10 border-transparent hover:bg-white/20'
                }`}
              >
                {/* 加载中的菊花图 */}
                {loading && activeId === sound.id ? (
                  <Loader2 size={24} className="animate-spin text-gray-400" />
                ) : (
                  <sound.icon 
                    size={24} 
                    style={{ color: activeId === sound.id ? primaryColor : '#64748b' }}
                    className={activeId === sound.id ? 'animate-pulse' : ''}
                  />
                )}
                <span className="text-xs font-medium text-gray-600">{sound.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Volume2 size={18} className="text-gray-400" />
            <input 
              type="range" min="0" max="1" step="0.01" 
              value={volume} 
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1.5 bg-gray-300 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: primaryColor }}
            />
          </div>
        </div>
      )}

      {/* 悬浮入口球 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 hover:scale-110 active:scale-95 border border-white/50 backdrop-blur-md ${
          activeId ? 'animate-bounce-slow' : ''
        }`}
        style={{ 
          backgroundColor: activeId ? primaryColor : 'rgba(255,255,255,0.4)',
          color: activeId ? 'white' : '#64748b',
          boxShadow: activeId ? `0 0 30px ${primaryColor}80` : '0 10px 30px rgba(0,0,0,0.1)'
        }}
      >
        {activeId ? <Music size={24} /> : <Wind size={24} />}
      </button>
    </div>
  );
}