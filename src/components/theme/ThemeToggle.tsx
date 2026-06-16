import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { applyTheme, getStoredTheme, systemPrefersDark, type Theme } from '@/lib/theme';

type Labels = { light: string; dark: string; system: string; label: string };

const ICONS: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor
};

export function ThemeToggle({
  labels,
  align = 'end'
}: {
  labels: Labels;
  align?: 'start' | 'end';
}) {
  const [theme, setTheme] = useState<Theme>('system');
  const [systemDark, setSystemDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getStoredTheme());
    setSystemDark(systemPrefersDark());
    setMounted(true);
  }, []);

  // Keep "system" choice live when the OS preference flips — update both the
  // DOM (applyTheme) and React state (systemDark) so the icon re-renders too.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      setSystemDark(mq.matches);
      if (getStoredTheme() === 'system') applyTheme('system');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  function choose(next: Theme) {
    setTheme(next);
    applyTheme(next);
  }

  // Avoid icon hydration mismatch: show resolved icon only after mount.
  const Active = mounted ? (theme === 'system' ? (systemDark ? Moon : Sun) : ICONS[theme]) : Sun;

  const options: Theme[] = ['light', 'dark', 'system'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          aria-label={labels.label}
        >
          <Active className='size-5' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {options.map(opt => {
          const Icon = ICONS[opt];
          return (
            <DropdownMenuItem
              key={opt}
              onClick={() => choose(opt)}
              data-active={mounted && theme === opt}
              className='data-[active=true]:text-primary gap-2'
            >
              <Icon className='size-4' />
              {labels[opt]}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
