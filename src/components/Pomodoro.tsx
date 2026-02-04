import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

interface PomodoroProps {
  themeHue: number;
}

function Pomodoro({ themeHue }: PomodoroProps) {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [minutes, setMinutes] = useState(workMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAy/DdmTsLFGGz6t+gUBELRp/g8r1sIQUrgMvw3Zk7CxRhs+rfoFARCz+U2/K4aSIHKXrI8NyPPgsVX7Dp35lODwtGnuDysWodBSh/yPDajzsKFGCy6t+eTwwLSJ3g8axoHwYogsjw2Ys8CxZhtOndnE0MCz+X2/K4aSIGKXvI8NyOPQsVXrDp35lNDgtGnuDysWoeByh+yPDajjsKFGCy6t+dTw0LSJ3g8axpHwYngsjw2Io8CxVftOnfo1ARCz+V2/K4aSIGKXvI8NyOPQsUXrDp36BODgtFnuDys2seBSh+yPDajjsKE1+y6t+dTw0KSJzg8axpHwYngsjw2Io8CxVftOnfo1ARCz+V2/K4aSIGKXvI8NyOPQsUXrDp36BODgtFnuDys2seBSh+yPDajjsKE1+y6t+dTw0KSJzg8axpHwYngsjw2Io8CxVftOnfo1ARCz+V2/K4aSIGKXvI8NyOPQsUXrDp36BODgtFnuDys2seBSh+yPDajjsKE1+y6t+dTw0KSJzg8axpHwYngsjw2Io8CxVftOnfo1ARCz+V2/K4aSIGKXvI8NyOPQsUXrDp36BODgtFnuDys2seBSh+yPDajjsKE1+y6t+dTw0KSJzg8axpHwYngsjw2Io8CxVftOnfo1ARCz+V2/K4aSIGKXvI8NyOPQsUXrDp36BODgtFnuDys2seBSh+yPDajjsKE1+y6t+dTw0KSJzg8axpHwYngsjw2Io8CxVftOnfo1ARCz+V2/K4aSIGKXvI8NyOPQsUXrDp36BODgtFnuDys2seBSh+yPDajjsKE1+y6t+dTw0KSJzg8axpHwYngsjw2Io8CxVftOnfo1ARCz+V2/K4aSIGKXvI8NyOPQsUXrDp36BODgtFnuDys2seBSh+yPDajjsKE1+y6t+dTw0KSJzg8axpHwYngsjw2Io8CxVftOnfo1ARCz+V2/K4aSIGKXvI8NyOPQsUXrDp36BODgtFnuDys2seBSh+yPDajjsKE1+y6t+dTw0KSJzg8axpHwYngsjw2Io8CxVftOnfo1ARCz+V2/K4aSIGKXvI8NyOPQsUXrDp36BODgtFnuDys2seBSh+yPDajjsKE1+y6t+dTw0KSJzg8axpHwYngsjw2Io8CxVftOnfo1ARCz+V2/K4aSIGKXvI8NyOPQsUXrDp36BODgtFnuDys2seBSh+yPDajjsKE1+y6t+dTw0KSJzg8axpHwYngsjw2Io8CxVftOnfo1ARCz+V2/K4aSIGKXvI8NyOPQsUXrDp36BODgtFnuDys2seBSh+yPDajjsKE1+y6t+dTw0KSJzg8axpHwYngsjw2Io8CxVftOnfo1ARCz+V2/K4aSIGKXvI8NyOPQsUXrDp36BODgtFnuDys2seBSh+yPDajjsKE1+y6t+dTw0KSJzg8axpHwYngsjw2Io8CxVftOnfo1ARCz+V2/K4aSIGKXvI8NyOPQsUXrDp36BODgtFnuDys2seBSh+yPDajjsKE1+y6t+dTw0KSJzg8axpHwYngsjw2Io8CxVftOnfo1ARCz+V2/K4aSIGKXvI8NyOPQsUXrDp36BODgtFnuDys2seBSh+yPDajjsKE1+y6t+dTw0KSJzg8axpHwYngsjw2Io8CxVftOnfo1ARCz+V2/K4aSIGKXvI8NyOPQsUXrDp36BODgtFnuDys2seBSh+yPDajjsKE1+y6t+dTw0KSJzg8axpHwYngsjw2Io8CxVftOnfo1ARC');
            audio.play().catch(() => {});

            if (isWorkTime) {
              setMinutes(breakMinutes);
              setIsWorkTime(false);
            } else {
              setMinutes(workMinutes);
              setIsWorkTime(true);
            }
            setSeconds(0);
            setIsActive(false);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, minutes, seconds, isWorkTime, workMinutes, breakMinutes]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(isWorkTime ? workMinutes : breakMinutes);
    setSeconds(0);
  };

  const handleWorkMinutesChange = (value: number) => {
    if (value > 0 && value <= 60) {
      setWorkMinutes(value);
      if (isWorkTime && !isActive) {
        setMinutes(value);
      }
    }
  };

  const handleBreakMinutesChange = (value: number) => {
    if (value > 0 && value <= 60) {
      setBreakMinutes(value);
      if (!isWorkTime && !isActive) {
        setMinutes(value);
      }
    }
  };

  const percentage = ((isWorkTime ? workMinutes : breakMinutes) * 60 - (minutes * 60 + seconds)) / ((isWorkTime ? workMinutes : breakMinutes) * 60) * 100;

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
      <div
        className="backdrop-blur-lg rounded-3xl p-12 shadow-lg border"
        style={{
          backgroundColor: `hsla(${themeHue}, 70%, 98%, 0.4)`,
          borderColor: `hsla(${themeHue}, 60%, 100%, 0.6)`,
        }}
      >
        <div className="text-center mb-8">
          <div
            className="text-2xl mb-4 font-medium"
            style={{ color: `hsl(${themeHue}, 60%, 40%)` }}
          >
            {isWorkTime ? '工作时间' : '休息时间'}
          </div>

          <div className="relative w-64 h-64 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke={`hsl(${themeHue}, 60%, 90%)`}
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke={`hsl(${themeHue}, 60%, 50%)`}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - percentage / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="text-6xl font-light"
                style={{ color: `hsl(${themeHue}, 60%, 35%)` }}
              >
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={toggleTimer}
              className="p-4 rounded-xl transition-all duration-300 hover:scale-110"
              style={{
                backgroundColor: `hsla(${themeHue}, 70%, 90%, 0.6)`,
                color: `hsl(${themeHue}, 60%, 40%)`,
              }}
            >
              {isActive ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={resetTimer}
              className="p-4 rounded-xl transition-all duration-300 hover:scale-110"
              style={{
                backgroundColor: `hsla(${themeHue}, 70%, 90%, 0.6)`,
                color: `hsl(${themeHue}, 60%, 40%)`,
              }}
            >
              <RotateCcw size={24} />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-4 rounded-xl transition-all duration-300 hover:scale-110"
              style={{
                backgroundColor: `hsla(${themeHue}, 70%, 90%, 0.6)`,
                color: `hsl(${themeHue}, 60%, 40%)`,
              }}
            >
              <Settings size={24} />
            </button>
          </div>
        </div>

        {showSettings && (
          <div
            className="mt-6 p-6 rounded-2xl"
            style={{
              backgroundColor: `hsla(${themeHue}, 70%, 95%, 0.6)`,
            }}
          >
            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: `hsl(${themeHue}, 60%, 40%)` }}
                >
                  工作时间（分钟）
                </label>
                <input
                  type="number"
                  value={workMinutes}
                  onChange={(e) => handleWorkMinutesChange(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border outline-none"
                  style={{
                    backgroundColor: `hsla(${themeHue}, 70%, 100%, 0.8)`,
                    borderColor: `hsl(${themeHue}, 60%, 85%)`,
                    color: `hsl(${themeHue}, 60%, 30%)`,
                  }}
                  min="1"
                  max="60"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: `hsl(${themeHue}, 60%, 40%)` }}
                >
                  休息时间（分钟）
                </label>
                <input
                  type="number"
                  value={breakMinutes}
                  onChange={(e) => handleBreakMinutesChange(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border outline-none"
                  style={{
                    backgroundColor: `hsla(${themeHue}, 70%, 100%, 0.8)`,
                    borderColor: `hsl(${themeHue}, 60%, 85%)`,
                    color: `hsl(${themeHue}, 60%, 30%)`,
                  }}
                  min="1"
                  max="60"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pomodoro;
