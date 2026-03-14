import Link from 'next/link';
import { getPosts, getCategories } from '@/lib/wordpress';
import { PostCard } from '@/components/blog/post-card';
import { LogoScroll } from '@/components/logo-scroll';
import { CategoryCards } from '@/components/category-cards';
import { CtaSection } from '@/components/cta-section';

export const revalidate = 3600;

export default async function HomePage() {
  const [posts, categories] = await Promise.all([
    getPosts(1, 6),
    getCategories(),
  ]);

  return (
    <>
      {/* ヒーローセクション */}
      <section className="bg-white px-6 py-24 text-center sm:py-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-[2.5rem] font-bold leading-tight tracking-tight text-navy sm:text-[3rem]">
            SaaSビジネスの成長を、
            <br />
            知識で加速する。
          </h1>
          <p className="mb-10 text-lg text-gray-text">
            マーケティング・セールス・プロダクト開発の最新トレンドと実践ノウハウをお届けします。
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-md bg-brand px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              無料相談する
            </Link>
            <Link
              href="/contact"
              className="rounded-md border border-brand px-8 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand/5"
            >
              資料を受け取る
            </Link>
          </div>
        </div>
      </section>

      {/* 導入企業ロゴ帯 */}
      <LogoScroll />

      {/* 最新記事グリッド */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-8 text-xl font-bold text-navy">最新記事</h2>
        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-gray-text">
            記事はまだありません。
          </p>
        )}
      </section>

      {/* カテゴリ一覧セクション */}
      {categories.length > 0 && (
        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-xl font-bold text-navy">
              カテゴリから探す
            </h2>
            <CategoryCards categories={categories} />
          </div>
        </section>
      )}

      {/* ページ下部CTA */}
      <CtaSection />
    </>
  );
}
