import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  color?: string;
  icon?: React.ReactNode;
}

export function PageHeader({ title, subtitle, color, icon }: PageHeaderProps) {
  return (
    <header 
      className={cn(
        'px-4 py-6 rounded-b-3xl',
        color ? `bg-${color}-light` : 'bg-secondary'
      )}
      style={color ? { backgroundColor: `hsl(var(--${color}-light))` } : undefined}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div 
            className="p-2 rounded-xl"
            style={color ? { 
              backgroundColor: `hsl(var(--${color}))`,
              color: 'white'
            } : undefined}
          >
            {icon}
          </div>
        )}
        <div>
          <h1 
            className="text-2xl font-bold"
            style={color ? { color: `hsl(var(--${color}))` } : undefined}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
}
