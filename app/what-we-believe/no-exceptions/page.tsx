import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'No Exceptions',
  description: 'Abortion is murder, always and everywhere. We demand no exceptions - no compromise on the dehumanization of the preborn.',
  alternates: { canonical: '/what-we-believe/no-exceptions' },
};

export default function NoExceptionsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">No</span>{' '}
            <span className="font-black">EXCEPTIONS</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">Abortion is Murder | Always &amp; Everywhere Murder</p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'What We Believe', href: '/what-we-believe' }, { label: 'No Exceptions' }]} />

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none space-y-6">
            <h2 className="text-3xl md:text-4xl mb-2">
              <span className="font-light">Murder Is Never</span>{' '}
              <span className="font-black">ACCEPTABLE</span>
            </h2>
            <p className="text-sm tracking-[0.2em] uppercase font-semibold text-gray-800 mt-0 mb-2">And neither is any law that creates exceptions for it</p>
            <div className="w-12 h-[3px] bg-red-600 mb-8" />

            <p>
              For the same reasons that we demand abortion&apos;s immediate abolition, we demand abortion&apos;s total abolition. That means no exceptions. No exceptions which allow for murdering babies because of the circumstances in which they were conceived. No exceptions that allow for murdering babies because they have a disease or disorder. No exceptions whatsoever. If abortion is murder, and we all know it is, it must be abolished entirely.
            </p>

            <p>
              Not only are exceptions morally repugnant, they are devastating to the cause pragmatically. To compromise on an issue like child sacrifice is to fatally weaken the foundation of the moral argument. Elizabeth Heyrick, a British abolitionist of slavery had this to say on the matter:
            </p>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>
                On this great questions, the spirit of accommodation and conciliation has been a spirit of delusion. The abolitionists have lost, rather than gained ground by it; their cause has been weakened, instead of strengthened. The great interests of truth and justice are betrayed, rather than supported, by all softening qualifying concessions. Every iota which is yielded of their rightful claims, impairs the conviction of their rectitude, and, consequently, weakens their success.
              </p>
              <cite className="text-gray-600 not-italic">&mdash; Elizabeth Heyrick</cite>
            </blockquote>

            <p>
              In plain English, Heyrick is explaining that compromising with an evil such as slavery undermined the power of the anti-slavery argument. If slavery was truly manstealing, assault, rape, murder, etc., then those who oppose it would be demanding its immediate abolition. To compromise with and allow exceptions for a capital crime would be double-minded wickedness. To make concessions with an evil such as slavery or abortion as if issues of murder and dehumanization were like any other political back-and-forth is to weaken the power that truth and justice hold over the discussion.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">The Child Conceived in Rape</h3>

            <p>
              Abolitionism could be described as upholding justice for the fatherless. No one is more fatherless than the child conceived in rape. This is probably the most vulnerable group of human beings on the planet. A law which allows for abortion in this situation is a thoroughly iniquitous decree which makes the fatherless prey (See <a href="https://biblia.com/bible/esv/isaiah/1/16-17" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Isaiah 1:16-17</a>; <a href="https://biblia.com/bible/esv/isaiah/10/1-2" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">10:1-2</a>). The law must prohibit the execution of the child for the crime of his or her father.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">The Child With a Disability</h3>

            <p>
              Regarding physical or genetic abnormalities, the fact that a child might have a shorter or more difficult life does not justify the right to murder them. This exception for abortion is so facially evil, absurd, and heartless toward the preborn child as well as born people with disabilities that it&apos;s hard to believe anyone makes it.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">The Child Whose Mother Is In Danger</h3>

            <p>
              Regarding situations where the life of the mother is in jeopardy, there is no circumstance where the baby must be intentionally murdered. There are cases where the child must be delivered early, and in those cases, the child may have a lower probability of survival than a child born at full-term, but intentional murder must not be allowed as an option. Doctors must be healers, not killers.
            </p>

            <div className="bg-gray-100 p-6 rounded-lg my-8">
              <p>
                Never compromise on dehumanization. Demand equal justice and protection for all human beings, meaning abortion&apos;s total and immediate abolition. To have a spirit of compromise, or accommodation and conciliation as Heyrick put it, is to fight against abortion without the power of truth and justice. God forbid we ever do so.
              </p>
            </div>

            <p>
              Click the button below to read about the fourth distinction between abolitionists and pro-lifers: Abolitionists support nullification and interposition while pro-lifers submit unconditionally to tyrants.
            </p>

            <div className="my-10">
              <Link
                href="/what-we-believe/ignore-roe"
                className="inline-block px-8 py-4 bg-red-600 text-white font-bold text-sm tracking-wide hover:bg-red-700 transition-colors no-underline"
              >
                Read More &#10148; WE ARE NULLIFICATIONISTS
              </Link>
            </div>

            <p className="text-sm text-gray-500 italic">
              This content was originally published by <a href="https://freethestates.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Free the States</a>, and is used by permission. Garden State Abolitionists is not formally affiliated with <a href="https://freethestates.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Free the States</a>, but shares its abolitionist mission and principles.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/what-we-believe/immediate-not-gradual" className="text-red-600 font-semibold hover:underline">
              &larr; Immediate, Not Gradual
            </Link>
            <Link href="/what-we-believe/ignore-roe" className="text-red-600 font-semibold hover:underline">
              Ignore Roe &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
