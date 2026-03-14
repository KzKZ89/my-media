import type {
  WPPost,
  WPCategory,
  Post,
  PostDetail,
  Category,
  FeaturedImage,
  PaginatedPosts,
} from '@/types/wordpress';
import {
  getMockPosts,
  getMockPostBySlug,
  getMockRelatedPosts,
  getMockCategories,
  getMockCategoryBySlug,
} from '@/lib/mock-data';

const WORDPRESS_URL = process.env.WORDPRESS_URL;

const USE_MOCK =
  !WORDPRESS_URL ||
  WORDPRESS_URL === 'https://your-wordpress-site.com';

function getBaseUrl(): string {
  if (!WORDPRESS_URL) {
    throw new Error('WORDPRESS_URL environment variable is not set');
  }
  return `${WORDPRESS_URL}/wp-json/wp/v2`;
}

async function fetchAPI<T>(
  path: string,
  params: Record<string, string> = {},
  tags: string[] = [],
): Promise<T> {
  const url = new URL(`${getBaseUrl()}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const res = await fetch(url.toString(), {
    next: { revalidate: 60, tags },
  });

  if (!res.ok) {
    throw new Error(`WordPress API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

async function fetchAPIWithHeaders<T>(
  path: string,
  params: Record<string, string> = {},
  tags: string[] = [],
): Promise<{ data: T; totalPages: number }> {
  const url = new URL(`${getBaseUrl()}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const res = await fetch(url.toString(), {
    next: { revalidate: 60, tags },
  });

  if (!res.ok) {
    throw new Error(`WordPress API error: ${res.status} ${res.statusText}`);
  }

  const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
  const data = (await res.json()) as T;
  return { data, totalPages };
}

// --- 変換ヘルパー ---

function extractFeaturedImage(post: WPPost): FeaturedImage | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return null;
  return {
    url: media.source_url,
    alt: media.alt_text,
    width: media.media_details.width,
    height: media.media_details.height,
  };
}

function extractCategories(post: WPPost): Category[] {
  const terms = post._embedded?.['wp:term']?.[0];
  if (!terms) return [];
  return terms.map(mapCategory);
}

function mapPost(post: WPPost): Post {
  return {
    slug: post.slug,
    title: post.title.rendered,
    excerpt: post.excerpt.rendered,
    date: post.date,
    featuredImage: extractFeaturedImage(post),
    categories: extractCategories(post),
  };
}

function mapPostDetail(post: WPPost): PostDetail {
  return {
    ...mapPost(post),
    content: post.content.rendered,
  };
}

function mapCategory(cat: WPCategory): Category {
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    count: cat.count,
    description: cat.description,
    parent: cat.parent,
  };
}

// --- API 関数 ---

/** 記事一覧を取得 */
export async function getPosts(
  page = 1,
  perPage = 12,
  categoryId?: number,
): Promise<Post[]> {
  if (USE_MOCK) {
    return getMockPosts(page, perPage, categoryId).posts;
  }

  const params: Record<string, string> = {
    _embed: 'wp:featuredmedia,wp:term',
    page: String(page),
    per_page: String(perPage),
    orderby: 'date',
    order: 'desc',
  };
  if (categoryId) {
    params.categories = String(categoryId);
  }

  const posts = await fetchAPI<WPPost[]>('/posts', params, ['posts']);
  return posts.map(mapPost);
}

/** 記事一覧をページネーション付きで取得 */
export async function getPostsPaginated(
  page = 1,
  perPage = 12,
  categoryId?: number,
): Promise<PaginatedPosts> {
  if (USE_MOCK) {
    return getMockPosts(page, perPage, categoryId);
  }

  const params: Record<string, string> = {
    _embed: 'wp:featuredmedia,wp:term',
    page: String(page),
    per_page: String(perPage),
    orderby: 'date',
    order: 'desc',
  };
  if (categoryId) {
    params.categories = String(categoryId);
  }

  const { data, totalPages } = await fetchAPIWithHeaders<WPPost[]>(
    '/posts',
    params,
    ['posts'],
  );
  return { posts: data.map(mapPost), totalPages };
}

/** スラッグから記事詳細を取得 */
export async function getPostBySlug(
  slug: string,
): Promise<PostDetail | null> {
  if (USE_MOCK) {
    return getMockPostBySlug(slug);
  }

  const posts = await fetchAPI<WPPost[]>(
    '/posts',
    {
      slug,
      _embed: 'wp:featuredmedia,wp:term',
    },
    [`post-${slug}`],
  );

  if (posts.length === 0) return null;
  return mapPostDetail(posts[0]);
}

/** カテゴリ一覧を取得 */
export async function getCategories(): Promise<Category[]> {
  if (USE_MOCK) {
    return getMockCategories();
  }

  const params: Record<string, string> = {
    per_page: '100',
    orderby: 'count',
    order: 'desc',
    hide_empty: 'true',
  };

  const categories = await fetchAPI<WPCategory[]>(
    '/categories',
    params,
    ['categories'],
  );
  return categories.map(mapCategory);
}

/** 関連記事を取得（同一カテゴリから指定slugを除外） */
export async function getRelatedPosts(
  categoryIds: number[],
  excludeSlug: string,
  count = 3,
): Promise<Post[]> {
  if (USE_MOCK) {
    return getMockRelatedPosts(categoryIds, excludeSlug, count);
  }

  if (categoryIds.length === 0) return [];
  const params: Record<string, string> = {
    _embed: 'wp:featuredmedia,wp:term',
    per_page: String(count + 1),
    categories: categoryIds.join(','),
    orderby: 'date',
    order: 'desc',
  };
  const posts = await fetchAPI<WPPost[]>('/posts', params, ['posts']);
  return posts
    .filter((p) => p.slug !== excludeSlug)
    .slice(0, count)
    .map(mapPost);
}

/** スラッグからカテゴリを取得 */
export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  if (USE_MOCK) {
    return getMockCategoryBySlug(slug);
  }

  const categories = await fetchAPI<WPCategory[]>(
    '/categories',
    { slug },
    [`category-${slug}`],
  );

  if (categories.length === 0) return null;
  return mapCategory(categories[0]);
}
