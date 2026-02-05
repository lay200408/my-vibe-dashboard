import { useState, useEffect } from 'react';
import { CloudSun, MapPin, Loader2, RefreshCw, CloudRain, Sun, Cloud, Snowflake, Wind, Thermometer } from 'lucide-react';

interface WeatherProps { 
  themeHue: number;
  onWeatherUpdate?: (hue: number) => void;
}

export default function Weather({ themeHue, onWeatherUpdate }: WeatherProps) {
  const [weatherData, setWeatherData] = useState({
    city: '定位中...',
    temp: '--',
    condition: '正在观测',
    icon: 'Sun'
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchWeather = async () => {
    setIsLoading(true);
    try {
      const pos: any = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = pos.coords;

      const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=zh`);
      const geoData = await geoRes.json();
      const cityName = geoData.city || geoData.locality || '未知城市';

      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      const data = await weatherRes.json();
      const current = data.current_weather;

      const codeMap: any = {
        0: { text: '晴朗', icon: 'Sun', hue: 45 },
        1: { text: '晴间多云', icon: 'CloudSun', hue: 35 },
        2: { text: '多云', icon: 'Cloud', hue: 200 },
        3: { text: '阴天', icon: 'Cloud', hue: 210 },
        45: { text: '有雾', icon: 'Wind', hue: 180 },
        61: { text: '小雨', icon: 'CloudRain', hue: 220 },
        71: { text: '小雪', icon: 'Snowflake', hue: 280 },
      };
      
      const info = codeMap[current.weathercode] || { text: '多云', icon: 'Cloud', hue: 200 };

      setWeatherData({
        city: cityName,
        temp: Math.round(current.temperature).toString(),
        condition: info.text,
        icon: info.icon
      });

      if (onWeatherUpdate) onWeatherUpdate(info.hue);

    } catch (error) {
      setWeatherData(prev => ({ ...prev, city: '授权定位', condition: '请允许权限' }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchWeather(); }, []);

  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const WeatherIconMap: any = { Sun, CloudSun, Cloud, CloudRain, Snowflake, Wind };
  const WeatherIcon = WeatherIconMap[weatherData.icon] || Sun;

  // 动态图标动画类
  const iconAnimation = weatherData.icon === 'Sun' ? 'animate-[spin_12s_linear_infinite]' : 'animate-bounce-slow';

  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-700 animate-in fade-in duration-1000 relative">
      
      {/* 🕰️ 顶部时钟区域 */}
      <div className="text-center mb-16">
        <div className="text-8xl font-black tracking-tighter tabular-nums opacity-80 mb-2 drop-shadow-sm">
          {time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          <span className="text-2xl font-light opacity-30 ml-2 animate-pulse">
            {time.getSeconds().toString().padStart(2, '0')}
          </span>
        </div>
        <div className="text-xs opacity-40 tracking-[0.4em] font-bold uppercase">
          {time.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}
        </div>
      </div>

      {/* 🌡️ 天气玻璃卡片 */}
      <div 
        className="group relative p-12 rounded-[4rem] backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/60 flex flex-col items-center transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_48px_80px_-20px_rgba(0,0,0,0.15)] overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.15)' }}
      >
        {/* 内部溢光效果 */}
        <div 
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-[80px] opacity-40 transition-all duration-1000 group-hover:scale-150"
          style={{ backgroundColor: `hsl(${themeHue}, 80%, 70%)` }}
        />

        {/* 动态图标 */}
        <div className={`mb-8 relative ${iconAnimation}`}>
          <div 
            className="absolute inset-0 rounded-full blur-2xl opacity-20"
            style={{ backgroundColor: `hsl(${themeHue}, 100%, 60%)` }}
          />
          <WeatherIcon 
            size={88} 
            className="relative drop-shadow-2xl"
            style={{ color: `hsl(${themeHue}, 70%, 55%)` }}
            strokeWidth={1.5}
          />
        </div>

        {/* 温度展示 */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-start">
            <span className="text-8xl font-black tracking-tighter text-gray-800 leading-none">
              {weatherData.temp}
            </span>
            <span className="text-3xl font-light mt-2 ml-1 opacity-30 flex items-center gap-1">
              °C <Thermometer size={20} />
            </span>
          </div>
          <div className="mt-4 text-sm font-bold tracking-[0.5em] text-gray-400 uppercase">
            {weatherData.condition}
          </div>
        </div>

        {/* 底部定位胶囊 */}
        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/40 border border-white/40 shadow-inner group/btn transition-all duration-300">
          <div className="flex items-center gap-2">
            {isLoading ? (
              <Loader2 size={14} className="animate-spin text-gray-400" />
            ) : (
              <MapPin size={14} className="text-gray-400 group-hover/btn:animate-bounce" />
            )}
            <span className="text-[11px] font-bold text-gray-500 tracking-wider">
              {weatherData.city}
            </span>
          </div>
          
          <div className="w-[1px] h-3 bg-gray-300 mx-1" />
          
          <button 
            onClick={fetchWeather} 
            className="group-hover/btn:rotate-180 transition-all duration-700 ease-in-out"
            title="刷新天气"
          >
            <RefreshCw size={12} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}