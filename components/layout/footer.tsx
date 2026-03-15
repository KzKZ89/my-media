import Link from 'next/link';
import Image from 'next/image';

const footerLinks = [
  { label: '記事一覧', href: '/blog' },
  { label: 'カテゴリ', href: '/blog' },
  { label: 'お問い合わせ', href: '/contact' },
  { label: 'プライバシーポリシー', href: '/privacy' },
  { label: '運営会社', href: '/company' },
];

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <Link href="/">
            <Image
              src="http://could.co.jp/wp-content/uploads/2026/03/3b6a6774ddfe85847ebf0a5c85415752.png"
              alt="COuld inc"
              width={120}
              height={40}
              className="h-10 w-auto brightness-0 invert"
            />
          </Link>
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {footerLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-center text-xs text-white/40">
            &copy; {new Date().getFullYear()} MyMedia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
