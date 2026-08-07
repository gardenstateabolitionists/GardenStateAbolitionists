import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Ignore Roe',
  description: 'The Supreme Court is not the supreme law of the land. Why states have the constitutional duty to nullify unjust rulings like Roe v. Wade and abolish abortion.',
  alternates: { canonical: '/what-we-believe/ignore-roe' },
};

export default function IgnoreRoePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Ignore</span>{' '}
            <span className="font-black">ROE</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">The Supreme Court is not the supreme law of the land</p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'What We Believe', href: '/what-we-believe' }, { label: 'Ignore Roe' }]} />

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none space-y-6">
            <h2 className="text-3xl md:text-4xl mb-2">
              <span className="font-light">Defy</span>{' '}
              <span className="font-black">TYRANTS</span>
            </h2>
            <p className="text-sm tracking-[0.2em] uppercase font-semibold text-gray-800 mt-0 mb-2">Through Nullification and Interposition</p>
            <div className="w-12 h-[3px] bg-red-600 mb-8" />

            <p>
              As abolitionists, we believe that no government possesses the rightful authority to legalize child sacrifice. The moment Supreme Court Justice Harry Blackmun delivered the majority decision in Roe v Wade, the decision was legally null and void and should&apos;ve been treated as such. By complying with the Supreme Court&apos;s order to allow mass murder for 46 years, the states have made themselves complicit in the shedding of innocent blood.
            </p>

            <p>
              Nullification relates to a dispute of authority: Who is legally authorized to do what, and what is the standard in legal conflict? Through decades of propaganda, many have come to believe that the Supreme Court is the standard in any legal conflict &ndash; that its authority is ultimate and unassailable.
            </p>

            <p>
              This view was most precisely articulated by Texas Alliance for Life Executive Director Joe Pojman who told the Austin Chronicle in April, 2019 that &ldquo;We could no sooner defy SCOTUS than we could defy the force of gravity.&rdquo; The problem with Pojman&apos;s statement is much bigger than politics. In equating obedience to the Supreme Court with a law of nature, Pojman is telling us who his god is. His allegiance to the true and living God is reduced to a temporary alliance whenever God&apos;s word happens to match the Supreme Court&apos;s opinion.
            </p>

            <p>
              Another example is Scott Klusendorf&apos;s assertion at a Christian conference that we can&apos;t abolish abortion because &ldquo;the federal courts have already decided in Roe vs. Wade, the Casey decision, and others, that no unborn children have the right to life. They&apos;ve already dictated that from on high.&rdquo; Klusendorf&apos;s claim isn&apos;t as blatantly idolatrous as Pojman&apos;s but is along the same lines.
            </p>

            <p>
              This idolatry is rampant among pro-life leadership. It&apos;s why not one prominent pro-life organization has supported the efforts to abolish abortion in places like Oklahoma, Idaho, and Texas. They think returning every few years to grovel for the Supreme Court&apos;s permission to do what&apos;s right is the appropriate way to fight the arbitrary federal legalization of murder. All the while, God&apos;s word, not to mention the US Constitution, not only provide us the right to ignore Roe but command us to.
            </p>

            <p>
              The Bible tells us to &ldquo;rescue those being led to slaughter&rdquo; (<a href="https://biblia.com/bible/esv/proverbs/24/10" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">Prv 24:10</a>), &ldquo;bring justice to the fatherless&rdquo; (<a href="https://biblia.com/bible/esv/isaiah/1/15" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">Is 1:15</a>), and love our neighbors as ourselves (<a href="https://biblia.com/bible/esv/matthew/22/39" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">Matt 22:39</a>). You can do these things or you can submit to Supreme Court opinions stating that murdering certain humans should be legal, but you cannot do both.
            </p>

            <p>
              The 1973 Supreme Court knew just as well as today&apos;s abortion supporters of the scientific consensus that life begins at fertilization. Some admit the truth while others, like Roe author Justice Harry Blackmun, feign ignorance; but they all know of the preborn&apos;s humanity. Accordingly, the 14th amendment&apos;s equal protection clause provides the little human in the womb the same legal protections against murder as anyone else. State and federal governments have simply refused to enforce those protections because the Supreme Court opined that they shouldn&apos;t. Article VI of the Constitution specifies that <a href="https://tenthamendmentcenter.com/the-supremacy-clause/" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">only the Constitution and the laws made pursuant to it are legitimate laws</a>. Roe is neither a law nor in any way pursuant to the Constitution. As former dean of Stanford Law John Hart Ely put it, &ldquo;[Roe v Wade] is not constitutional law and gives almost no sense of an obligation to try to be.&rdquo; What Ely is saying is that in Roe, Blackmun hardly tried to make his decision appear legitimate. The decision amounts to nothing more than simple tyranny; a transparent power grab by a branch of government determined to become the engine of societal upheaval.
            </p>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>
                &ldquo;You seem to consider the judges as the ultimate arbiters of all constitutional questions; a very dangerous doctrine indeed, and one which would place us under the despotism of an oligarchy. Our judges are as honest as other men, and not more so. They have, with others, the same passions for party, for power, and the privilege of their corps&hellip;. Their power [is] the more dangerous as they are in office for life, and not responsible, as the other functionaries are, to the elective control. The Constitution has erected no such single tribunal, knowing that to whatever hands confided, with the corruptions of time and party, its members would become despots. It has more wisely made all the departments co-equal and co-sovereign within themselves.&rdquo;
              </p>
              <cite className="text-gray-600 not-italic">&mdash; Thomas Jefferson, letter to Charles Jarvis, 1820 (Emphasis ours.)</cite>
            </blockquote>

            <p>
              Jefferson also endorsed the constitutionality of nullification explicitly in the Kentucky Resolution, in which Jefferson wrote that &ldquo;Every state has a natural right to nullify,&rdquo; and that &ldquo;nullification&hellip; is the rightful remedy&rdquo; to Constitutional infractions committed by the Federal Government.
            </p>

            <p>
              No reasonable honest, clear-thinking person believes the Constitution contains the &ldquo;right&rdquo; to an abortion. Honest leftists will admit this. In addition to Ely, leftist and Harvard Law professor Laurence Tribe wrote of Roe v Wade, &ldquo;Behind its own verbal smokescreen, the substantive judgement on which it rests is nowhere to be found.&rdquo; Edward Lazarus, a former clerk of Roe author Harry Blackmun who &ldquo;loved Blackmun like a grandfather,&rdquo; said &ldquo;as a matter of constitutional interpretation, even most liberal jurisprudes &mdash; if you administer truth serum &mdash; will tell you [Roe] is basically indefensible.&rdquo; The fact that the &ldquo;right&rdquo; to abortion is entirely an invention of the 1973 Supreme Court is not disputed by serious individuals.
            </p>

            <p>
              It clearly doesn&apos;t, but if the Constitution did protect the &ldquo;right&rdquo; to murder children in the womb, it too should be disregarded, for there&apos;s a higher law which forbids the intentional killing of innocent human beings. Slavery Abolitionist William Lloyd Garrison was right to burn a copy of the US Constitution during a July 4th, 1854 speech to the Massachusetts Anti-Slavery Society because of the pre-13th and 14th amendment compromises which allowed for slavery.
            </p>

            <p>
              A legal document which allows for the complete dehumanization and brutalization of image bearers of God is, as Garrison called it, &ldquo;a covenant with death and agreement with hell.&rdquo; In our case, there is nothing in the Constitution which allows for abortion, a fact which honest abortion supporters will admit. Again, if there were, it would be a covenant with death and an agreement with hell, but it does not. For this reason, the Constitution should be included in the case against abortion while not necessarily being the foundation of it.
            </p>

            <p>
              Other pro-lifers have separate reasons for unconditionally submitting to the Supreme Court. Abby Johnson values federal programs more than she does abolishing abortion: &ldquo;Do you know what happens if a state decides to &lsquo;defy&rsquo; the federal government [to abolish abortion]? No money to education. No more Medicaid for children or medically fragile children. Many hospitals would close. No military or disaster relief. Many, many people would be out of work. How is that a pro-life response?&rdquo;
            </p>

            <p>
              Beyond the economic illiteracy, Johnson is indicted by her words, as she exposes her horrific lack of appropriate priorities which lead her to value federal programs more than she values abolishing abortion. Again, fear is the driving force here. Fear of what the Supreme Court, which actually has no enforcement power, will do to a state which defies it, rather than fear of what God will do to a state and nation that defies Him.
            </p>

            <div className="bg-gray-100 p-6 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-4">Nullification and Interposition</h3>
              <p>
                With Roe being morally execrable and legally null, state governors, legislators, and judges are morally and legally obligated to interpose &ndash; to put themselves between the tyrant and the victims who are being deprived of their God-given right to life.
              </p>
              <p className="mt-4">
                State governments in Wisconsin, New Jersey, Vermont, New York, and Massachusetts interposed on behalf of the victims of slavery by <a href="https://freethestates.org/2019/03/are-nullifications-advocates-the-villains-of-american-history/" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:no-underline">nullifying the federal Fugitive Slave Act of 1850</a> and the federal courts which demanded its enforcement. We are asking state governments to do the same today.
              </p>
            </div>

            <p>
              For the leaders and many rank-and-file of the pro-life movement, the law of the King of Kings as well as the nation&apos;s founding document, which agree that murder must be outlawed, are to be made null by the arbitrary whims of a few black-robed oligarchs whose power is unassailable and ultimate.
            </p>

            <p>
              We need to repent of this idolatry. The only appropriate response to an order to allow mass murder is non-compliance and resistance &ndash; in this case, ignoring Roe and abolishing abortion. This requires less concern over what men will do if we outlaw murder and more concern about what God will do if we don&apos;t.
            </p>

            <div className="my-10">
              <Link
                href="/what-we-believe/criminalization"
                className="inline-block px-8 py-4 bg-red-600 text-white font-bold text-sm tracking-wide hover:bg-red-700 transition-colors no-underline"
              >
                Read More &#10148; WE SEEK TO ESTABLISH JUSTICE
              </Link>
            </div>

            <p className="text-sm text-gray-500 italic">
              This content was originally published by <a href="https://freethestates.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Free the States</a>, and is used by permission. Garden State Abolitionists is not formally affiliated with <a href="https://freethestates.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Free the States</a>, but shares its abolitionist mission and principles.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/what-we-believe/no-exceptions" className="text-red-700 font-semibold underline hover:no-underline">
              &larr; No Exceptions
            </Link>
            <Link href="/what-we-believe/criminalization" className="text-red-700 font-semibold underline hover:no-underline">
              Criminalization &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
