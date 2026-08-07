import { Metadata } from 'next';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'Abolition Bills',
  description: 'Learn about abolition bills in Michigan — what makes a real abolition bill different from a pro-life bill, plus tracking of current legislation.',
  alternates: { canonical: '/abolition-bills' },
};

export default function AbolitionBillsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Abolition</span>{' '}
            <span className="font-black">BILLS</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">Legislative efforts to abolish abortion in Michigan</p>
        </div>
      </section>

      {/* What is an Abolition Bill */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">What is an Abolition Bill?</h2>
          <p className="text-gray-700 mb-4">
            An abolition bill is legislation that treats abortion as what it is: <span className="text-red-600 font-semibold">murder</span>. Unlike incremental pro-life bills that regulate abortion while leaving it legal, an abolition bill calls for the immediate and total end of abortion.
          </p>
          <p className="text-gray-700 mb-6">
            Key characteristics of a true abolition bill:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
            <li><strong>Equal Protection:</strong> Extends the same legal protections to preborn children as to born children</li>
            <li><strong>No Exceptions:</strong> Does not permit abortion for rape, incest, or any other circumstance</li>
            <li><strong>Criminalization:</strong> Treats abortion as homicide under the law</li>
            <li><strong>Defiance of Unjust Federal Law:</strong> Nullifies any federal law or court opinion that purports to permit abortion</li>
          </ul>
        </div>
      </section>

      {/* Current Legislation */}
      <section id="current" className="bg-gray-100 py-16 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Current Legislative Landscape</h2>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-8">
            <h3 className="font-bold text-lg mb-2">Prop 3 - Michigan&apos;s Abortion Amendment</h3>
            <p className="text-gray-700">
              In November 2022, Michigan voters passed Proposal 3, which enshrined a &ldquo;right&rdquo; to abortion in the state constitution. This makes the work of abolition more challenging but not impossible. We continue to call upon legislators to uphold God&apos;s law and protect the preborn regardless of this unjust amendment.
            </p>
          </div>

          <h3 className="text-2xl font-bold mb-4">Why We Don&apos;t Support Incremental Bills</h3>
          <p className="text-gray-700 mb-4">
            You may wonder why we don&apos;t support bills that restrict abortion—heartbeat bills, 20-week bans, etc. Here&apos;s why:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>They concede that some abortions are acceptable</li>
            <li>They treat some children as less worthy of protection than others</li>
            <li>They have failed for 50 years to end abortion</li>
            <li>They violate the principle of equal protection under the law</li>
            <li>They are morally inconsistent—we would never accept incremental abolition of any other form of murder</li>
          </ul>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </>
  );
}
