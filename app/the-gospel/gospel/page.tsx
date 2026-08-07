import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'The Gospel',
  description: 'The Gospel of Jesus Christ — the power of God for salvation to everyone who believes. Why abolitionists proclaim it as the answer to every sin, including abortion.',
  alternates: { canonical: '/the-gospel/gospel' },
};

export default function GospelPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">The</span>{' '}
            <span className="font-black">GOSPEL</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">The Gospel is the Power of God for Salvation to Everyone who Believes</p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'The Gospel', href: '/the-gospel' }, { label: 'The Gospel' }]} />

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none space-y-6">

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>I am not ashamed of the gospel, for it is the power of God for salvation to everyone who believes, to the Jew first and also to the Greek</p>
              <cite className="text-gray-600 not-italic">&mdash; Romans 1:16</cite>
            </blockquote>

            <p>
              The reality of abortion is that 57 million babies have been recorded killed since 1973 and that number is rising as 3,500 &ndash; 4,000 babies continue to be murdered daily. We are living in the midst of a genocide and God hates the hands that shed innocent blood (<a href="https://biblia.com/bible/esv/proverbs/6/17" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Prov. 6:17</a>). We must not neglect the children being abandoned and led to their deaths.
            </p>

            <p>
              God has provided a way we can be reconciled to a right relationship with Him so that we don&apos;t have to indulge in bloodshed. Being guilty of sin before a holy and just God, we all deserve the penalty of sin &ndash; death (<a href="https://biblia.com/bible/esv/romans/6/23" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Romans 6:23</a>). However, out of the abundance of God&apos;s mercy, He sent His Son to take upon our sins on Himself so that He would receive the penalty we rightly deserve. As Jesus became the substitute for sin on our behalf, &ldquo;God demonstrated His righteousness so that He might be just and the justifier of the one who has faith in Jesus&rdquo; (<a href="https://biblia.com/bible/esv/romans/3/26" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Romans 3:26</a>). God then raised Jesus from the dead, giving the Father the ability to reconcile and declare righteous those who repent and trust in Christ alone to free them from the condemnation of sin. That same power that raised Christ from the dead is now at work in those who believe. &ldquo;Therefore, repent and turn back, so that your sins may be wiped out&rdquo; (<a href="https://biblia.com/bible/esv/acts/3/19" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Acts 3:19</a>).
            </p>

            <p>
              Part of living a life in accordance to repentance is placing your full faith in Jesus and continually abiding in Him and persevering until death. So &ldquo;just as Christ was raised from the dead by the glory of the Father, we too should walk in newness of life&rdquo; (<a href="https://biblia.com/bible/esv/romans/6/2-4" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Romans 6:2,4</a>).
            </p>

            <p>
              Having been made a new creation in Christ, &ldquo;conduct yourself in a manner worthy of the gospel of Christ&rdquo; (<a href="https://biblia.com/bible/esv/philippians/1/27" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Phil 1:27</a>). by loving your [preborn] neighbors as yourselves (<a href="https://biblia.com/bible/esv/matthew/22/39" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Matt 22:39</a>) and visiting orphans in their time of distress (<a href="https://biblia.com/bible/esv/james/1/27" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">James 1:27</a>). Now&apos;s the time to stand up against the injustice of the preborn genocide!
            </p>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/gospel.png"
              alt="The Gospel"
              className="w-full max-w-md mx-auto my-8 rounded-lg"
            />

            <div className="my-10">
              <Link
                href="/the-gospel/kingdom-of-god"
                className="inline-block px-8 py-4 bg-red-600 text-white font-bold text-sm tracking-wide hover:bg-red-700 transition-colors no-underline"
              >
                Read More &#10148; ABOLITIONISM &amp; THE KINGDOM OF GOD
              </Link>
            </div>

            <p className="text-sm text-gray-500 italic">
              This content was originally published by Abolish Abortion California, and is used by permission. Garden State Abolitionists is not formally affiliated with Abolish Abortion California, but shares its abolitionist mission and principles.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/the-gospel" className="text-red-600 font-semibold hover:underline">
              &larr; Back to The Gospel
            </Link>
            <Link href="/the-gospel/kingdom-of-god" className="text-red-600 font-semibold hover:underline">
              The Kingdom of God &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
