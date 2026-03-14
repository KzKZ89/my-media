import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/format-date';
import type { Post } from '@/types/wordpress';

type Props = {
  post: Post;
};

export function PostCard({ post }: Props) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="overflow-hidden rounded-lg border border-border bg-white transition-shadow hover:shadow-lg">
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-bg">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-text">
              No Image
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {post.categories.map((cat) => (
              <span
                key={cat.id}
                className="rounded bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand"
              >
                {cat.name}
              </span>
            ))}
          </div>
          <h3 className="mb-2 line-clamp-2 text-[15px] font-bold leading-snug text-navy">
            {post.title}
          </h3>
          <time className="text-xs text-gray-text">
            {formatDate(post.date)}
          </time>
        </div>
      </article>
    </Link>
  );
}
