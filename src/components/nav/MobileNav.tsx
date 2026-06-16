import { useState } from 'react';
import { Menu, Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { applyTheme, type Theme } from '@/lib/theme';

export interface NavItem {
  label: string;
  href: string;
}

interface Props {
  items: NavItem[];
  menuLabel: string;
  themeLabel: string;
  themeLabels: { light: string; dark: string; system: string };
  langLabel: string;
  langHref: string;
  langCode: 'fa' | 'en';
  dir: 'rtl' | 'ltr';
}

const THEME_ICONS = { light: Sun, dark: Moon, system: Monitor } as const;

export function MobileNav({
  items,
  menuLabel,
  themeLabel,
  themeLabels,
  langLabel,
  langHref,
  langCode,
  dir
}: Props) {
  const [open, setOpen] = useState(false);
  const side = dir === 'rtl' ? 'right' : 'left';
  const themes: Theme[] = ['light', 'dark', 'system'];

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          aria-label={menuLabel}
        >
          <Menu className='size-5' />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={side}
        dir={dir}
        className='w-72'
      >
        <SheetHeader>
          <SheetTitle>{menuLabel}</SheetTitle>
        </SheetHeader>
        <nav className='flex flex-col gap-1 px-4'>
          {items.map(item => (
            <a
              key={item.href}
              href={item.href}
              className='hover:bg-accent rounded-md px-3 py-2.5 text-base font-medium transition-colors'
            >
              {item.label}
            </a>
          ))}
        </nav>
        <Separator className='my-2' />
        <div className='px-4'>
          <p className='text-muted-foreground mb-2 text-xs font-medium'>{themeLabel}</p>
          <div className='flex gap-2'>
            {themes.map(t => {
              const Icon = THEME_ICONS[t];
              return (
                <Button
                  key={t}
                  variant='outline'
                  size='sm'
                  className='flex-1 gap-1.5'
                  onClick={() => applyTheme(t)}
                >
                  <Icon className='size-4' />
                  <span className='text-xs'>{themeLabels[t]}</span>
                </Button>
              );
            })}
          </div>
        </div>
        <Separator className='my-2' />
        <div className='px-4'>
          <a
            href={langHref}
            lang={langCode}
            className='hover:bg-accent inline-flex w-full items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors'
          >
            {langLabel}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
