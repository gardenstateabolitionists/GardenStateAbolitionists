import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';
import Breadcrumbs from '@/components/Breadcrumbs';
import LiteYouTube from '@/components/LiteYouTube';

export const metadata: Metadata = {
  title: 'The Incarnation',
  description: 'The Word became flesh and dwelt among us. Christ Himself was knit together in a womb from fertilization — the theological ground for abolishing abortion.',
  alternates: { canonical: '/the-gospel/incarnation' },
};

// VideoObject JSON-LD for both YouTube embeds on this page. Without these,
// Google Search Console reports "Video isn't on a watch page" and won't
// treat the videos as indexable rich results. Upload dates + durations
// come directly from the YouTube video pages (2015-12 originals from
// Abolish Human Abortion). Duration format is ISO-8601 (PT#M#S).
const videoIncarnation = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'The Incarnation',
  description:
    'The Word became flesh and dwelt among us. Christ Himself was knit together in a womb from fertilization — the theological ground for abolishing abortion.',
  thumbnailUrl: [
    'https://img.youtube.com/vi/4tL4Whq9NN0/maxresdefault.jpg',
    'https://img.youtube.com/vi/4tL4Whq9NN0/hqdefault.jpg',
  ],
  uploadDate: '2015-12-08T06:49:59-08:00',
  duration: 'PT2M4S',
  contentUrl: 'https://www.youtube.com/watch?v=4tL4Whq9NN0',
  embedUrl: 'https://www.youtube.com/embed/4tL4Whq9NN0',
};

const videoAbortionIncarnation = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'Abortion and the Incarnation of Christ',
  description:
    'Extended teaching on how the Incarnation of Christ — the Son of God taking on human nature from the moment of conception — grounds the case for abolishing abortion.',
  thumbnailUrl: [
    'https://img.youtube.com/vi/W9s9DgyLA28/maxresdefault.jpg',
    'https://img.youtube.com/vi/W9s9DgyLA28/hqdefault.jpg',
  ],
  uploadDate: '2015-12-11T17:00:38-08:00',
  duration: 'PT6M50S',
  contentUrl: 'https://www.youtube.com/watch?v=W9s9DgyLA28',
  embedUrl: 'https://www.youtube.com/embed/W9s9DgyLA28',
};

export default function IncarnationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoIncarnation) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoAbortionIncarnation) }}
      />
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">The</span>{' '}
            <span className="font-black">INCARNATION</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">The Word Became Flesh and Dwelt among us</p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'The Gospel', href: '/the-gospel' }, { label: 'The Incarnation' }]} />

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none space-y-6">
            <h2 className="text-3xl md:text-4xl mb-2">
              <span className="font-light">The Son of God</span>{' '}
              <span className="font-black">APPEARED</span>
            </h2>
            <p className="text-sm tracking-[0.2em] uppercase font-semibold text-gray-800 mt-0 mb-2">To Destroy the Works of the Devil</p>
            <div className="w-12 h-[3px] bg-red-600 mb-8" />

            <div className="my-8">
              <LiteYouTube videoId="4tL4Whq9NN0" title="The Incarnation" />
            </div>

            <p>
              Jesus Christ, the Son of God, entered the womb to redeem the world, to forgive sinners, reconcile humanity to God, and make all things new.
            </p>

            <div className="flex flex-col md:flex-row gap-8 my-8 items-start">
              <div className="md:w-2/3 space-y-6">
                <p className="mt-0">
                  Jesus Christ, the only begotten Son of God, did not enter our world through a birth canal. He did not begin his earthly existence in a manger in Bethlehem. He began his human life in the womb of a young, unmarried woman who was not planning to be with child.
                </p>

                <p>
                  The Creator of the cosmos came down among us and began His earthly existence as a human zygote no larger than a single cell. The Light of the world entered the darkness of the womb and underwent every stage of prenatal biological development before being born into a hostile world that immediately sought His destructions.
                </p>

                <p>
                  He became like us in all things in order that He might live just as we lived and face the same dangers, temptations, and troubles we face as fleshly creatures living in a fallen world (<a href="https://biblia.com/bible/esv/hebrews/2/14-18" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">Heb. 2:14-18</a>; <a href="https://biblia.com/bible/esv/colossians/1/15-23" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">Col. 1:15-23</a>).
                </p>
              </div>
              <div className="w-2/3 max-w-[220px] mx-auto md:max-w-none md:w-1/3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/incarnation-painting.jpeg"
                  alt="The Incarnation"
                  className="w-full rounded-lg"
                />
              </div>
            </div>

            <p>
              The Son of God appeared to give light to those who sit in darkness, bring life and immortality to light through the Gospel, set people free from their slavery to sin, reconcile the world to Himself, abolish death, destroy every work of darkness, and guide our feet into the way of peace. He revealed Himself as the Word of the Father, Ruler and King of all creation, head of the church and the living God, and Redeemer of sinful men (<a href="https://biblia.com/bible/esv/luke/1/78-79" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">Luke 1:78-79</a>; <a href="https://biblia.com/bible/esv/2-timothy/1/10" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">2 Tim. 1:10</a>; <a href="https://biblia.com/bible/esv/hebrews/8/12" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">Heb. 8:12</a>; <a href="https://biblia.com/bible/esv/luke/4/18" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">Luke 4:18</a>; <a href="https://biblia.com/bible/esv/1-corinthians/15/26" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">1 Cor. 15:26</a>; <a href="https://biblia.com/bible/esv/2-corinthians/5/18-21" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">2 Cor. 5:18-21</a>; <a href="https://biblia.com/bible/esv/1-john/3/8" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">1 John 3:8</a>; <a href="https://biblia.com/bible/esv/romans/3/23-24" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">Rom. 3:23-24</a>).
            </p>

            <p>
              The Incarnation of Christ stands in direct conflict with all forms of child sacrifice. Modern forms include chemical and surgical abortion, the use of abortifacient drugs and devices designed to make the womb inhospitable for human embryos, and all destructive methods associated with the dehumanizing practice of producing children outside the womb (IVF). Christ continues His work today as He leads His people to actively bring the Gospel of His Kingdom into conflict with the practice of human abortion.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">Abortion and the Incarnation of Christ</h3>

            <div className="my-8">
              <LiteYouTube videoId="W9s9DgyLA28" title="Abortion and the Incarnation of Christ" />
            </div>

            <p className="text-sm text-gray-500 italic">
              This content was originally published at <a href="https://web.archive.org/web/2026/https://abolishhumanabortion.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Abolish Human Abortion</a>. Garden State Abolitionists is not formally affiliated with <a href="https://web.archive.org/web/2026/https://abolishhumanabortion.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Abolish Human Abortion</a>, but shares its abolitionist principles.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/the-gospel/answer-to-abortion" className="text-red-700 font-semibold underline hover:no-underline">
              &larr; The Answer to Abortion
            </Link>
            <Link href="/the-gospel" className="text-red-700 font-semibold underline hover:no-underline">
              Back to The Gospel &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
