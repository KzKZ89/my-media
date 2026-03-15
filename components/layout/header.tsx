'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  { label: 'マーケティング', href: '/blog?category=marketing' },
  { label: 'セールス', href: '/blog?category=sales' },
  { label: 'プロダクト', href: '/blog?category=product' },
  { label: 'カスタマーサクセス', href: '/blog?category=customer-success' },
];

function DropdownMenu({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-navy-light transition-colors hover:text-brand">
        {label}
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
      </button>
      <div className="invisible absolute left-0 top-full z-50 min-w-[200px] rounded-lg border border-border bg-white py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-2 text-sm text-navy-light transition-colors hover:bg-gray-bg hover:text-brand"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        {/* ロゴ */}
        <Link href="/">
          <Image
            src="http://could.co.jp/wp-content/uploads/2026/03/3b6a6774ddfe85847ebf0a5c85415752.png"
            alt="COuld inc"
            width={160}
            height={48}
            className="h-12 w-auto"
            priority
          />
        </Link>

        {/* 中央ナビ：デスクトップ */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/blog"
            className="px-3 py-2 text-sm font-medium text-navy-light transition-colors hover:text-brand"
          >
            記事一覧
          </Link>
          <DropdownMenu label="カテゴリ" items={categories} />
          <Link
            href="/contact"
            className="px-3 py-2 text-sm font-medium text-navy-light transition-colors hover:text-brand"
          >
            お問い合わせ
          </Link>
        </nav>

        {/* 右端CTA：デスクトップ */}
        <Link
          href="/contact"
          className="hidden rounded-md bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark md:block"
        >
          無料相談する
        </Link>

        {/* ハンバーガー：モバイル */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
          aria-label="メニューを開く"
        >
          {mobileOpen ? (
            <X className="h-6 w-6 text-navy" />
          ) : (
            <Menu className="h-6 w-6 text-navy" />
          )}
        </button>
      </div>

      {/* モバイルメニュー */}
      <div
        className={cn(
          'overflow-hidden border-t border-border bg-white transition-all md:hidden',
          mobileOpen ? 'max-h-96' : 'max-h-0 border-t-0',
        )}
      >
        <nav className="flex flex-col gap-1 px-6 py-4">
          <Link
            href="/blog"
            className="rounded-md px-3 py-2.5 text-sm font-medium text-navy-light hover:bg-gray-bg"
            onClick={() => setMobileOpen(false)}
          >
            記事一覧
          </Link>
          <p className="mt-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-text">
            カテゴリ
          </p>
          {categories.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2.5 pl-6 text-sm text-navy-light hover:bg-gray-bg"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-md px-3 py-2.5 text-sm font-medium text-navy-light hover:bg-gray-bg"
            onClick={() => setMobileOpen(false)}
          >
            お問い合わせ
          </Link>
          <Link
            href="/contact"
            className="mt-2 rounded-md bg-brand px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-dark"
            onClick={() => setMobileOpen(false)}
          >
            無料相談する
          </Link>
        </nav>
      </div>
    </header>
  );
}
