import Link from 'next/link';

export function CtaSection() {
  return (
    <section className="bg-navy px-6 py-20 text-center text-white">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
          まずはお気軽にご相談ください
        </h2>
        <p className="mb-8 text-sm text-white/60">
          専門チームが貴社の課題をヒアリングし、最適なソリューションをご提案します。
        </p>
        <Link
          href="/contact"
          className="inline-block rounded-md bg-white px-8 py-3 text-sm font-semibold text-navy transition-colors hover:bg-white/90"
        >
          無料相談する
        </Link>
      </div>
    </section>
  );
}
