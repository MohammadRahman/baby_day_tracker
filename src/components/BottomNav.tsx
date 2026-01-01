import { NavLink, useLocation } from 'react-router-dom';
import { Moon, Baby, Droplets, Heart, Beaker, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/sleep', icon: Moon, label: 'Sleep', color: 'sleep' },
  { path: '/bottles', icon: Baby, label: 'Bottles', color: 'bottles' },
  { path: '/diapers', icon: Droplets, label: 'Diapers', color: 'diapers' },
  { path: '/nursing', icon: Heart, label: 'Nursing', color: 'nursing' },
  { path: '/pumping', icon: Beaker, label: 'Pumping', color: 'pumping' },
  { path: '/doctor', icon: Stethoscope, label: 'Doctor', color: 'doctor' },
] as const;

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, label, color }) => {
          const isActive = location.pathname === path;
          
          return (
            <NavLink
              key={path}
              to={path}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg transition-all duration-200 min-w-[56px]',
                isActive 
                  ? `text-${color} bg-${color}-light` 
                  : 'text-muted-foreground hover:text-foreground'
              )}
              style={isActive ? {
                color: `hsl(var(--${color}))`,
                backgroundColor: `hsl(var(--${color}-light))`,
              } : undefined}
            >
              <Icon className={cn('h-5 w-5', isActive && 'scale-110')} />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
