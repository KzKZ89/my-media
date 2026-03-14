import { Suspense } from 'react';
import {
  getPostsPaginated,
  getCategories,
  getCategoryBySlug,
} from '@/lib/wordpress';
import { PostCard } from '@/components/blog/post-card';
import { CategoryFilter } from '@/components/blog/category-filter';
import { Pagination } from '@/components/blog/pagination';

export const revalidate = 3600;

export const metadata = {
  title: 'ブログ',
  description: '最新のBtoB SaaS関連記事をお届けします。',
};

type Props = {
  searchParams: Promise<{ category?: string; page?: string }>;
};

export default async function BlogPage({ searchParams }: Props) {
  const { category: categorySlug, page: pageStr } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageStr || '1', 10));

  const [categories, activeCategory] = await Promise.all([
    getCategories(),
    categorySlug ? getCategoryBySlug(categorySlug) : null,
  ]);

  const { posts, totalPages } = await getPostsPaginated(
    currentPage,
    12,
    activeCategory?.id,
  );

  const filterSearchParams: Record<string, string> = {};
  if (categorySlug) filterSearchParams.category = categorySlug;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-2xl font-bold text-navy">ブログ</h1>

      <div className="mb-10">
        <Suspense fallback={null}>
          <CategoryFilter categories={categories} />
        </Suspense>
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-gray-text">
          記事が見つかりませんでした。
        </p>
      )}

      <div className="mt-12">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/blog"
          searchParams={filterSearchParams}
        />
      </div>
    </div>
  );
}
