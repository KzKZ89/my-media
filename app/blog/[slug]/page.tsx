import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug, getRelatedPosts } from '@/lib/wordpress';
import { extractToc, injectHeadingIds } from '@/lib/toc';
import { formatDate } from '@/lib/format-date';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { TableOfContents } from '@/components/blog/table-of-contents';
import { Sidebar } from '@/components/blog/sidebar';

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: '記事が見つかりません' };
  return {
    title: post.title,
    description: post.excerpt.replace(/<[^>]*>/g, '').slice(0, 160),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const categoryIds = post.categories.map((c) => c.id);
  const relatedPosts = await getRelatedPosts(categoryIds, slug);

  const toc = extractToc(post.content);
  const contentHtml = injectHeadingIds(post.content);

  const firstCategory = post.categories[0];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* パンくず */}
      <Breadcrumb
        items={[
          { label: 'ブログ', href: '/blog' },
          ...(firstCategory
            ? [
                {
                  label: firstCategory.name,
                  href: `/blog?category=${firstCategory.slug}`,
                },
              ]
            : []),
          { label: post.title },
        ]}
      />

      <div className="gap-12 lg:flex">
        {/* 左カラム：本文 */}
        <article className="min-w-0 flex-1">
          {/* アイキャッチ */}
          {post.featuredImage && (
            <div className="relative mb-8 aspect-[2/1] overflow-hidden rounded-lg bg-gray-bg">
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt || post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 720px"
                priority
              />
            </div>
          )}

          {/* タイトル・メタ */}
          <h1 className="mb-4 text-2xl font-bold leading-tight text-navy sm:text-3xl">
            {post.title}
          </h1>
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <time className="text-sm text-gray-text">
              {formatDate(post.date)}
            </time>
            {post.categories.map((cat) => (
              <span
                key={cat.id}
                className="rounded bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand"
              >
                {cat.name}
              </span>
            ))}
          </div>

          {/* 目次 */}
          {toc.length > 0 && (
            <div className="mb-10">
              <TableOfContents items={toc} />
            </div>
          )}

          {/* 本文 */}
          <div
            className="prose prose-neutral max-w-none prose-headings:scroll-mt-20 prose-headings:font-bold prose-headings:text-navy prose-a:text-brand prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* 記事末尾CTA */}
          <div className="mt-16 rounded-lg bg-brand px-6 py-10 text-center text-white">
            <p className="mb-2 text-lg font-bold">
              この記事を読んで気になったことがあれば
            </p>
            <p className="mb-6 text-sm text-white/70">
              専門チームが貴社の課題をヒアリングし、最適なソリューションをご提案します。
            </p>
            <Link
              href="/contact"
              className="inline-block rounded-md bg-white px-8 py-3 text-sm font-semibold text-brand transition-colors hover:bg-white/90"
            >
              無料相談する
            </Link>
          </div>
        </article>

        {/* 右サイドバー */}
        <div className="mt-10 w-full shrink-0 lg:mt-0 lg:w-72 xl:w-80">
          <div className="sticky top-24">
            <Sidebar relatedPosts={relatedPosts} />
          </div>
        </div>
      </div>
    </div>
  );
}
