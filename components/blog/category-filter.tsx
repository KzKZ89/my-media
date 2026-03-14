'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/wordpress';

type Props = {
  categories: Category[];
};

export function CategoryFilter({ categories }: Props) {
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get('category');

  return (
    <div className="flex gap-1 overflow-x-auto border-b border-border">
      <Link
        href="/blog"
        className={cn(
          'whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors',
          !activeSlug
            ? 'border-b-2 border-brand text-brand'
            : 'text-gray-text hover:text-navy',
        )}
      >
        すべて
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/blog?category=${cat.slug}`}
          className={cn(
            'whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors',
            activeSlug === cat.slug
              ? 'border-b-2 border-brand text-brand'
              : 'text-gray-text hover:text-navy',
          )}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
