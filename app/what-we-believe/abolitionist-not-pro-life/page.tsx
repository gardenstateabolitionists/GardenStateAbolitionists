import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Abolitionist, Not Pro-Life',
  description: 'Being pro-life is not the same as seeking to abolish abortion. Learn the difference between abolitionism and the pro-life movement.',
  alternates: { canonical: '/what-we-believe/abolitionist-not-pro-life' },
};

export default function AbolitionistNotProLifePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Abolitionist,</span>{' '}
            <span className="font-black">NOT PRO-LIFE</span>
          </h1>
          <div className="w-12 h-[3px] bg-green-700 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">Being pro-life is not the same as seeking to abolish abortion</p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'What We Believe', href: '/what-we-believe' }, { label: 'Abolitionist, Not Pro-Life' }]} />

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none space-y-6">
            <h2 className="text-3xl md:text-4xl mb-2">
              <span className="font-light">We Are</span>{' '}
              <span className="font-black">ABOLITIONISTS</span>
            </h2>
            <p className="text-sm tracking-[0.2em] uppercase font-semibold text-gray-800 mt-0 mb-2">We refuse to go with the multitude to do evil.</p>
            <div className="w-12 h-[3px] bg-green-700 mb-8" />

            <p>
              We, as an abolitionist organization, agree with the pro-life position that abortion is bad, but further, we believe abortion is murder and ought to be treated as such. While many who call themselves pro-life agree with us that abortion is murder, abortion has not been opposed by the pro-life political establishment in a manner consistent with its being murder. The manner in which abortion has been opposed by pro-life lobbyists and politicians has not only been inadequate and largely unfruitful, but cannot be fruitful for it betrays the very foundations of the case against Roe v Wade.
            </p>

            <p>
              For 46 years, the pro-life movement has opposed abortion by seeking to compromise with it. Pro-life strategists have accepted Roe as the &ldquo;law of the land&rdquo; and have focused on trying to regulate the murder of children in the womb to the greatest degree the courts will allow. Secularly minded pro-life strategists, who set themselves up as the political &ldquo;experts,&rdquo; have left the word of God on the sideline and fought abortion with worldly wisdom. Tragically, most pastors and Christian leaders have blithely and without looking at pro-life arguments and strategies in light of scripture deferred to the pro-life establishment&apos;s counsel. The Christian opposition to abortion has thus been woefully inadequate.
            </p>

            <p>
              The need for a reformation of the way Christians fight abortion was met in 2011 when the Abolitionist Movement in America was reignited. We are a part of that movement. Thus, we want to be very clear in defining what we mean by abolitionist and why we distinguish ourselves as abolitionists rather than pro-lifers.
            </p>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/settle-tree.jpg"
              alt="Abolitionist movement"
              className="w-full my-8 rounded-lg"
            />

            <h3 className="text-xl font-bold mt-8 mb-4">The Gospel and the Culture of Death</h3>

            <p>
              As abolitionists we are attempting to bring the Gospel of the Kingdom of Jesus Christ into conflict with the culture of death. We bring the Gospel into conflict with wicked and foolish pro-abortion arguments. We bring the Gospel into conflict with the evil laws which sanction and regulate abortion. Most importantly, we bring the Gospel into conflict with the apathy of the Church. That&apos;s the most important part because it is when the Church takes its rightful place in the battle to abolish abortion that abortion will be abolished.
            </p>

            <p>
              The abolitionist, as a Christian, seeks to lead people to Christ and rescue as many babies as possible from being taken away to death. We proclaim the Gospel, beseech mothers and fathers to repent of abortion, Christians to repent of abortion apathy, and the culture at large to repent of legalizing child-sacrifice and reject abortion as the evil of our age.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">No Compromise</h3>

            <p>
              Regarding legislation, abolitionists do not believe that compromise is an effective way to fight child sacrifice. Abolitionists don&apos;t believe we should make exceptions for abortion while arguing that abortion is evil. The abolitionist does not believe in encouraging the entrenched ageism and dehumanization of humans in the womb by putting forward bills that protect some humans at the expense of others based on their age or stage of development. The abolitionist calls for the total and immediate criminalization of abortion as murder and never attempts to simply regulate or reduce abortion by treating it as healthcare.
            </p>

            <p>
              Knowing that abortion is not likely to be abolished overnight, the abolitionist consistently calls for total and immediate abolition while working diligently to reduce the number of abortions by practicing moral suasion and assistance for as long as it takes and until total abolition is accomplished.
            </p>

            <div className="bg-gray-100 p-6 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-4">The Problem with Incrementalism</h3>
              <p>
                Abolitionists believe that we will never abolish abortion by calling for compromise; that we will never end abortion by allowing it all along the way to its &ldquo;incremental abolition.&rdquo; The abolitionist does not think that you can write laws to &ldquo;protect babies because they feel pain,&rdquo; then write laws to &ldquo;protect babies because they have beating hearts,&rdquo; then write laws to &ldquo;protect babies because they are human.&rdquo; By writing such laws, pro-life legislators train the culture to believe that abortion is permissible up to the point of pain or the possession of a beating heart instead of instructing the culture to abolish abortion because it is the murder of a human being created in the image of God.
              </p>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">Two Examples</h3>

            <p>
              <a href="https://freethestates.org/" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">Free the States</a>&apos; James Silberman met with the office of Ohio State Senator Andrew Brenner in April 2019. James explained to Brenner&apos;s aide the importance of introducing and passing a bill that nullifies Roe and treats abortion like murder from the moment of fertilization. At the end of James&apos; presentation, Brenner&apos;s aide said, &ldquo;This was very interesting, but it&apos;s Senator Brenner personal religious conviction that life begins at a heartbeat.&rdquo; Where did Senator Brenner learn that unbiblical, unscientific, dehumanizing nonsense? He learned it from the Heartbeat Bill which had just passed in Ohio a few months earlier.
            </p>

            <p>
              <a href="https://freethestates.org/" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">Free the States</a>&apos; Russell Hunter was ministering outside an abortion facility in Norman, OK in 2016. A young mother who Russell was pleading with not to have the abortion told him, &ldquo;It&apos;s okay. My baby won&apos;t even feel any pain.&rdquo; Where did she learn that it&apos;s acceptable to murder your baby as long as he or she doesn&apos;t feel pain? From the pro-life movement and the Pain-Capable Unborn Child Protection Act which highlights pain as the reason abortion should be illegal.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">Criminalization and the Gospel</h3>

            <p>
              Abolitionists are not trying to make abortion safer for women, more rare, or a little less legal. Abolitionists are seeking to criminalize abortion because it is murder and the laws against murder should be applied equally to all people. At the same time we preach the Gospel of Jesus Christ declaring that there is forgiveness for the sin of abortion, and all repentant post-abortive mothers and fathers can be redeemed and restored in knowing Jesus Christ as Lord. This truth does not mean that there should be no punishment for choosing to murder your child, however. There is no conflict between preaching the Gospel and establishing justice in the courts (<a href="https://biblia.com/bible/esv/isaiah/1/16-17" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">Isaiah 1:16-17</a>; <a href="https://biblia.com/bible/esv/amos/5/15" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">Amos 5:15</a>; <a href="https://biblia.com/bible/esv/luke/11/42" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">Luke 11:42</a>).
            </p>

            <blockquote className="border-l-4 border-green-700 pl-6 my-8 italic">
              <p>
                Simply put, abolitionism is nothing more or less than the practice of consistent biblical Christianity in a culture that practices child sacrifice. In our context, with abortion being the evil of our age, abolitionism is about the abolition of abortion in the name of, by the power of, and for the glory of Jesus Christ. We invite you to examine our views in the light of scripture and reason them out with us.
              </p>
            </blockquote>

            <p>
              The following pages in our &ldquo;What We Believe&rdquo; section further detail the distinctions between abolitionism and pro-lifeism. Please read and consider them. Click the button below to learn about the first distinction: Abolitionists are explicitly Biblical while pro-lifers are explicitly secular.
            </p>

            <div className="my-10">
              <Link
                href="/what-we-believe/biblical-not-secular"
                className="inline-block px-8 py-4 bg-green-700 text-white font-bold text-sm tracking-wide hover:bg-green-800 transition-colors no-underline"
              >
                Read More &#10148; WE ARE BIBLICAL
              </Link>
            </div>

            {/* Scorecard callout removed with the /legislators route
                (staged-for-nj/). Its premise — "which New Jersey legislators
                sponsor abolition bills" — is not currently true of New Jersey. */}

            <p className="text-sm text-gray-500 italic">
              This content was originally published by <a href="https://freethestates.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Free the States</a>, and is used by permission. Garden State Abolitionists is not formally affiliated with <a href="https://freethestates.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Free the States</a>, but shares its abolitionist mission and principles.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-end">
            <Link href="/what-we-believe/biblical-not-secular" className="text-green-700 font-semibold hover:underline">
              Biblical, Not Secular &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
