import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Immediate, Not Gradual',
  description: 'Why abolition must be immediate, not gradual. Incremental pro-life bills concede that some preborn children can be legally killed — abolition never does.',
  alternates: { canonical: '/what-we-believe/immediate-not-gradual' },
};

export default function ImmediateNotGradualPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Immediate,</span>{' '}
            <span className="font-black">NOT GRADUAL</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">Abortion Cannot Be Abolished by Allowing it All Along the Way</p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'What We Believe', href: '/what-we-believe' }, { label: 'Immediate, Not Gradual' }]} />

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none space-y-6">
            <h2 className="text-3xl md:text-4xl mb-2">
              <span className="font-light">We Are</span>{' '}
              <span className="font-black">IMMEDIATISTS</span>
            </h2>
            <p className="text-sm tracking-[0.2em] uppercase font-semibold text-gray-800 mt-0 mb-2">The Time for Justice is Always Now</p>
            <div className="w-12 h-[3px] bg-red-600 mb-8" />

            <p>
              Beneath the differences in legislative strategies pursued by abolitionists and pro-lifers is a difference in our ultimate allegiances. Abolitionists submit to God as our Ultimate authority while pro-lifers submitted to the Supreme Court as their Ultimate authority for 50 years. Thus the abolitionist response to a court opining that child sacrifice should be legal is defiance. The pro-life response to a court opining that child sacrifice should be legal was and is submission.
            </p>

            <p>
              Even today, as Roe vs Wade has been overturned, submission is still the mantra, as the pro-life response to culture itself has been submission. They will submit to polling, political winds, or pragmatic gamesmanship before Christ. God forbid, if something like Roe was to ever be reinstituted, or even codified into law, we have no reason to believe that the pro-life movement would not once again submit to tyranny. In fact, their track record suggests that they would submit.
            </p>

            <p>
              This submission is unconditional, as explained by Joe Pojman of Texas Alliance for Life who told the Austin Chronicle in April that he opposed abolishing abortion in Texas because &ldquo;We could no sooner defy SCOTUS than we could defy the force of gravity.&rdquo; Scott Klusendorf, who is widely regarded as the leading intellectual of the pro-life movement, put it similarly: &ldquo;The federal court have already decided in Roe vs Wade, the Casey decision, and others, that no unborn children have a right to life. The courts have already dictated that from on high.&rdquo; The pro-life movement&apos;s strategy is founded upon the assumption that there is no earthly power higher than the supreme court on high. Abolitionists cry &ldquo;No King but Jesus!&rdquo;
            </p>

            <p>
              While the foundation of abolitionism is God&apos;s word, we also have the Constitution on our side. The federal government, the states, and all other subdivisions thereof are Constitutionally barred from providing unequal protection of the law. They cannot allow the murder of certain classes of human beings meaning Roe was sedition against the Constitution. In addition to our dire moral obligations to defy the supreme court, the only legally appropriate response to courts who ignore the Constitution is to ignore the courts. This also includes many state courts, who strike down bills of abolition even today.
            </p>

            <p>
              Because of their morally and legally erroneous Ultimate authority, pro-lifers seek to regulate abortion incrementally more and more over time rather than abolish it because they believe regulating abortion is all they were allowed to do under Roe. The result of this is the pro-life movement being a movement of iniquitous decrees, which are forbidden in Isaiah 10. A law which bans abortion at 20 weeks may sound good at first, but such a bill explicitly codifies into the law the acceptability of murdering babies younger than 20 weeks. There can be no serious debate &ndash; this is an iniquitous decree.
            </p>

            <p>
              The argument in favor of such a law is that it&apos;s less iniquitous than the status quo. But there are no exceptions in God&apos;s word which allow us to write iniquity into law so long as it&apos;s less iniquitous than something else. Iniquity is iniquity, and there&apos;s no question that incremental bills are iniquitous. To support iniquity because of its relative degree of iniquity compared to something else is moral relativism, an unGodly ethical system to put it lightly. As Wayne Groover says, &ldquo;If you have to disobey God in order to obey God, you&apos;re doing it wrong.&rdquo;
            </p>

            <p>
              Some pro-lifers claim to support both regulation and abolition, but immediatism and incrementalism cannot be embraced simultaneously. They are diametrically opposed to one another, with incrementalism fatally undermining attempts at immediate abolition. This principle was perhaps best articulated by slavery Abolitionist Elizabeth Heyrick:
            </p>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>
                The enemies of slavery have hitherto ruined [the abolitionist] cause by the senseless cry of gradual emancipation. It is marvelous that the wise and the good should have suffered themselves to have been imposed upon by this wily artifice of the slave holder, for with him must the project of gradual emancipation have first originated.
              </p>
              <p>
                The slave holder knew very well that his prey would be secure, so long as the abolitionists could be cajoled into a demand for gradual instead of immediate abolition. He knew very well, that the contemplation of a gradual emancipation, would beget a gradual indifference to emancipation itself. He knew very well, that even the wise and the good, may, by habit and familiarity, be brought to endure and tolerate almost any thing&hellip;
              </p>
              <p>
                He knew very well, that the faithful delineation of the horrors of West Indian slavery, would produce such a general insurrection of sympathetic and indignant feeling; such abhorrence of the oppressor, such compassion for the oppressed, as must soon have been fatal to the whole system&hellip; Our example might have spread from kingdom to kingdom, from continent to continent, and the slave trade, and slavery, might by this time, have been abolished all the world over: &lsquo;A sacrifice of a sweet savour,&rsquo; might have ascended to the Great Parent of the Universe, &lsquo;His kingdom might have come, and his will (thus far) have been done on earth, as it is in Heaven.&rsquo;
              </p>
              <p>
                But this GRADUAL ABOLITION, has been the grand marplot of human virtue and happiness; the very masterpiece of satanic policy. By converting the cry for immediate, into gradual emancipation, the prince of slave holders, &lsquo;transformed himself, with astonishing dexterity, into an angel of light,&rsquo; and thereby &lsquo;deceived the very elect.&rsquo; He saw very clearly, that if public justice and humanity, especially, if Christian justice and humanity, could be brought to demand only a gradual extermination of the enormities of the slave system; if they could be brought to acquiesce, but for one year, or for one month, in the slavery of our African brother, in robbing him of all the rights of humanity, and degrading him to a level with the brutes; that then, they could imperceptibly be brought to acquiesce in all this for an unlimited duration&hellip;.
              </p>
              <p>
                The father of lies&hellip; deceived, not the unwary only, the unsuspecting multitude, but the wise and the good, by the plausibility, the apparent force, the justice, and above all, by the humanity of the arguments propounded for gradual emancipation. He is the subtlest of all reasoners, the most ingenious of all sophists, the most eloquent of all declaimers. He, above all other advocates, &lsquo;can make the worst appear the better argument;&rsquo; can, most effectually pervert the judgment and blind the understanding, whilst they seem to be most enlightened and rectified. Thus by a train of most exquisite reasoning, has he brought the abolitionists to the conclusion, that the interest of the poor, degraded and oppressed slave, as well as that of his master, will be best secured by his remaining in slavery.
              </p>
              <cite className="text-gray-600 not-italic">&mdash; Elizabeth Heyrick</cite>
            </blockquote>

            <p>
              It&apos;s hard to read Heyrick&apos;s work without seeing a depiction of the pro-life movement. Millions of Christians have been cajoled into gradually ending abortion which causes a gradual indifference to ending abortion itself. Other than a few blips of outrage when abortion supporters defend infanticide or are caught on tape bartering over human body parts, the Church is largely silent. (Thankfully, that&apos;s changing as more Christians and congregations are embracing their duty to love their preborn neighbors, but there&apos;s still a long way to go.)
            </p>

            <p>
              A faithful, uncompromising delineation of the horrors of abortion by the hundreds of millions of Christians in this country would bring abortion to an end. But if those millions of Christians settle for Right to Life, and Right to Life-allied centrist Republicans passing ultrasound laws and waiting periods which reduce abortion by one or two or five percent and call that winning, there will never be an end to abortion because the church will have been lulled to sleep and the actual demand that abortion be outlawed because it is murder will never have been made.
            </p>

            <p>
              Christians have been told by pro-life leaders that they must tolerate the legal dehumanization and murder of the preborn for another month, another year, another decade&hellip; and this has brought all but a tiny few of them to total complacency. We&apos;ve got to demand it be wholly outlawed. That demand will rally the people of God. That demand will spread the Kingdom and bring an end to abortion the world over. Anything less undermines those objectives by tacitly affirming Roe v Wade, tacitly affirming abortion&apos;s status as health care, compromising God&apos;s commands, not communicating what actually makes abortion wrong, and lulling the church to sleep.
            </p>

            <div className="bg-gray-100 p-6 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-4">The Contrast</h3>
              <p>
                Abolitionists demand abortion&apos;s abolition. Pro-life leaders demand abortion&apos;s incremental regulation. Pro-lifers conceded Roe&apos;s legitimacy. Abolitionists called Roe what it was: illegitimate, wicked, and not binding on the states. Pro-lifers regulate abortion as if it were health care. Abolitionists demand abortion be immediately abolished because it&apos;s murder.
              </p>
            </div>

            <p>
              Click the button below to read about the next distinction between abolitionists and pro-lifers: Abolitionists declare &ldquo;No compromise&rdquo; while pro-lifers often allow for exceptions.
            </p>

            <div className="my-10">
              <Link
                href="/what-we-believe/no-exceptions"
                className="inline-block px-8 py-4 bg-red-600 text-white font-bold text-sm tracking-wide hover:bg-red-700 transition-colors no-underline"
              >
                Read More &#10148; NO EXCEPTIONS FOR ABORTION
              </Link>
            </div>

            <p className="text-sm text-gray-500 italic">
              This content was originally published by <a href="https://freethestates.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Free the States</a>, and is used by permission. Garden State Abolitionists is not formally affiliated with <a href="https://freethestates.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Free the States</a>, but shares its abolitionist mission and principles.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/what-we-believe/biblical-not-secular" className="text-red-600 font-semibold hover:underline">
              &larr; Biblical, Not Secular
            </Link>
            <Link href="/what-we-believe/no-exceptions" className="text-red-600 font-semibold hover:underline">
              No Exceptions &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
