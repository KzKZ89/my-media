const companies = [
  '株式会社ABC',
  'XYZテクノロジーズ',
  'グローバルシステムズ',
  'ネクストイノベーション',
  'クラウドワークス',
  'データブリッジ',
  'スマートソリューションズ',
  'テックフォワード',
];

export function LogoScroll() {
  return (
    <section className="bg-gray-bg py-10">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-gray-text">
          導入企業様
        </p>
      </div>
      <div className="relative overflow-hidden">
        <div className="flex animate-logo-scroll">
          {[...companies, ...companies].map((name, i) => (
            <span
              key={i}
              className="mx-8 shrink-0 whitespace-nowrap text-lg font-bold text-navy/20"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
