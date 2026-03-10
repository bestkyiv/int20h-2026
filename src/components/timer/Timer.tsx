import React, { useState, useEffect } from 'react';

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export default function Timer() {
  const [time, setTime] = useState('20:00:00');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Read from environment variables
    const totalDuration = parseInt(import.meta.env.PUBLIC_TIMER_DURATION || '72000', 10);
    const isRunningEnv = import.meta.env.PUBLIC_IS_RUNNING === 'true';
    const startTimestamp = parseInt(import.meta.env.PUBLIC_START_TIMESTAMP || '1773486000', 10);

    const currentTime = Math.floor(Date.now() / 1000);
    const timerStarted = currentTime >= startTimestamp;
    const shouldRun = isRunningEnv && timerStarted;

    setIsRunning(shouldRun);

    if (!shouldRun) {
      // Timer not started or stopped - show total duration
      setTime(formatTime(totalDuration));
      return;
    }

    const updateDisplay = () => {
      const nowSeconds = Math.floor(Date.now() / 1000);
      const elapsedSeconds = nowSeconds - startTimestamp;
      const remaining = Math.max(0, totalDuration - elapsedSeconds);
      setTime(formatTime(remaining));
    };

    updateDisplay();
    const displayInterval = setInterval(updateDisplay, 100);
    return () => clearInterval(displayInterval);
  }, []);

  return (
    <>
      <style>{`
        html, body {
          overflow: hidden;
          margin: 0;
          padding: 0;
        }
      `}</style>
      <div className="h-screen flex flex-col">
      {/* Top spacer */}
      <div style={{ height: '16.67%' }}></div>
      
      {/* Timer centered - 1/3 */}
      <div className="flex items-center justify-center" style={{ height: '33.33%' }}>
        <div className="text-center w-full" style={{ paddingLeft: '10vw', paddingRight: '10vw' }}>
          <div className={`font-bold font-mono text-white tracking-wider ${isRunning ? 'animate-pulse' : 'opacity-150'}`} style={{ fontSize: 'clamp(2rem, 15vw, 40rem)', lineHeight: '1', width: '100%' }}>
            {time}
          </div>
          <style>{`
            @keyframes pulse {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.7;
              }
            }
            .animate-pulse {
              animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
          `}</style>
        </div>
      </div>
      
      {/* Bottom spacer */}
      <div style={{ height: '50%' }}></div>
    </div>
    </>
  );
}
