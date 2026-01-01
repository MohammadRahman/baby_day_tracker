import { useState, useRef, useEffect, useCallback } from 'react';
import { Heart, Play, Square, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { HistoryList, HistoryCard } from '@/components/HistoryCard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { formatTime, formatDuration } from '@/hooks/useTimer';
import type { NursingEntry, BreastSide } from '@/types/baby-tracker';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function NursingPage() {
  const [entries, setEntries] = useLocalStorage<NursingEntry[]>('nursing-entries', []);
  const [lastSide, setLastSide] = useLocalStorage<BreastSide | null>('nursing-last-side', null);
  
  const [activeSide, setActiveSide] = useState<BreastSide | null>(null);
  const [leftElapsed, setLeftElapsed] = useState(0);
  const [rightElapsed, setRightElapsed] = useState(0);
  const [startTime, setStartTime] = useState<string | null>(null);
  
  const intervalRef = useRef<number | null>(null);
  const sideStartRef = useRef<number | null>(null);
  const { toast } = useToast();

  const isRunning = activeSide !== null;
  const totalElapsed = leftElapsed + rightElapsed;

  const tick = useCallback(() => {
    if (sideStartRef.current && activeSide) {
      const newElapsed = Math.floor((Date.now() - sideStartRef.current) / 1000);
      if (activeSide === 'left') {
        setLeftElapsed(newElapsed);
      } else {
        setRightElapsed(newElapsed);
      }
    }
  }, [activeSide]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(tick, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, tick]);

  const handleSideClick = (side: BreastSide) => {
    if (activeSide === side) {
      // Stop this side
      setActiveSide(null);
    } else if (activeSide) {
      // Switch sides - save current elapsed
      const currentElapsed = sideStartRef.current 
        ? Math.floor((Date.now() - sideStartRef.current) / 1000)
        : 0;
      
      if (activeSide === 'left') {
        setLeftElapsed(currentElapsed);
      } else {
        setRightElapsed(currentElapsed);
      }
      
      // Start new side
      setActiveSide(side);
      sideStartRef.current = Date.now();
    } else {
      // Start fresh
      if (!startTime) {
        setStartTime(new Date().toISOString());
      }
      setActiveSide(side);
      sideStartRef.current = Date.now() - (side === 'left' ? leftElapsed : rightElapsed) * 1000;
    }
  };

  const handleSave = () => {
    if (totalElapsed < 60) {
      toast({
        title: 'Too short',
        description: 'Please nurse for at least 1 minute to log',
        variant: 'destructive',
      });
      return;
    }

    const finalSide = activeSide || (leftElapsed >= rightElapsed ? 'left' : 'right');
    
    const entry: NursingEntry = {
      id: crypto.randomUUID(),
      leftDuration: leftElapsed,
      rightDuration: rightElapsed,
      startTime: startTime || new Date().toISOString(),
      lastSide: finalSide,
    };

    setEntries((prev) => [entry, ...prev]);
    setLastSide(finalSide);
    
    // Reset
    setActiveSide(null);
    setLeftElapsed(0);
    setRightElapsed(0);
    setStartTime(null);
    sideStartRef.current = null;

    toast({
      title: 'Nursing logged',
      description: `${formatDuration(entry.leftDuration + entry.rightDuration)} total`,
    });
  };

  const handleReset = () => {
    setActiveSide(null);
    setLeftElapsed(0);
    setRightElapsed(0);
    setStartTime(null);
    sideStartRef.current = null;
  };

  return (
    <AppLayout>
      <PageHeader
        title="Nursing"
        subtitle={lastSide ? `Last used: ${lastSide} breast` : 'Track breastfeeding'}
        color="nursing"
        icon={<Heart className="h-6 w-6" />}
      />

      <div className="px-4 py-6">
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          {/* Dual timer buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleSideClick('left')}
              className={cn(
                'flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all',
                activeSide === 'left'
                  ? 'border-nursing bg-nursing-light'
                  : 'border-border hover:border-nursing/50'
              )}
            >
              <span className="text-sm font-medium text-muted-foreground mb-2">LEFT</span>
              <span 
                className="text-3xl font-bold timer-display"
                style={{ color: 'hsl(var(--nursing))' }}
              >
                {formatTime(leftElapsed)}
              </span>
              {activeSide === 'left' && (
                <span className="text-xs text-nursing mt-2 animate-pulse">Active</span>
              )}
            </button>

            <button
              onClick={() => handleSideClick('right')}
              className={cn(
                'flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all',
                activeSide === 'right'
                  ? 'border-nursing bg-nursing-light'
                  : 'border-border hover:border-nursing/50'
              )}
            >
              <span className="text-sm font-medium text-muted-foreground mb-2">RIGHT</span>
              <span 
                className="text-3xl font-bold timer-display"
                style={{ color: 'hsl(var(--nursing))' }}
              >
                {formatTime(rightElapsed)}
              </span>
              {activeSide === 'right' && (
                <span className="text-xs text-nursing mt-2 animate-pulse">Active</span>
              )}
            </button>
          </div>

          {/* Total time */}
          <div className="text-center mb-6">
            <span className="text-sm text-muted-foreground">Total: </span>
            <span className="text-lg font-bold" style={{ color: 'hsl(var(--nursing))' }}>
              {formatTime(totalElapsed)}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-4">
            {totalElapsed > 0 && (
              <>
                <Button
                  size="lg"
                  onClick={handleSave}
                  className="bg-nursing hover:bg-nursing/90"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleReset}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </>
            )}
          </div>

          {!isRunning && totalElapsed === 0 && (
            <p className="text-center text-muted-foreground text-sm">
              Tap a side to start timing
            </p>
          )}
        </div>
      </div>

      <HistoryList title="Nursing History" isEmpty={entries.length === 0}>
        {entries.map((entry) => (
          <HistoryCard key={entry.id} time={entry.startTime}>
            <p 
              className="font-bold"
              style={{ color: 'hsl(var(--nursing))' }}
            >
              {formatDuration(entry.leftDuration + entry.rightDuration)} total
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>L: {formatDuration(entry.leftDuration)}</span>
              <span>R: {formatDuration(entry.rightDuration)}</span>
            </div>
          </HistoryCard>
        ))}
      </HistoryList>
    </AppLayout>
  );
}
