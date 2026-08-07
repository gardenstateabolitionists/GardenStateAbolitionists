import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';
import Breadcrumbs from '@/components/Breadcrumbs';
import LiteYouTube from '@/components/LiteYouTube';

export const metadata: Metadata = {
  title: 'Abolitionism and the Kingdom of God',
  description: 'Abolitionism and the Kingdom of God are inseparable. Read why ending abortion is part of what it means to bring God’s Kingdom to bear on our culture.',
  alternates: { canonical: '/the-gospel/kingdom-of-god' },
};

export default function KingdomOfGodPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Abolitionism &amp;</span>{' '}
            <span className="font-black">THE KINGDOM OF GOD</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">His Kingdom is one that shall not be destroyed</p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'The Gospel', href: '/the-gospel' }, { label: 'Abolitionism & the Kingdom of God' }]} />

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none space-y-6">
            <h2 className="text-3xl md:text-4xl mb-2">
              <span className="font-light">The Kingdom of</span>{' '}
              <span className="font-black">GOD</span>
            </h2>
            <p className="text-sm tracking-[0.2em] uppercase font-semibold text-gray-800 mt-0 mb-2">Is at hand; repent and believe the gospel. &mdash; Mark 1:15</p>
            <div className="w-12 h-[3px] bg-red-600 mb-8" />

            <h3 className="text-xl font-bold mt-8 mb-4">Bringing about a Clash of Absolutes</h3>

            <p>
              Abolitionists embrace a certain bold posture in the face of evil and utterly reject the widely accepted, largely ignored, or complacently permitted injustices that most people choose to ignore. Abolitionists make a point of bringing darkness out into the light of day, or rather, of shining light in the darkness that is already there.
            </p>

            <p>
              We seek to contrast two visions of reality and morality and demonstrate how one vision, the Christian view, centered on God, leads to the Humane and dignified treatment of human beings, while the other view, centered on man, leads to the inhumane and undignified treatment of human beings.
            </p>

            <div className="flex flex-col md:flex-row gap-8 my-8 items-start">
              <div className="md:w-2/3 space-y-6">
                <p className="mt-0">
                  We strive to provoke a clash of absolutes between the Gospel of Christ and the worldly wisdom of man. The goal of all abolitionist movements is the redemption of man from the dominion of man. At the root of all abolitionist movements you will find the presence and power of two interrelated propositions. The first is that human beings are created in the image of God and created to reflect that image. The second is that the Creator Himself became a man in order to rescue mankind from self-destruction, death, and eternal separation from God, from himself, and from his own kind.
                </p>

                <p>
                  At the heart of all that we do as abolitionists, as the people of God, is the Gospel call and cry, &ldquo;Repent for the Kingdom of God is at Hand!&rdquo; What drives abolitionism is a desire to do justice, love mercy, and walk humbly with our God (<a href="https://biblia.com/bible/esv/micah/6/8" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">Micah 6:8</a>). We seek to bring justice to the fatherless and help to the helpless (<a href="https://biblia.com/bible/esv/isaiah/1/16-17" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">Isaiah 1:16-17</a>). Our desire is to consistently practice what the New Testament calls pure and undefiled religion: to look after the orphaned and widows in their affliction, and to keep ourselves unstained by the world (<a href="https://biblia.com/bible/esv/james/1/27" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">James 1:27</a>).
                </p>
              </div>
              <div className="w-2/3 max-w-[220px] mx-auto md:max-w-none md:w-1/3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/repent-red.png"
                  alt="Repent"
                  className="w-full rounded-lg"
                />
              </div>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">We are Gospel-Centered</h3>

            <p>
              We are a Gospel-centered society, a Gospel-driven movement. We are committed to an unfettered, untainted, uncompromising adherence to the Good news that Jesus Christ is Lord of heaven and earth and has stepped down into space-time-history to redeem a lost, wandering, and wicked people from sin, certain death, and eternal separation from God. We are abolitionists because we have been adopted by God. Our work being biblically mandated and sovereignly ordained, we are called to be salt and light in a darkened, and defiled world; we are commanded to care for the fatherless and bring justice to the oppressed and preyed-upon. We have been exhorted to expose deeds of darkness, and destroy speculations raised up against the knowledge of God. We are exhorted to rescue the weak from death, snatch the falling from flames, and hold back the stumbling from the slaughter. We are against the world, for the world. And we can only do any of this through Christ who strengthens us. It is because of his finished work on the cross that we are able to be more than conquerors.
            </p>

            <p>
              Supreme above all philosophies, all isms and ideologies, is the fullness of the Gospel of God; (that God himself stepped down into human history as Jesus Christ, conceived in the womb of a young unmarried woman who did not choose to be with child or plan on being a mother, to live a sinless life before wicked man whom he came to die for, and redeem from the just wrath of God against sinners. It is the will of God that all men might come to know Him, and in the fullness of time, Christ Jesus has made this possible). The Gospel above all else possesses the capacity to mobilize human action and motivate moral behavior. It is the answer to all of societies ills and injustices. It is the bulwark against an ever increasing inhumanity of man against man. It is the Gospel alone that will end human oppression and redeem mankind from the dominion of evil powers and sinful man. It is the wellspring of love, hope, and joy. The actual foundation for justice. And the real answer to abortion.
            </p>

            <p>
              This is no mere adoption of the rhetorical power of Christian ideology. We are not trying to gain the ear of church people with our religious appeals or use biblical language to attract fellow believers. We actually believe this is true, and we have put all our hope in it.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">We are putting our Faith in Action</h3>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>
                Christianity asks us not merely to be generally religious and moral, but to believe specifically the doctrines, to consume the principles, and to practice the precepts of Christ.
              </p>
              <cite className="text-gray-600 not-italic">&mdash; William Wilberforce</cite>
            </blockquote>

            <p>
              As Wilberforce believed that Christianity must be outwardly practiced and not just preached, we see our work as part of the general call upon all Christians to be salt and light in this depraved and darkened world. If Christians hold a belief to be true, such as the belief that all human beings are loved by God and possess inherent worth, we believe that Christians are obliged to act on such beliefs. We believe that Christians are called to not only &ldquo;abhor evil and hold fast to what is good&rdquo; (<a href="https://biblia.com/bible/esv/romans/12/9" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">Romans 12:9</a>) but also to expose it (<a href="https://biblia.com/bible/esv/ephesians/5/11" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">Ephesians 5:11</a>) and destroy the ungodly speculations which allow and encourage it (<a href="https://biblia.com/bible/esv/2-corinthians/10/5" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">2 Corinthians 10:5</a>).
            </p>

            <p>
              We believe, along with another of our heroes Dietrich Bonhoeffer, that, &ldquo;Silence in the face of evil is itself evil: God will not hold us guiltless. Not to speak is to speak. Not to act is to act.&rdquo;
            </p>

            <p>
              But the key to all our action is simply living out the precepts of Christ. Just as Wilberforce believed when he wrote, &ldquo;My intent is not to convince the skeptic, or to answer the arguments of those who claim to oppose the fundamental doctrines of our faith, but to point out the scanty and mistaken ideas of most orthodox Christians, and to contrast their defective theological scheme with what I consider to be real Christianity.&rdquo;
            </p>

            <p>
              Our intent is one and the same.
            </p>

            <div className="bg-gray-100 p-6 rounded-lg my-8">
              <p>
                We are simply attempting to answer the question: What does Christianity look like in a culture that practices Child Sacrifice? And put our answer into action.
              </p>
            </div>

            <div className="my-8">
              <LiteYouTube videoId="ELYaw0oMrVE" title="Abolitionism and the Kingdom of God" />
            </div>

            <div className="my-10">
              <Link
                href="/the-gospel/great-commission"
                className="inline-block px-8 py-4 bg-red-600 text-white font-bold text-sm tracking-wide hover:bg-red-700 transition-colors no-underline"
              >
                Read More &#10148; ABOLITIONISM &amp; THE GREAT COMMISSION
              </Link>
            </div>

            <p className="text-sm text-gray-500 italic">
              This content was originally published at <a href="https://web.archive.org/web/2026/https://abolishhumanabortion.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Abolish Human Abortion</a>. Garden State Abolitionists is not formally affiliated with <a href="https://web.archive.org/web/2026/https://abolishhumanabortion.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Abolish Human Abortion</a>, but shares its abolitionist principles.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/the-gospel/gospel" className="text-red-700 font-semibold underline hover:no-underline">
              &larr; The Gospel
            </Link>
            <Link href="/the-gospel/great-commission" className="text-red-700 font-semibold underline hover:no-underline">
              The Great Commission &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
