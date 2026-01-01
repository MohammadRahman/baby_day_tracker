import { useState, useCallback, useRef, useEffect } from 'react';
import type { TimerState } from '@/types/baby-tracker';

export function useTimer() {
  const [state, setState] = useState<TimerState>({
    isRunning: false,
    startTime: null,
    elapsed: 0,
  });
  
  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    setState((prev) => ({
      isRunning: true,
      startTime: Date.now() - prev.elapsed * 1000,
      elapsed: prev.elapsed,
    }));
  }, []);

  const pause = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isRunning: false,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isRunning: false,
      startTime: null,
      elapsed: 0,
    });
  }, []);

  const stop = useCallback(() => {
    const finalElapsed = state.elapsed;
    reset();
    return finalElapsed;
  }, [state.elapsed, reset]);

  // Update elapsed time while running
  useEffect(() => {
    if (state.isRunning && state.startTime) {
      intervalRef.current = window.setInterval(() => {
        setState((prev) => ({
          ...prev,
          elapsed: Math.floor((Date.now() - (prev.startTime || Date.now())) / 1000),
        }));
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.startTime]);

  return {
    elapsed: state.elapsed,
    isRunning: state.isRunning,
    start,
    pause,
    reset,
    stop,
  };
}

export function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  
  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  return `${mins}m`;
}
