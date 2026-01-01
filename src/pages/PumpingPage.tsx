import { useState } from 'react';
import { Beaker, Play, Square, RotateCcw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { TimerDisplay } from '@/components/TimerDisplay';
import { HistoryList, HistoryCard } from '@/components/HistoryCard';
import { useTimer, formatDuration } from '@/hooks/useTimer';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { PumpingEntry, BreastSide } from '@/types/baby-tracker';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function PumpingPage() {
  const { elapsed, isRunning, start, pause, stop, reset } = useTimer();
  const [entries, setEntries] = useLocalStorage<PumpingEntry[]>('pumping-entries', []);
  
  const [side, setSide] = useState<BreastSide | 'both'>('both');
  const [amount, setAmount] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    if (!amount || Number(amount) <= 0) {
      toast({
        title: 'Enter amount',
        description: 'Please enter the amount pumped in ml',
        variant: 'destructive',
      });
      return;
    }

    const entry: PumpingEntry = {
      id: crypto.randomUUID(),
      side,
      duration: elapsed,
      amount: Number(amount),
      time: new Date().toISOString(),
    };

    setEntries((prev) => [entry, ...prev]);
    stop();
    setAmount('');
    
    toast({
      title: 'Pumping logged',
      description: `${amount}ml in ${formatDuration(elapsed)}`,
    });
  };

  const handleReset = () => {
    reset();
    setAmount('');
  };

  const getSideLabel = (s: BreastSide | 'both') => {
    switch (s) {
      case 'left': return 'Left';
      case 'right': return 'Right';
      case 'both': return 'Both';
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Pumping"
        subtitle="Track milk expression"
        color="pumping"
        icon={<Beaker className="h-6 w-6" />}
      />

      <div className="px-4 py-6">
        <div className="bg-pumping-light rounded-2xl p-6 shadow-sm border border-border space-y-6">
          {/* Side selector */}
          <div className="space-y-2">
            <Label>Breast</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['left', 'right', 'both'] as const).map((s) => (
                <Button
                  key={s}
                  type="button"
                  variant={side === s ? 'default' : 'outline'}
                  onClick={() => setSide(s)}
                  className={side === s ? 'bg-pumping hover:bg-pumping/90' : ''}
                >
                  {getSideLabel(s)}
                </Button>
              ))}
            </div>
          </div>

          {/* Timer */}
          <div className="py-4">
            <TimerDisplay elapsed={elapsed} isRunning={isRunning} color="pumping" />
          </div>

          {/* Timer controls */}
          <div className="flex justify-center gap-4">
            {!isRunning ? (
              <Button
                size="lg"
                onClick={start}
                className="h-14 px-8 rounded-full bg-pumping hover:bg-pumping/90"
              >
                <Play className="h-5 w-5 mr-2" />
                Start
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={pause}
                className="h-14 px-8 rounded-full bg-pumping hover:bg-pumping/90"
              >
                <Square className="h-5 w-5 mr-2" />
                Pause
              </Button>
            )}
          </div>

          {/* Amount and save */}
          {elapsed > 0 && !isRunning && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount pumped (ml)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="e.g., 60"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  max="500"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSave}
                  className="flex-1 bg-pumping hover:bg-pumping/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleReset}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <HistoryList title="Pumping History" isEmpty={entries.length === 0}>
        {entries.map((entry) => (
          <HistoryCard key={entry.id} time={entry.time}>
            <div className="flex items-center gap-2">
              <span 
                className="font-bold text-lg"
                style={{ color: 'hsl(var(--pumping))' }}
              >
                {entry.amount}ml
              </span>
              <span className="text-sm text-muted-foreground">
                {getSideLabel(entry.side)} • {formatDuration(entry.duration)}
              </span>
            </div>
          </HistoryCard>
        ))}
      </HistoryList>
    </AppLayout>
  );
}
