import { Cloud, CloudRain, Sun, CloudSnow, Wind } from 'lucide-react';
import { useEffect, useState } from 'react';

interface WeatherProps {
  themeHue: number;
}

type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';

function Weather({ themeHue }: WeatherProps) {
  const [city] = useState('北京');
  const [temperature] = useState(22);
  const [weatherType] = useState<WeatherType>('sunny');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const weatherIcons = {
    sunny: Sun,
    cloudy: Cloud,
    rainy: CloudRain,
    snowy: CloudSnow,
    windy: Wind,
  };

  const weatherLabels = {
    sunny: '晴天',
    cloudy: '多云',
    rainy: '雨天',
    snowy: '雪天',
    windy: '大风',
  };

  const WeatherIcon = weatherIcons[weatherType];

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
      <div
        className="text-6xl font-light mb-4"
        style={{ color: `hsl(${themeHue}, 50%, 40%)` }}
      >
        {time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
      </div>

      <div
        className="text-xl mb-8"
        style={{ color: `hsl(${themeHue}, 40%, 50%)` }}
      >
        {time.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        })}
      </div>

      <div
        className="backdrop-blur-lg rounded-3xl p-8 shadow-lg border mb-4"
        style={{
          backgroundColor: `hsla(${themeHue}, 70%, 98%, 0.4)`,
          borderColor: `hsla(${themeHue}, 60%, 100%, 0.6)`,
        }}
      >
        <WeatherIcon
          size={80}
          style={{ color: `hsl(${themeHue}, 60%, 45%)` }}
          className="mx-auto mb-4"
        />

        <div className="text-center">
          <div
            className="text-5xl font-bold mb-2"
            style={{ color: `hsl(${themeHue}, 60%, 35%)` }}
          >
            {temperature}°C
          </div>
          <div
            className="text-2xl mb-1"
            style={{ color: `hsl(${themeHue}, 50%, 45%)` }}
          >
            {weatherLabels[weatherType]}
          </div>
          <div
            className="text-lg"
            style={{ color: `hsl(${themeHue}, 40%, 55%)` }}
          >
            {city}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Weather;
