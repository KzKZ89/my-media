import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
};

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
}: Props) {
  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set('page', String(page));
    } else {
      params.delete('page');
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const pages: (number | '...')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav aria-label="ページネーション" className="flex items-center justify-center gap-1">
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="flex h-9 items-center gap-1 rounded-md px-3 text-sm text-gray-text transition-colors hover:bg-gray-bg hover:text-navy"
        >
          <ChevronLeft className="h-4 w-4" />
          前へ
        </Link>
      ) : (
        <span className="flex h-9 items-center gap-1 rounded-md px-3 text-sm text-border">
          <ChevronLeft className="h-4 w-4" />
          前へ
        </span>
      )}

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="px-2 text-sm text-gray-text">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors',
              p === currentPage
                ? 'bg-brand text-white'
                : 'text-gray-text hover:bg-gray-bg hover:text-navy',
            )}
          >
            {p}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="flex h-9 items-center gap-1 rounded-md px-3 text-sm text-gray-text transition-colors hover:bg-gray-bg hover:text-navy"
        >
          次へ
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-9 items-center gap-1 rounded-md px-3 text-sm text-border">
          次へ
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
