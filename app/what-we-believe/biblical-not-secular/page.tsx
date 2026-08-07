import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Biblical, Not Secular',
  description: 'Our opposition to abortion is grounded in biblical principles, not secular arguments. The duty is ours, the results belong to God.',
  alternates: { canonical: '/what-we-believe/biblical-not-secular' },
};

export default function BiblicalNotSecularPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Biblical,</span>{' '}
            <span className="font-black">NOT SECULAR</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">The Duty is Ours | The Results Belong to God</p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'What We Believe', href: '/what-we-believe' }, { label: 'Biblical, Not Secular' }]} />

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none space-y-6">
            <h2 className="text-3xl md:text-4xl mb-2">
              <span className="font-light">We Are</span>{' '}
              <span className="font-black">BIBLICAL</span>
            </h2>
            <p className="text-sm tracking-[0.2em] uppercase font-semibold text-gray-800 mt-0 mb-2">God has chosen the foolish things of the world to shame the wise &mdash; 1 Cor. 1:27</p>
            <div className="w-12 h-[3px] bg-red-600 mb-8" />

            <p>
              To be an abolitionist is more than simply working to end something. Anyone can work to end something. Abolitionism is about bringing the truth revealed in God&apos;s word into conflict with the evils of the age and the worldly wisdom of man. While the pro-life movement will argue that abortion is wrong because it causes pain, stops a beating heart, or betrays women, abolitionists maintain that abortion is wrong because human beings are created in the image of God and because the Creator Himself became a man in order to rescue mankind from sin, death, and eternal separation from God.
            </p>

            <p>
              Successful human rights campaigns <a href="https://youtube.com/watch?v=RAP6sHsNXS0&amp;t=" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">throughout history</a> have been built on this foundation. Perhaps the best articulation of what it means to bring the Gospel into conflict with the evil of the age comes from slavery abolitionist William Lloyd Garrison when he said, &ldquo;My fanaticism is to make Christianity the enemy of all that is sinful.&rdquo;
            </p>

            <p>
              Being Biblical means relying on God&apos;s words rather than worldly tactics and strategies. Rather than playing a game of political football, we proclaim God&apos;s word to the people and to the magistrates. That means we don&apos;t do things like test the winds to see whether the people support moving from a ban of abortion at 28 weeks to a ban at 24 weeks at this particular moment in time. We simply proclaim the truth that abortion is murder and that justice demands it be abolished immediately. The duty to make such proclamations is ours, and the results belong to God.
            </p>

            <p>
              This duty, as all moral obligations, is grounded in God&apos;s revealed word. Proverbs 24 tells us to rescue those being led to slaughter and in Isaiah 10, God warns the Hebrew leaders, &ldquo;Woe to those who decree iniquitous decrees.&rdquo; As for how to rescue those lead to slaughter, pro-life incrementalists are content to compromise in an attempt to save some babies, but these compromises are the definition of iniquitous decrees. They all allow for abortion as long as the baby is young enough. <a href="https://biblia.com/bible/esv/romans/3/8" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">Romans 3:8</a> rebukes those who would do evil that good may come, which is literally the strategy of the pro-life establishment. As abolitionists who take God&apos;s word seriously, we never write laws which make the fatherless prey and there&apos;s no one more fatherless than the child conceived in rape. The pro-life movement has long been content to write laws allowing for the murder of the most fatherless among us because of the crimes of their fathers. Woe unto them for this great and wicked compromise (<a href="https://biblia.com/bible/esv/isaiah/10/1-2" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">Isaiah 10:1-2</a>).
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">Moses, The First Abolitionist</h3>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/moses-pharaoh.jpg"
              alt="Moses and Pharaoh dialogue"
              className="w-full my-8 rounded-lg"
            />

            <p>
              Moses was a prototypical abolitionist. With his people suffering under a tyrant, Pharaoh offered all sorts of deals to Moses. He offered to let some of the Hebrews go, he offered to let the Hebrews go for a certain amount of time, and he even offered to let all the Hebrews go free permanently so long as they left their animals &ndash; to which Moses replied, &ldquo;Not a hoof shall be left behind&rdquo; (<a href="https://biblia.com/bible/esv/exodus/10/24-26" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">Exodus 10:24-26</a>).
            </p>

            <div className="bg-gray-100 p-6 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-4">Where They Conflict, Obey God Rather Than Man</h3>
              <p>
                Among many other verses, <a href="https://biblia.com/bible/esv/acts/5/29" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">Acts 5:29</a> teaches us that when presented with the choice between obeying God or obeying man, we obey God. So when the supreme court orders our state to allow the mass murder of preborn children, we boldly bring the Gospel into conflict with the court&apos;s rebellion against God.
              </p>
            </div>

            <p>
              Being Biblical means that abolition is the duty of the Church. While the pro-life leaders would have you do little or nothing more than send them a check in the mail every month, we exhort you to actively bring the Gospel into conflict with the practice of child sacrifice. Go to your local killing center and preach the Gospel to those stumbling toward slaughter. Schedule a meeting with your state senators, state representatives, state executives, city councils, and any other magistrates to explain to them their duty before God and Constitution to immediately abolish abortion. Spiritually and materially aid the pregnant single mothers in your neighborhood or church. Share abolitionist ideas with your friends and family. Share abolitionist articles, memes, and videos on social media. And encourage your fellow brothers and sisters in Christ to join you in all of that. That doesn&apos;t mean there aren&apos;t worthy abolitionist projects that need financial support from Christians. There are. But the Christian duty doesn&apos;t end there.
            </p>

            <p>
              Click the button below to read about the second distinction between abolitionists and pro-lifers: Abolitionists are immediatists while pro-lifers are incrementalists.
            </p>

            <div className="my-10">
              <Link
                href="/what-we-believe/immediate-not-gradual"
                className="inline-block px-8 py-4 bg-red-600 text-white font-bold text-sm tracking-wide hover:bg-red-700 transition-colors no-underline"
              >
                Read More &#10148; WE ARE IMMEDIATISTS
              </Link>
            </div>

            <p className="text-sm text-gray-500 italic">
              This content was originally published by <a href="https://freethestates.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Free the States</a>, and is used by permission. Garden State Abolitionists is not formally affiliated with <a href="https://freethestates.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Free the States</a>, but shares its abolitionist mission and principles.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/what-we-believe/abolitionist-not-pro-life" className="text-red-700 font-semibold underline hover:no-underline">
              &larr; Abolitionist, Not Pro-Life
            </Link>
            <Link href="/what-we-believe/immediate-not-gradual" className="text-red-700 font-semibold underline hover:no-underline">
              Immediate, Not Gradual &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
