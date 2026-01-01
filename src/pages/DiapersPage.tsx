import { useState } from 'react';
import { Droplets, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { HistoryList, HistoryCard } from '@/components/HistoryCard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { DiaperEntry, DiaperType, PoopColor, PoopConsistency } from '@/types/baby-tracker';
import { useToast } from '@/hooks/use-toast';

const poopColors: { value: PoopColor; label: string; emoji: string }[] = [
  { value: 'yellow', label: 'Yellow', emoji: '🟡' },
  { value: 'brown', label: 'Brown', emoji: '🟤' },
  { value: 'green', label: 'Green', emoji: '🟢' },
  { value: 'black', label: 'Black', emoji: '⚫' },
  { value: 'red', label: 'Red (consult doctor)', emoji: '🔴' },
  { value: 'white', label: 'White (consult doctor)', emoji: '⚪' },
];

const consistencies: { value: PoopConsistency; label: string }[] = [
  { value: 'watery', label: 'Watery' },
  { value: 'soft', label: 'Soft' },
  { value: 'formed', label: 'Formed' },
  { value: 'hard', label: 'Hard' },
];

export default function DiapersPage() {
  const [entries, setEntries] = useLocalStorage<DiaperEntry[]>('diaper-entries', []);
  const [type, setType] = useState<DiaperType>('pee');
  const [poopColor, setPoopColor] = useState<PoopColor>('yellow');
  const [poopConsistency, setPoopConsistency] = useState<PoopConsistency>('soft');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const showPoopDetails = type === 'poop' || type === 'both';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const entry: DiaperEntry = {
      id: crypto.randomUUID(),
      type,
      poopColor: showPoopDetails ? poopColor : undefined,
      poopConsistency: showPoopDetails ? poopConsistency : undefined,
      time: new Date().toISOString(),
      notes: notes || undefined,
    };

    setEntries((prev) => [entry, ...prev]);
    setNotes('');
    
    toast({
      title: 'Diaper logged',
      description: `${type === 'both' ? 'Pee & Poop' : type.charAt(0).toUpperCase() + type.slice(1)} recorded`,
    });
  };

  const getTypeIcon = (t: DiaperType) => {
    switch (t) {
      case 'pee': return '💧';
      case 'poop': return '💩';
      case 'both': return '💧💩';
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Diapers"
        subtitle="Track diaper changes"
        color="diapers"
        icon={<Droplets className="h-6 w-6" />}
      />

      <form onSubmit={handleSubmit} className="px-4 py-6">
        <div className="bg-diapers-light rounded-2xl p-6 shadow-sm border border-border space-y-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['pee', 'poop', 'both'] as DiaperType[]).map((t) => (
                <Button
                  key={t}
                  type="button"
                  variant={type === t ? 'default' : 'outline'}
                  onClick={() => setType(t)}
                  className={type === t ? 'bg-diapers hover:bg-diapers/90' : ''}
                >
                  {getTypeIcon(t)} {t.charAt(0).toUpperCase() + t.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {showPoopDetails && (
            <>
              <div className="space-y-2">
                <Label>Color</Label>
                <Select value={poopColor} onValueChange={(v) => setPoopColor(v as PoopColor)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {poopColors.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.emoji} {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Consistency</Label>
                <Select value={poopConsistency} onValueChange={(v) => setPoopConsistency(v as PoopConsistency)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {consistencies.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              placeholder="Rash, unusual smell, etc..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-diapers hover:bg-diapers/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Diaper
          </Button>
        </div>
      </form>

      <HistoryList title="Diaper History" isEmpty={entries.length === 0}>
        {entries.map((entry) => (
          <HistoryCard key={entry.id} time={entry.time}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{getTypeIcon(entry.type)}</span>
              <span 
                className="font-medium"
                style={{ color: 'hsl(var(--diapers))' }}
              >
                {entry.type === 'both' ? 'Pee & Poop' : entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
              </span>
            </div>
            {(entry.type === 'poop' || entry.type === 'both') && entry.poopColor && (
              <p className="text-sm text-muted-foreground">
                {poopColors.find((c) => c.value === entry.poopColor)?.emoji}{' '}
                {entry.poopColor}, {entry.poopConsistency}
              </p>
            )}
            {entry.notes && (
              <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>
            )}
          </HistoryCard>
        ))}
      </HistoryList>
    </AppLayout>
  );
}
