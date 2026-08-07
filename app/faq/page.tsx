import { Metadata } from 'next';
import FAQSection from '@/components/FAQSection';
import { faqItems } from '@/lib/content';
import { sanitizeHtml } from '@/lib/sanitize';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers to the most common pro-choice objections and questions about abortion abolition — bodily autonomy, rape exception, back-alley abortions, and more.',
  alternates: { canonical: '/faq' },
};

const faqContent = faqItems.map((item) => ({
  id: item.id,
  title: item.title,
  content: <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.content) }} />,
}));

export default function FAQPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.title,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Frequently Asked</span>{' '}
            <span className="font-black">QUESTIONS</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
        </div>
      </section>

      {/* Introduction */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Abortion: the intentional killing of the human fetus, or the performance of a procedure intentionally designed to kill the human fetus.
          </h2>
          <p className="text-gray-700 mb-4">
            Abortion is the murder, the sacrifice, of tiny neighbors who have not yet been born.{' '}
            <span className="text-red-600 font-semibold">This is the definition.</span> This great atrocity must be abolished.
          </p>
          <p className="text-gray-700 mb-4">
            Below are common pro-choice objections that we have run across. If you are opposed to the abolition of human abortion, find your pet issue below and deal with the arguments against it.
          </p>
          <p className="text-gray-700 mb-6">
            Be forewarned – rare is the pro-choicer who ever advances the argument beyond the following series of steps:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
            <li>The pro-choicer offers one of the objections refuted below.</li>
            <li>An abolitionist rebuts the objection, usually with one of the arguments below its respective objection.</li>
            <li>
              The pro-choicer either:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>moves to an entirely different objection, and/or</li>
                <li>responds with a complete misunderstanding of the offered rebuttal, and/or</li>
                <li>dismisses the rebuttal, and/or</li>
                <li>engages in profane/obscene/outraged discourse in order to intimidate the abolitionist.</li>
              </ul>
            </li>
          </ol>
          <p className="text-gray-700 mb-8">
            Don&apos;t be like that. This is a serious issue, and these are serious rebuttals. We dare you to advance the debate, as we have already done. Set yourself apart from the vast majority of people.
          </p>
        </div>
      </section>

      {/* FAQ Content with Sidebar */}
      <section className="bg-white py-8 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <FAQSection items={faqContent} />
        </div>
      </section>
    </>
  );
}
