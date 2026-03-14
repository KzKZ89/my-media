import type { Post, PostDetail, Category } from '@/types/wordpress';

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'マーケティング', slug: 'marketing', count: 8, description: 'マーケティング戦略に関する記事', parent: 0 },
  { id: 2, name: 'セールス', slug: 'sales', count: 5, description: '営業・セールスに関する記事', parent: 0 },
  { id: 3, name: 'プロダクト', slug: 'product', count: 6, description: 'プロダクト開発に関する記事', parent: 0 },
  { id: 4, name: 'カスタマーサクセス', slug: 'customer-success', count: 4, description: 'CS戦略に関する記事', parent: 0 },
];

const SAMPLE_CONTENT = `
<h2>はじめに</h2>
<p>BtoB SaaSビジネスにおいて、効果的な戦略の構築は成長の鍵を握ります。本記事では、最新のトレンドと実践的なノウハウを交えながら、成功へのアプローチを解説します。</p>

<h2>なぜ今この施策が重要なのか</h2>
<p>近年、デジタルトランスフォーメーション（DX）の波が加速し、企業の購買行動は大きく変化しています。従来のアプローチだけでは、競争の激しい市場で差別化を図ることが難しくなっています。</p>
<h3>市場環境の変化</h3>
<p>SaaS市場は年率20%以上で成長を続けており、新規参入も増加しています。このような環境下では、データドリブンなアプローチと顧客中心の戦略が不可欠です。</p>
<h3>顧客の期待値の変化</h3>
<p>BtoB顧客もBtoC同様のスムーズな体験を求めるようになっており、セルフサーブ型の情報提供やパーソナライズされた提案が求められています。</p>

<h2>具体的な施策とステップ</h2>
<p>ここでは、実際に効果が実証されている3つのステップを紹介します。</p>
<h3>ステップ1：現状分析</h3>
<p>まずは自社の現状を客観的に把握することが重要です。KPIの設定、ファネル分析、競合調査などを通じて、改善すべきポイントを明確にしましょう。</p>
<h3>ステップ2：戦略の立案</h3>
<p>分析結果をもとに、具体的な戦略を立案します。短期・中期・長期の目標を設定し、各フェーズでの施策を計画します。</p>
<h3>ステップ3：実行とPDCA</h3>
<p>計画を実行に移し、定期的にレビューを行います。データに基づいた意思決定を行い、継続的な改善サイクルを回していきましょう。</p>

<h2>まとめ</h2>
<p>BtoB SaaSビジネスの成長には、体系的なアプローチと継続的な改善が欠かせません。本記事で紹介した施策を参考に、自社に合った戦略を構築してみてください。</p>
`;

function createMockPost(index: number): Post {
  const titles = [
    'BtoB SaaSのリード獲得を3倍にしたコンテンツマーケティング戦略',
    'PLG（プロダクト・レッド・グロース）入門：SaaS成長の新常識',
    'カスタマーサクセスで解約率を50%削減した実践手法',
    'SaaS営業チームの生産性を高めるCRM活用術',
    'ARR1億円を突破するためのプライシング戦略',
    'BtoBマーケティングオートメーション導入ガイド2024',
    'インサイドセールスの立ち上げからスケールまで完全解説',
    'SaaSのオンボーディング改善でLTVを最大化する方法',
    'データドリブン経営を実現するKPIダッシュボード設計',
    'BtoB企業のブランディング戦略：信頼構築の5ステップ',
    'SaaSスタートアップのための資金調達ロードマップ',
    'エンタープライズセールスの提案力を高める商談設計術',
  ];

  const categoryIndex = index % MOCK_CATEGORIES.length;
  const daysAgo = index * 3;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  return {
    slug: `post-${index + 1}`,
    title: titles[index % titles.length],
    excerpt: `<p>${titles[index % titles.length]}について、具体的な施策と成功事例を交えて解説します。</p>`,
    date: date.toISOString(),
    featuredImage: {
      url: `https://placehold.co/800x450/e2e8f0/64748b?text=Article+${index + 1}`,
      alt: titles[index % titles.length],
      width: 800,
      height: 450,
    },
    categories: [MOCK_CATEGORIES[categoryIndex]],
  };
}

const ALL_MOCK_POSTS: Post[] = Array.from({ length: 24 }, (_, i) =>
  createMockPost(i),
);

export function getMockPosts(
  page: number,
  perPage: number,
  categoryId?: number,
): { posts: Post[]; totalPages: number } {
  let filtered = ALL_MOCK_POSTS;
  if (categoryId) {
    filtered = filtered.filter((p) =>
      p.categories.some((c) => c.id === categoryId),
    );
  }
  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (page - 1) * perPage;
  const posts = filtered.slice(start, start + perPage);
  return { posts, totalPages };
}

export function getMockPostBySlug(slug: string): PostDetail | null {
  const post = ALL_MOCK_POSTS.find((p) => p.slug === slug);
  if (!post) return null;
  return { ...post, content: SAMPLE_CONTENT };
}

export function getMockRelatedPosts(
  categoryIds: number[],
  excludeSlug: string,
  count: number,
): Post[] {
  return ALL_MOCK_POSTS.filter(
    (p) =>
      p.slug !== excludeSlug &&
      p.categories.some((c) => categoryIds.includes(c.id)),
  ).slice(0, count);
}

export function getMockCategories(): Category[] {
  return MOCK_CATEGORIES;
}

export function getMockCategoryBySlug(slug: string): Category | null {
  return MOCK_CATEGORIES.find((c) => c.slug === slug) || null;
}
