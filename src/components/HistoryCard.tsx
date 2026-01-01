import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface HistoryCardProps {
  children: React.ReactNode;
  time: string;
  onDelete?: () => void;
  className?: string;
}

export function HistoryCard({ children, time, onDelete, className }: HistoryCardProps) {
  const date = new Date(time);
  
  return (
    <div className={cn(
      'bg-card rounded-xl p-4 shadow-sm border border-border',
      className
    )}>
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">{children}</div>
        <div className="text-right shrink-0">
          <p className="text-xs text-muted-foreground">
            {format(date, 'MMM d')}
          </p>
          <p className="text-sm font-medium">
            {format(date, 'h:mm a')}
          </p>
        </div>
      </div>
    </div>
  );
}

interface HistoryListProps {
  title: string;
  children: React.ReactNode;
  emptyMessage?: string;
  isEmpty?: boolean;
}

export function HistoryList({ title, children, emptyMessage = 'No entries yet', isEmpty }: HistoryListProps) {
  return (
    <section className="px-4 py-4">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {isEmpty ? (
        <p className="text-center text-muted-foreground py-8">{emptyMessage}</p>
      ) : (
        <div className="space-y-3">
          {children}
        </div>
      )}
    </section>
  );
}
