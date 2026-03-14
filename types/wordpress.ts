// WordPress REST API のレスポンス型
export type WPMediaDetails = {
  source_url: string;
  width: number;
  height: number;
};

export type WPFeaturedMedia = {
  id: number;
  source_url: string;
  alt_text: string;
  media_details: WPMediaDetails;
};

export type WPCategory = {
  id: number;
  name: string;
  slug: string;
  count: number;
  description: string;
  parent: number;
};

export type WPPost = {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  categories: number[];
  _embedded?: {
    'wp:featuredmedia'?: WPFeaturedMedia[];
    'wp:term'?: WPCategory[][];
  };
};

// アプリケーション側で使う正規化済みの型
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  featuredImage: FeaturedImage | null;
  categories: Category[];
};

export type PostDetail = Post & {
  content: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  count: number;
  description: string;
  parent: number;
};

export type FeaturedImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

export type PaginatedPosts = {
  posts: Post[];
  totalPages: number;
};
