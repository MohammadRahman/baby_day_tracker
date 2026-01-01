import { useState } from 'react';
import { Baby, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { HistoryList, HistoryCard } from '@/components/HistoryCard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { BottleEntry, BottleType } from '@/types/baby-tracker';
import { useToast } from '@/hooks/use-toast';

export default function BottlesPage() {
  const [entries, setEntries] = useLocalStorage<BottleEntry[]>('bottle-entries', []);
  const [type, setType] = useState<BottleType>('formula');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || Number(amount) <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount in ml',
        variant: 'destructive',
      });
      return;
    }

    const entry: BottleEntry = {
      id: crypto.randomUUID(),
      type,
      amount: Number(amount),
      time: new Date().toISOString(),
      notes: notes || undefined,
    };

    setEntries((prev) => [entry, ...prev]);
    setAmount('');
    setNotes('');
    
    toast({
      title: 'Bottle logged',
      description: `${amount}ml of ${type} recorded`,
    });
  };

  const getTypeLabel = (t: BottleType) => {
    switch (t) {
      case 'formula': return 'Formula';
      case 'breastmilk': return 'Breast Milk';
      case 'other': return 'Other';
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Bottles"
        subtitle="Track bottle feeding"
        color="bottles"
        icon={<Baby className="h-6 w-6" />}
      />

      <form onSubmit={handleSubmit} className="px-4 py-6">
        <div className="bg-bottles-light rounded-2xl p-6 shadow-sm border border-border space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as BottleType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formula">Formula</SelectItem>
                <SelectItem value="breastmilk">Breast Milk</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (ml)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="e.g., 120"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              max="500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              placeholder="Any notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-bottles hover:bg-bottles/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Bottle
          </Button>
        </div>
      </form>

      <HistoryList title="Bottle History" isEmpty={entries.length === 0}>
        {entries.map((entry) => (
          <HistoryCard key={entry.id} time={entry.time}>
            <div className="flex items-center gap-2">
              <span 
                className="font-bold text-lg"
                style={{ color: 'hsl(var(--bottles))' }}
              >
                {entry.amount}ml
              </span>
              <span className="text-sm text-muted-foreground">
                {getTypeLabel(entry.type)}
              </span>
            </div>
            {entry.notes && (
              <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>
            )}
          </HistoryCard>
        ))}
      </HistoryList>
    </AppLayout>
  );
}
