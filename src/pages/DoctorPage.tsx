import { useState } from 'react';
import { Stethoscope, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { HistoryList, HistoryCard } from '@/components/HistoryCard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { DoctorEntry } from '@/types/baby-tracker';
import { useToast } from '@/hooks/use-toast';

export default function DoctorPage() {
  const [entries, setEntries] = useLocalStorage<DoctorEntry[]>('doctor-entries', []);
  
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [headCircumference, setHeadCircumference] = useState('');
  const [medications, setMedications] = useState('');
  const [feedback, setFeedback] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const entry: DoctorEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      weight: weight ? Number(weight) : undefined,
      height: height ? Number(height) : undefined,
      headCircumference: headCircumference ? Number(headCircumference) : undefined,
      medications: medications || undefined,
      feedback: feedback || undefined,
      notes: notes || undefined,
    };

    setEntries((prev) => [entry, ...prev]);
    
    // Reset form
    setWeight('');
    setHeight('');
    setHeadCircumference('');
    setMedications('');
    setFeedback('');
    setNotes('');

    toast({
      title: 'Visit logged',
      description: 'Doctor visit recorded successfully',
    });
  };

  return (
    <AppLayout style={{backgroundColor: 'bg-doctor-light'}}>
      <PageHeader
        title="Doctor Visits"
        subtitle="Track checkups & growth"
        color="doctor"
        icon={<Stethoscope className="h-6 w-6" />}
      />

      <form onSubmit={handleSubmit} className="px-4 py-6">
        <div className="bg-doctor-light rounded-2xl p-6 shadow-sm border border-border space-y-4">
          <h3 className="font-semibold text-lg">New Visit</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                placeholder="e.g., 4.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                placeholder="e.g., 55"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="head">Head Circumference (cm)</Label>
            <Input
              id="head"
              type="number"
              step="0.1"
              placeholder="e.g., 36"
              value={headCircumference}
              onChange={(e) => setHeadCircumference(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medications">Medications / Supplements</Label>
            <Input
              id="medications"
              placeholder="e.g., Vitamin D drops, Gas drops..."
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Doctor's Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="What did the doctor say..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any other observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-doctor hover:bg-doctor/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Visit
          </Button>
        </div>
      </form>

      <HistoryList title="Visit History" isEmpty={entries.length === 0}>
        {entries.map((entry) => (
          <HistoryCard key={entry.id} time={entry.date}>
            <div className="space-y-2">
              {(entry.weight || entry.height) && (
                <div className="flex gap-4">
                  {entry.weight && (
                    <span style={{ color: 'hsl(var(--doctor))' }}>
                      <strong>{entry.weight}</strong> kg
                    </span>
                  )}
                  {entry.height && (
                    <span style={{ color: 'hsl(var(--doctor))' }}>
                      <strong>{entry.height}</strong> cm
                    </span>
                  )}
                  {entry.headCircumference && (
                    <span className="text-muted-foreground">
                      Head: {entry.headCircumference} cm
                    </span>
                  )}
                </div>
              )}
              {entry.medications && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Meds:</span> {entry.medications}
                </p>
              )}
              {entry.feedback && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Feedback:</span> {entry.feedback}
                </p>
              )}
              {entry.notes && (
                <p className="text-sm text-muted-foreground">{entry.notes}</p>
              )}
            </div>
          </HistoryCard>
        ))}
      </HistoryList>
    </AppLayout>
  );
}
