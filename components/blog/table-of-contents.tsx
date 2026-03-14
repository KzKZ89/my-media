'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { TocItem } from '@/lib/toc';

type Props = {
  items: TocItem[];
};

export function TableOfContents({ items }: Props) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px' },
    );

    const headings = document.querySelectorAll('h2[id], h3[id]');
    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;

  let h2Counter = 0;
  let h3Counter = 0;

  return (
    <nav className="rounded-lg border border-border bg-gray-bg p-5">
      <p className="mb-3 text-sm font-bold text-navy">目次</p>
      <ol className="space-y-1.5">
        {items.map((item) => {
          let label: string;
          if (item.level === 2) {
            h2Counter++;
            h3Counter = 0;
            label = `${h2Counter}.`;
          } else {
            h3Counter++;
            label = `${h2Counter}.${h3Counter}`;
          }

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  'block text-sm leading-relaxed transition-colors hover:text-brand',
                  item.level === 3 && 'pl-5',
                  activeId === item.id
                    ? 'font-medium text-brand'
                    : 'text-gray-text',
                )}
              >
                <span className="mr-1.5 text-gray-text">{label}</span>
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
