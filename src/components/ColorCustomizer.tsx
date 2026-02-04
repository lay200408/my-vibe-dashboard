import { Palette } from 'lucide-react';
import { useState } from 'react';

interface ColorCustomizerProps {
  themeHue: number;
  onHueChange: (hue: number) => void;
}

function ColorCustomizer({ themeHue, onHueChange }: ColorCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const presetColors = [
    { name: '天蓝', hue: 200 },
    { name: '青绿', hue: 160 },
    { name: '薄荷', hue: 140 },
    { name: '玫瑰', hue: 340 },
    { name: '紫罗兰', hue: 280 },
    { name: '橙色', hue: 30 },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen && (
        <div
          className="mb-4 p-6 rounded-2xl backdrop-blur-xl shadow-2xl border"
          style={{
            backgroundColor: `hsla(${themeHue}, 70%, 95%, 0.95)`,
            borderColor: `hsla(${themeHue}, 60%, 100%, 0.5)`,
          }}
        >
          <div
            className="text-sm font-medium mb-4"
            style={{ color: `hsl(${themeHue}, 60%, 35%)` }}
          >
            选择主题颜色
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {presetColors.map((color) => (
              <button
                key={color.hue}
                onClick={() => onHueChange(color.hue)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 hover:scale-110"
                style={{
                  backgroundColor:
                    themeHue === color.hue
                      ? `hsla(${color.hue}, 70%, 90%, 0.8)`
                      : `hsla(${color.hue}, 70%, 95%, 0.4)`,
                  border:
                    themeHue === color.hue
                      ? `2px solid hsl(${color.hue}, 60%, 50%)`
                      : '2px solid transparent',
                }}
              >
                <div
                  className="w-8 h-8 rounded-full"
                  style={{
                    backgroundColor: `hsl(${color.hue}, 70%, 85%)`,
                  }}
                />
                <span
                  className="text-xs"
                  style={{ color: `hsl(${color.hue}, 60%, 40%)` }}
                >
                  {color.name}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <div
              className="text-xs font-medium"
              style={{ color: `hsl(${themeHue}, 60%, 40%)` }}
            >
              自定义色相
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={themeHue}
              onChange={(e) => onHueChange(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right,
                  hsl(0, 70%, 85%),
                  hsl(60, 70%, 85%),
                  hsl(120, 70%, 85%),
                  hsl(180, 70%, 85%),
                  hsl(240, 70%, 85%),
                  hsl(300, 70%, 85%),
                  hsl(360, 70%, 85%))`,
              }}
            />
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full backdrop-blur-xl shadow-2xl border flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{
          backgroundColor: `hsla(${themeHue}, 70%, 95%, 0.9)`,
          borderColor: `hsla(${themeHue}, 60%, 100%, 0.5)`,
          color: `hsl(${themeHue}, 60%, 45%)`,
        }}
      >
        <Palette size={24} />
      </button>
    </div>
  );
}

export default ColorCustomizer;
