import { useState, useEffect, useMemo, useRef } from 'react';
import { Play, Pause, RotateCcw, BarChart2, ArrowLeft, Edit2, Square, Calendar, Send, Sparkles, Clock, Share2 } from 'lucide-react';
import { BarChart, Bar, Cell, XAxis, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import { Todo } from '../App';

interface PomodoroProps {
  themeHue: number;
  todos: Todo[];
  onUpdateTodoFocusTime: (id: string, minutes: number) => void;
  onZenChange?: (isZen: boolean) => void;
  onStatsUpdate?: () => void;
}

interface LogEntry {
  id: string;
  startTime: number;
  endTime: number;
  content: string;
  taskId?: string;
}

export default function Pomodoro({ themeHue, todos, onUpdateTodoFocusTime, onZenChange, onStatsUpdate }: PomodoroProps) {
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [dailyGoal, setDailyGoal] = useState(120);
  const [focusHistory, setFocusHistory] = useState<number[]>([]);
  
  const [showLogModal, setShowLogModal] = useState(false);
  const [logContent, setLogContent] = useState('');
  const [flowLogs, setFlowLogs] = useState<LogEntry[]>([]);
  const [currentStartTime, setCurrentStartTime] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedGoal = localStorage.getItem('pomodoro_daily_goal');
    const savedHistory = localStorage.getItem('pomodoro_focus_history');
    const savedLogs = localStorage.getItem('pomodoro_flow_logs');
    if (savedGoal) setDailyGoal(parseInt(savedGoal));
    if (savedHistory) try { setFocusHistory(JSON.parse(savedHistory)); } catch (e) {}
    if (savedLogs) try { setFlowLogs(JSON.parse(savedLogs)); } catch (e) {}
  }, []);

  useEffect(() => { if (onZenChange) onZenChange(isActive && !isBreak); }, [isActive, isBreak, onZenChange]);

  const recordFocusMinute = () => {
    const now = Date.now();
    const newHistory = [...focusHistory, now];
    setFocusHistory(newHistory);
    localStorage.setItem('pomodoro_focus_history', JSON.stringify(newHistory));
    if (onStatsUpdate) onStatsUpdate();
  };

  const saveLog = () => {
    if (!logContent.trim()) { setShowLogModal(false); return; }
    const startT = currentStartTime || Date.now() - (duration * 60 * 1000);
    const newEntry: LogEntry = {
      id: Date.now().toString(),
      startTime: startT,
      endTime: Date.now(),
      content: logContent,
      taskId: activeTaskId || undefined
    };
    const updatedLogs = [newEntry, ...flowLogs].slice(0, 50);
    setFlowLogs(updatedLogs);
    localStorage.setItem('pomodoro_flow_logs', JSON.stringify(updatedLogs));
    setLogContent(''); setShowLogModal(false); setCurrentStartTime(null);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      if (!currentStartTime && !isBreak) setCurrentStartTime(Date.now());
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime > 0 && newTime % 60 === 0 && !isBreak) {
            recordFocusMinute();
            if (activeTaskId) onUpdateTodoFocusTime(activeTaskId, 1);
          }
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (!isBreak) {
        recordFocusMinute();
        if (activeTaskId) onUpdateTodoFocusTime(activeTaskId, 1);
        setShowLogModal(true);
        setIsBreak(true); setTimeLeft(5 * 60);
      } else {
        setIsBreak(false); setTimeLeft(duration * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak, activeTaskId, duration]);

  const toggleTimer = () => setIsActive(!isActive);

  const stopTimer = () => {
    if (isActive && !isBreak) {
      const secondsElapsed = (duration * 60) - timeLeft;
      if (secondsElapsed >= 30) {
        if (secondsElapsed % 60 >= 30 || secondsElapsed % 60 === 0) {
          recordFocusMinute();
          if (activeTaskId) onUpdateTodoFocusTime(activeTaskId, 1);
        }
        setShowLogModal(true);
      } else { setCurrentStartTime(null); }
    }
    setIsActive(false); setIsBreak(false); setTimeLeft(duration * 60);
  };

  const exportPoster = async () => {
    if (!statsRef.current) return;
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const canvas = await html2canvas(statsRef.current, {
        backgroundColor: '#f8fafc',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        ignoreElements: (el) => el.tagName === 'BUTTON',
        onclone: (clonedDoc) => {
          const container = clonedDoc.querySelector('.poster-container') as HTMLElement;
          if (container) {
            container.style.backdropFilter = 'none';
            container.style.background = 'rgba(255, 255, 255, 0.9)';
            const all = container.querySelectorAll('*');
            all.forEach((el: any) => { if (el.style) el.style.colorScheme = 'light'; });
          }
        }
      });
      const link = document.createElement('a');
      link.download = `Vibe-Report-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export Failed:', error);
      alert('截图生成失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  const formatClockTime = (ts: number) => {
    if (!ts || isNaN(ts)) return '??:??';
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const statsData = useMemo(() => {
    const now = new Date();
    const countsByDay: Record<string, number> = {};
    focusHistory.forEach(ts => { const d = new Date(ts).toDateString(); countsByDay[d] = (countsByDay[d] || 0) + 1; });
    const distribution = Array.from({ length: 24 }, (_, i) => ({ name: i.toString(), value: 0 }));
    focusHistory.filter(ts => new Date(ts).toDateString() === now.toDateString()).forEach(ts => { 
      distribution[new Date(ts).getHours()].value++; 
    });
    const heatmap = [];
    for (let i = 83; i >= 0; i--) {
      const d = new Date(); d.setDate(now.getDate() - i);
      heatmap.push({ date: d.toDateString(), mins: countsByDay[d.toDateString()] || 0 });
    }
    return { todayMinutes: countsByDay[now.toDateString()] || 0, distribution, heatmap };
  }, [focusHistory]);

  const primaryColor = `hsl(${themeHue}, 70%, 50%)`;
  const glassStyle = { backgroundColor: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.5)' };

  if (showStats) {
    return (
      <div className="h-full w-full flex flex-col animate-in fade-in duration-300">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setShowStats(false)} className="p-2 rounded-full hover:bg-black/5 text-gray-700 transition-colors"><ArrowLeft size={24} /></button>
          <h2 className="text-xl font-bold text-gray-700">专注看板</h2>
          <button onClick={exportPoster} disabled={isExporting} className="p-2 rounded-full hover:bg-black/5 text-gray-700 flex items-center gap-1 group">
             {isExporting ? <RotateCcw size={18} className="animate-spin" /> : <Share2 size={18} />}
             <span className="text-xs font-bold">{isExporting ? '生成中' : '分享'}</span>
          </button>
        </div>
        <div ref={statsRef} className="poster-container flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar p-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl text-center" style={glassStyle}><div className="text-[9px] uppercase tracking-widest text-gray-500 mb-1">TODAY</div><div className="text-2xl font-bold" style={{ color: primaryColor }}>{statsData.todayMinutes}m</div></div>
            <div className="p-4 rounded-2xl text-center" style={glassStyle}><div className="text-[9px] uppercase tracking-widest text-gray-500 mb-1">GOAL</div><div className="text-2xl font-bold text-gray-600">{dailyGoal}m</div></div>
          </div>
          <div className="p-5 rounded-2xl" style={glassStyle}>
            <h3 className="text-[10px] font-bold text-gray-500 mb-4 uppercase tracking-widest flex items-center gap-2"><Calendar size={12}/> Focus Matrix</h3>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {statsData.heatmap.map((day, idx) => (
                <div key={idx} className="w-3 h-3 rounded-sm" style={{ backgroundColor: day.mins > 0 ? primaryColor : 'rgba(0,0,0,0.06)', opacity: day.mins > 0 ? 0.3 + (Math.min(day.mins/60, 1)*0.7) : 1 }} title={`${day.date}: ${day.mins}m`} />
              ))}
            </div>
          </div>
          <div className="p-5 rounded-2xl" style={glassStyle}>
            <h3 className="text-[10px] font-bold text-gray-500 mb-4 uppercase tracking-widest flex items-center gap-2"><BarChart2 size={12}/> Hourly Stats</h3>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsData.distribution}>
                  <XAxis dataKey="name" tick={{fontSize: 8}} interval={3} tickFormatter={(val) => `${val}:00`} axisLine={false} tickLine={false} />
                  <Bar dataKey="value" radius={[2, 2, 0, 0]} isAnimationActive={false}>
                    {statsData.distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={primaryColor} fillOpacity={entry.value > 0 ? 0.8 : 0.1} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {flowLogs.length > 0 && (
            <div className="p-5 rounded-2xl" style={glassStyle}>
              <h3 className="text-[10px] font-bold text-gray-500 mb-4 uppercase tracking-widest">Recent Reflections</h3>
              <div className="space-y-3">
                {flowLogs.slice(0, 5).map(log => (
                  <div key={log.id} className="text-sm bg-white/40 p-4 rounded-2xl border border-white/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1"><Clock size={10} /> {formatClockTime(log.startTime)} - {formatClockTime(log.endTime)}</span>
                      <span className="text-[9px] text-gray-300">{new Date(log.startTime || log.endTime || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <div className="text-gray-700 leading-relaxed italic">“{log.content}”</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      {showLogModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-md" onClick={saveLog} />
          <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl relative z-10">
            <div className="flex items-center gap-2 mb-2 text-gray-800"><Sparkles size={20} className="text-yellow-500" /><h3 className="text-lg font-bold">这一刻，你创造了什么？</h3></div>
            <div className="text-[10px] text-gray-400 mb-6 font-bold">SESSION: {currentStartTime ? formatClockTime(currentStartTime) : '--:--'} - {formatClockTime(Date.now())}</div>
            <textarea autoFocus className="w-full bg-black/5 border-none rounded-2xl p-4 text-gray-700 outline-none h-32 resize-none mb-4" placeholder="记录你的成就..." value={logContent} onChange={(e) => setLogContent(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && saveLog()} />
            <button onClick={saveLog} className="w-full bg-gray-800 text-white py-4 rounded-xl font-bold">确认记录</button>
          </div>
        </div>
      )}
      <button onClick={() => setShowStats(true)} className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-800 flex items-center gap-1 text-xs transition-opacity duration-500" style={{ opacity: isActive && !isBreak ? 0 : 1 }}>
        <BarChart2 size={18} /> <span>统计</span>
      </button>
      <div className="relative mb-8 flex flex-col items-center">
        <div className="w-64 h-64 rounded-full border-8 border-white/40 flex items-center justify-center relative transition-all duration-1000">
          <div className="flex flex-col items-center z-10 px-4 text-center">
            {activeTaskId && <span className={`text-[10px] uppercase tracking-[0.3em] mb-2 transition-all duration-1000 ${isActive && !isBreak ? 'text-gray-800 scale-110' : 'text-gray-500'}`}>🎯 {todos.find(t => t.id === activeTaskId)?.text}</span>}
            <span className={`text-6xl font-bold tabular-nums tracking-tight transition-all duration-1000 ${isActive && !isBreak ? 'text-gray-900 scale-110' : 'text-gray-700'}`}>{Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] mt-3 opacity-60 font-bold">{isBreak ? '☕ BREAK TIME' : '🔥 FOCUSING'}</span>
          </div>
          <div className={`absolute inset-0 rounded-full opacity-30 blur-3xl transition-all duration-[2000ms] ${isActive ? 'scale-125 opacity-40' : 'scale-100 opacity-20'}`} style={{ backgroundColor: primaryColor }} />
        </div>
        {!isActive && !isBreak && <div className="absolute -bottom-16 w-48 animate-in slide-in-from-top-4"><input type="range" min="5" max="60" step="5" value={duration} onChange={(e) => { const v = parseInt(e.target.value); setDuration(v); setTimeLeft(v*60); }} className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer" style={{ accentColor: primaryColor }} /></div>}
      </div>
      <div className="flex items-center gap-8 z-10 mt-12 transition-all">
        <button onClick={stopTimer} className="w-12 h-12 rounded-xl bg-black/5 hover:bg-red-500/10 flex items-center justify-center transition-all text-gray-400 hover:text-red-600"><Square size={20} fill="currentColor" /></button>
        <button onClick={toggleTimer} className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all text-white" style={{ backgroundColor: isActive ? '#ef4444' : primaryColor }}>{isActive ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}</button>
        <button onClick={() => setTimeLeft(isBreak ? 5*60 : duration*60)} className="w-12 h-12 rounded-xl bg-black/5 hover:bg-black/10 flex items-center justify-center transition-all text-gray-400 hover:text-gray-800"><RotateCcw size={22} /></button>
      </div>
      <div className={`mt-10 w-full max-w-xs transition-opacity duration-700 ${isActive && !isBreak ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <select value={activeTaskId || ''} onChange={(e) => setActiveTaskId(e.target.value)} className="w-full p-3 rounded-xl bg-black/5 border border-black/10 text-gray-700 text-center text-sm font-medium focus:outline-none"><option value="">-- 选择专注任务 --</option>{todos.filter(t => !t.completed).map(todo => (<option key={todo.id} value={todo.id}>{todo.text}</option>))}</select>
      </div>
    </div>
  );
}