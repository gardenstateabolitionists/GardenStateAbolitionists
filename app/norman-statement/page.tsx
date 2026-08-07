import { Metadata } from 'next';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'The Norman Statement',
  description:
    'The Norman Statement on the Abolition of Abortion summarises the theological and strategic distinctives of the abolitionist movement. Read the full statement at Abolitionists Rising.',
  alternates: { canonical: '/norman-statement' },
};

/**
 * Signpost page, not a copy. The Norman Statement is hosted and maintained by
 * Abolitionists Rising, so this page summarises it and sends readers there
 * rather than reproducing a document we do not maintain — a stale local copy
 * of someone else's confession is worse than no copy.
 */
const SOURCE_URL = 'https://abolitionistsrising.com/norman-statement/';

const ARTICLES: { title: string; summary: string }[] = [
  { title: 'Gospel-Centered', summary: 'Abortion is child sacrifice, and the gospel is the Christian answer to it.' },
  { title: 'Aligned Providentially', summary: 'Obedience to God comes before political pragmatism.' },
  { title: 'Through the Church', summary: 'Abolition is led by local churches, not by political parties.' },
  { title: 'Engaged Biblically', summary: 'Scripture governs the movement, including how it engages politically.' },
  { title: 'Sought Immediately, Without Compromise', summary: 'Total abolition now, rejecting incremental regulation.' },
  { title: 'National Repentance', summary: 'The nation stands under God’s judgment; abolition is a matter of repentance.' },
  { title: 'Equal Protection and Criminalization', summary: 'Abortion prosecuted as homicide, with full legal protection for the preborn.' },
  { title: 'Higher Law and Defying Tyrants', summary: 'Civil disobedience is justified where the state commands what God forbids.' },
  { title: 'Identification With the Abolitionist Movement', summary: 'Abolitionism is distinct from the mainstream pro-life movement.' },
  { title: 'The Great Commission', summary: 'Abolition is a discipleship issue, not merely a political one.' },
  { title: 'The Gospel', summary: 'Salvation is through Christ alone.' },
];

export default function NormanStatementPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">The Norman</span>{' '}
            <span className="font-black">STATEMENT</span>
          </h1>
          <div className="w-12 h-[3px] bg-green-700 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">
            The theological and strategic distinctives of abolitionism
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">What It Is</h2>
          <p className="text-gray-700 mb-6">
            The Norman Statement on the Abolition of Abortion is, in its own words, a summary of the
            theological and strategic distinctives of the abolitionist movement. It was drafted by 28
            people representing churches and abolitionist organisations from across the United States,
            and adopted in Norman, Oklahoma, from which it takes its name.
          </p>
          <p className="text-gray-700 mb-6">
            It exists to state plainly what abolitionism is — and what separates it from the mainstream
            pro-life movement. If you want to understand why we say{' '}
            <span className="text-green-800 font-semibold">immediate and total abolition</span> rather
            than regulation or reduction, this is the clearest place to start.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-6">The Eleven Articles</h2>
          <p className="text-gray-700 mb-6">
            Summarised below. These are our paraphrases — read the statement itself for the full
            wording and its scriptural support.
          </p>
          <ol className="space-y-4 mb-10">
            {ARTICLES.map((a, i) => (
              <li key={a.title} className="border-l-4 border-green-700 bg-gray-50 p-4 rounded-r">
                <p className="font-bold text-gray-900">
                  {i + 1}. {a.title}
                </p>
                <p className="text-gray-700 text-sm mt-1">{a.summary}</p>
              </li>
            ))}
          </ol>

          <div className="border-l-4 border-green-700 bg-gray-50 p-6 rounded-r">
            <h3 className="text-xl font-bold mb-2">Read the full statement</h3>
            <p className="text-gray-700 mb-4">
              The Norman Statement is hosted and maintained by Abolitionists Rising. We link to it
              rather than reproducing it here, so you always read the current text.
            </p>
            <a
              href={SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-green-700 text-white font-bold text-sm tracking-wide hover:bg-green-800 transition-colors no-underline"
            >
              Read The Norman Statement &rarr;
            </a>
            <p className="text-gray-500 text-sm mt-3">
              abolitionistsrising.com &mdash; opens in a new tab
            </p>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
