import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Bell, Flame } from 'lucide-react';

interface ActiveStepTimerProps {
  initialMinutes: number;
  label: string;
  onClose: () => void;
}

export const ActiveStepTimer: React.FC<ActiveStepTimerProps> = ({
  initialMinutes,
  label,
  onClose,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setSecondsRemaining(initialMinutes * 60);
    setIsRunning(true);
    setIsFinished(false);
  }, [initialMinutes, label]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            setIsFinished(true);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleReset = () => {
    setSecondsRemaining(initialMinutes * 60);
    setIsRunning(false);
    setIsFinished(false);
  };

  return (
    <aside aria-label="Kitchen cooking timer" className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-300">
      <div className={`p-4 rounded-2xl shadow-2xl border transition-all flex items-center gap-4 ${
        isFinished
          ? 'bg-amber-500 text-stone-950 border-amber-600 ring-4 ring-amber-300/60'
          : 'bg-stone-900/95 backdrop-blur-md text-stone-50 border-stone-700'
      }`}>
        
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${isFinished ? 'bg-stone-950 text-amber-400' : 'bg-stone-800 text-amber-300'}`}>
            {isFinished ? <Bell className="w-5 h-5 animate-bounce" /> : <Flame className="w-5 h-5" />}
          </div>

          <div>
            <span className="block text-[11px] font-mono text-stone-300 truncate max-w-[180px]">
              {label}
            </span>
            <span className="font-mono text-xl font-bold tabular-nums tracking-wider">
              {isFinished ? "Time's Up!" : formattedTime}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 border-l border-stone-700/60 pl-3">
          {!isFinished && (
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
              title={isRunning ? 'Pause' : 'Resume'}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
          )}

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
            title="Close timer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </aside>
  );
};
