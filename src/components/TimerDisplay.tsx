import { cn } from '@/lib/utils';
import { formatTime } from '@/hooks/useTimer';

interface TimerDisplayProps {
  elapsed: number;
  isRunning: boolean;
  color?: string;
  size?: 'sm' | 'lg';
}

export function TimerDisplay({ elapsed, isRunning, color, size = 'lg' }: TimerDisplayProps) {
  return (
    <div
      className={cn(
        'timer-display font-bold text-center',
        size === 'lg' ? 'text-6xl' : 'text-3xl',
        isRunning && 'animate-pulse-soft'
      )}
      style={color ? { color: `hsl(var(--${color}))` } : undefined}
    >
      {formatTime(elapsed)}
    </div>
  );
}
