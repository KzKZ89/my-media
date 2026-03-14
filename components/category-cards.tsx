import Link from 'next/link';
import type { Category } from '@/types/wordpress';

type Props = {
  categories: Category[];
};

export function CategoryCards({ categories }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/blog?category=${cat.slug}`}
          className="group rounded-lg bg-brand/5 p-6 transition-shadow hover:shadow-lg"
        >
          <h3 className="mb-1 text-[15px] font-bold text-navy group-hover:text-brand">
            {cat.name}
          </h3>
          <p className="text-sm text-gray-text">{cat.count}件の記事</p>
        </Link>
      ))}
    </div>
  );
}
