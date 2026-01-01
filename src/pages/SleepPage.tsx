import { Moon, Play, Square, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { TimerDisplay } from '@/components/TimerDisplay';
import { HistoryList, HistoryCard } from '@/components/HistoryCard';
import { useTimer, formatDuration } from '@/hooks/useTimer';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { SleepEntry } from '@/types/baby-tracker';
import { useToast } from '@/hooks/use-toast';

export default function SleepPage() {
  const { elapsed, isRunning, start, pause, stop, reset } = useTimer();
  const [entries, setEntries] = useLocalStorage<SleepEntry[]>('sleep-entries', []);
  const [timerStartTime, setTimerStartTime] = useLocalStorage<string | null>('sleep-timer-start', null);
  const { toast } = useToast();

  const handleStart = () => {
    setTimerStartTime(new Date().toISOString());
    start();
  };

  const handleStop = () => {
    if (timerStartTime && elapsed > 60) { // Only log if > 1 minute
      const entry: SleepEntry = {
        id: crypto.randomUUID(),
        startTime: timerStartTime,
        endTime: new Date().toISOString(),
        duration: elapsed,
      };
      setEntries((prev) => [entry, ...prev]);
      toast({
        title: 'Sleep logged',
        description: `${formatDuration(elapsed)} of sleep recorded`,
      });
    }
    stop();
    setTimerStartTime(null);
  };

  const handleReset = () => {
    reset();
    setTimerStartTime(null);
  };

  return (
    <AppLayout>
      <PageHeader
        title="Sleep"
        subtitle="Track baby's sleep time"
        color="sleep"
        icon={<Moon className="h-6 w-6" />}
      />

      <div className="px-4 py-8">
        <div className="bg-sleep-light rounded-2xl p-8 shadow-sm border border-border">
          <TimerDisplay elapsed={elapsed} isRunning={isRunning} color="sleep" />
          
          <div className="flex justify-center gap-4 mt-8">
            {!isRunning ? (
              <Button
                size="lg"
                onClick={handleStart}
                className="h-16 w-16 rounded-full bg-sleep hover:bg-sleep/90"
              >
                <Play className="h-6 w-6" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleStop}
                className="h-16 w-16 rounded-full bg-sleep hover:bg-sleep/90"
              >
                <Square className="h-6 w-6" />
              </Button>
            )}
            
            {elapsed > 0 && !isRunning && (
              <Button
                size="lg"
                variant="outline"
                onClick={handleReset}
                className="h-16 w-16 rounded-full"
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
            )}
          </div>
          
          {isRunning && (
            <p className="text-center text-muted-foreground mt-4">
              Baby is sleeping...
            </p>
          )}
        </div>
      </div>

      <HistoryList title="Sleep History" isEmpty={entries.length === 0}>
        {entries.map((entry) => (
          <HistoryCard key={entry.id} time={entry.startTime}>
            <p className="font-medium" style={{ color: 'hsl(var(--sleep))' }}>
              {formatDuration(entry.duration)}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(entry.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {' → '}
              {new Date(entry.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </HistoryCard>
        ))}
      </HistoryList>
    </AppLayout>
  );
}
