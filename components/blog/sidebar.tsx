import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/types/wordpress';

type Props = {
  relatedPosts: Post[];
};

export function Sidebar({ relatedPosts }: Props) {
  return (
    <aside className="space-y-8">
      {/* 関連記事 */}
      {relatedPosts.length > 0 && (
        <div className="rounded-lg border border-border bg-white p-5">
          <h3 className="mb-4 text-sm font-bold text-navy">関連記事</h3>
          <ul className="space-y-4">
            {relatedPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex gap-3"
                >
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded bg-gray-bg">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage.url}
                        alt={post.featuredImage.alt || post.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-gray-text">
                        No Image
                      </div>
                    )}
                  </div>
                  <p className="line-clamp-3 text-sm font-medium leading-snug text-navy transition-colors group-hover:text-brand">
                    {post.title}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA カード */}
      <div className="rounded-lg bg-navy p-6 text-center text-white">
        <p className="mb-2 text-base font-bold">
          ビジネスの成長を
          <br />
          加速しませんか？
        </p>
        <p className="mb-5 text-xs text-white/60">
          専門チームが課題をヒアリングし最適なソリューションをご提案します
        </p>
        <Link
          href="/contact"
          className="inline-block rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-white/90"
        >
          無料相談する
        </Link>
      </div>
    </aside>
  );
}
