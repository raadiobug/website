import { useEffect, useState } from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type Platform = 'spotify' | 'youtube' | 'castbox';

interface Link {
  label: string;
  href: string;
}

interface Props {
  src: string;
  platform: Platform;
  title: string;
  labels: { loading: string; error: string; open: string };
  links: Link[];
}

// Each platform's embed has a natural shape. YouTube is 16:9; audio players
// are short and fixed-height.
const FRAME: Record<Platform, string> = {
  spotify: 'aspect-auto h-[232px]',
  castbox: 'aspect-auto h-[180px]',
  youtube: 'aspect-video h-auto'
};

export function EpisodePlayer({ src, platform, title, labels, links }: Props) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  // iframe `onError` doesn't reliably fire for cross-origin failures, so fall
  // back to the listen links if the player hasn't loaded within 8s.
  useEffect(() => {
    if (state !== 'loading') return;
    const id = setTimeout(() => setState(s => (s === 'loading' ? 'error' : s)), 8000);
    return () => clearTimeout(id);
  }, [state]);

  if (state === 'error') {
    return (
      <div className='border-border bg-card flex flex-col items-center gap-4 rounded-xl border p-8 text-center'>
        <AlertCircle className='text-destructive size-8' />
        <p className='text-muted-foreground text-sm'>{labels.error}</p>
        <div className='flex flex-wrap justify-center gap-2'>
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              target='_blank'
              rel='noopener noreferrer'
              className='border-border hover:border-primary hover:text-primary inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors'
            >
              {l.label}
              <ExternalLink className='size-3.5' />
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'border-border relative w-full overflow-hidden rounded-xl border',
        FRAME[platform]
      )}
    >
      {state === 'loading' && (
        <div className='bg-card absolute inset-0 flex items-center justify-center'>
          <Skeleton className='size-full' />
          <span className='text-muted-foreground absolute text-sm'>{labels.loading}</span>
        </div>
      )}
      <iframe
        src={src}
        title={title}
        loading='lazy'
        allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
        allowFullScreen
        className='size-full border-0'
        onLoad={() => setState('ready')}
        onError={() => setState('error')}
      />
    </div>
  );
}
