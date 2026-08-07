import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Criminalizing Abortion',
  description: 'Why abolition requires criminalizing abortion as the murder it is. Equal protection means the same legal penalty regardless of the victim’s age or stage.',
  alternates: { canonical: '/what-we-believe/criminalization' },
};

export default function CriminalizationPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Criminalizing</span>{' '}
            <span className="font-black">ABORTION</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">Establishing justice for the preborn requires criminalization</p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'What We Believe', href: '/what-we-believe' }, { label: 'Criminalization' }]} />

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none space-y-6">
            <h2 className="text-3xl md:text-4xl mb-2">
              <span className="font-light">Abortion Is</span>{' '}
              <span className="font-black">MURDER</span>
            </h2>
            <p className="text-sm tracking-[0.2em] uppercase font-semibold text-gray-800 mt-0 mb-2">And it ought to be treated as such</p>
            <div className="w-12 h-[3px] bg-red-600 mb-8" />

            <p>
              If abortion is murder, and we all know that it is, then it ought to be treated as such. Pro-lifers, attempting to put forward legislation more palatable to the public, are committed to a strategy of giving automatic immunity to the parents who have their child murdered in all cases. Rather than making political calculations, abolitionists simply proclaim the truth that abortion is murder and must be abolished without shying away from any of the perceived consequences of that position. We demand justice through equal protection of the law for all image bearers of God. Equal justice and the abolition of abortion are thwarted by the pro-life movement&apos;s refusal to fully criminalize abortion.
            </p>

            <p>
              When the abolitionists of slavery came on the scene, anti-slavery gradualists had long been attempting to end slavery by convincing the slave holders that releasing their slaves was in their own best interest. British abolitionist Elizabeth Heyrick rebuked them thusly:
            </p>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>
                We are told &lsquo;you must go cautiously and gradually to work. A very powerful interest and a very powerful influence are against you. You must try to conciliate instead of provoke the West Indian planters;- to convince them that their own interest is concerned in the better treatment and gradual emancipation of their slaves, or your object will never be accomplished.&rsquo;
              </p>
              <cite className="text-gray-600 not-italic">&mdash; Elizabeth Heyrick</cite>
            </blockquote>

            <p>
              The pro-life movement has long fought against abortion by this strategy, arguing that women have been betrayed by abortion and are victims of it rather than accomplices to it. This was the primary argument pro-life Republican Jeff Leach made to justify his opposition to the Abolition of Abortion in Texas Act. Following the lead of the pro-life movement, Leach wanted to exempt parents from being prosecuted as accomplices in the murder of their aborted children. Leach&apos;s opposition to the abolition bill was <a href="https://christiannews.net/2019/04/11/former-sbc-president-jack-graham-praises-chairman-who-killed-bill-to-outlaw-abortion-as-courageous/" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">endorsed</a> by his pastor and former Southern Baptist Convention President Jack Graham, current SBC President J.D. Greer, Abby Johnson, Brian Fisher of Human Coalition, and other pro-life leaders.
            </p>

            <p>
              This idea that the parents should be immune from penalty is an entrenched pro-life dogma. Every piece of incremental pro-life legislation introduced excludes mothers and fathers from legal penalty. Last April, we were talking to a big-name pro-lifer, trying to convince her of abolitionism and to support the Abolition of Abortion in Texas Act. After much of what seemed like progress and productive conversation, her final determination was, &ldquo;I do not support legislation that criminalizes a woman for having an abortion performed on her, I don&apos;t think that is the way to empower women to choose life.&rdquo;
            </p>

            <p>
              &hellip;an abortion that was performed on her&hellip;
            </p>

            <p>
              As if abortionists were roaming the streets seeking out women to perform abortions on, rather than the reality which is mothers and fathers actively seeking out death centers and contracting with serial killers as they take their children away to death.
            </p>

            <p>
              &hellip;empower women to choose life.
            </p>

            <p>
              As if our highest principle shouldn&apos;t be abolishing abortion and establishing equal protection and justice for all human beings but forwarding a vague political slogan in an attempt to gain popularity with the culture and show that we&apos;re the true feminists.
            </p>

            <p>
              For three reasons, the parental exemption to abortion prosecution is fundamentally unjust and unloving toward unborn children, abortion-minded parents, and the culture as a whole.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">1) Parental Exemptions Create a Right to DIY Abortions</h3>

            <p>
              Providing automatic immunity in all cases to mothers and fathers who have their children murdered literally means that do-it-yourself abortions are legal. In fact, Cari Sietstra, a board member of the National Abortion Federation, published an <a href="https://www.nytimes.com/2019/05/11/opinion/abortion-pregnancy-misoprostol.html" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">article</a> in The New York Times in 2019 calling pro-life and pro-choice people to work together toward a do-it-yourself (DIY) abortion industry that is allowed under pro-life legislation:
            </p>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>
                &ldquo;We can work to fully decriminalize self-induced abortions. This is an area where all Americans, including pro-life Americans, can work together. The pro-life movement has insisted for decades that women should not be prosecuted for self-abortion&hellip; Working together to decriminalize self-managed abortion will curb these risks.&rdquo;
              </p>
              <cite className="text-gray-600 not-italic">&mdash; Cari Sietstra, National Abortion Federation</cite>
            </blockquote>

            <p>
              As Sietstra pointed out, pro-life laws literally create a right to abortion as long as the murder is accomplished without the help of a third party. What she advocates is in accordance with the legal strategy of the pro-life movement. The abortion industry is quickly moving toward DIY abortions meaning that the real accomplishment of pro-life regulations is expediting the evolution of the abortion industry toward earlier, self-induced abortions.
            </p>

            <p>
              That evolution is happening fast. Mail-order abortion pill services and online abortion counseling services have been operating in countries where abortion is illegal for years. Fearing abortion becoming illegal in the United States, some are opening up shop here. Women on Web and Aid Access recently began shipping abortion pills in the United States. An organization called Self-managed Abortion; Safe and Supported (SASS) is training American women how to kill their preborn children on their own.
            </p>

            <p>
              Surveys have found that 2 percent of American mothers who have had abortions have performed self-induced abortions. The same surveys also showing an explosion in Google searches for self-induced abortion since 2015.
            </p>

            <p>
              Hotlines which help mothers skirt the law while self-inducing abortions, like the Self Induced Abortion Legal Team, are already operating here as well. These hotlines, working in tandem with abortion-pill-to-your-door companies, make self-induced abortion easily obtainable to anyone with access to the internet.
            </p>

            <p>
              And it&apos;s not as if we could simply cut off the supply of abortifacient drugs. Many of these drugs, such as misoprostol, have other uses and are not difficult to obtain. As Sietstra explains, &ldquo;We should start seeing [misoprostol] as a prophylactic drug that deserves a place in our medicine cabinets. We should ask our clinicians for prescriptions before we need it.&rdquo;
            </p>

            <p>
              Among many other reasons, pro-life laws should be rejected because they legalize self-induced abortions.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">2) Penalties Are Deterrents</h3>

            <p>
              The penalties for people who steal don&apos;t completely get rid of theft, but they do deter many would-be thieves. One of the few things on which pro-choice and pro-life people agree is that abortion is often a difficult decision. While some commit murder without ever even considering keeping their baby, it&apos;s a close call for most. That call would no longer be a close one if homicide charges were added to one side of the scale. Jason Storms, a pastor and abolitionist, illustrated this from experience at a hearing for the Abolition of Abortion in Texas Act (HB 896) on April 8, 2019.
            </p>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>
                &ldquo;I was guilty as an accomplice in the murder of my own child, and I should have been prosecuted accordingly&hellip; Mothers and fathers &ndash; parents &ndash; right now in Texas can be charged with parental neglect, parental abuse, and even parental homicide when we see the tragedy of parents taking the lives of their own children. It&apos;s because mothers and fathers have a duty to love and protect their children. That responsibility doesn&apos;t start when they&apos;re born, but it starts when they&apos;re conceived.
              </p>
              <p>
                Here&apos;s a fact: my girlfriend and I, if we knew we would&apos;ve been facing homicide charges, would never have aborted that child. That child would be alive today. I&apos;d have a 22-year-old little child that I could celebrate life with right now that&apos;s not here. The law is a deterrent to crime. We shouldn&apos;t think of this only as a matter of putting a woman on the stand. We should think of this as a great deterrent. Men and women would not think of doing this if we stood firm on the law and provided equal protection for these children.&rdquo;
              </p>
              <cite className="text-gray-600 not-italic">&mdash; Jason Storms, testimony at HB 896 hearing, April 8, 2019</cite>
            </blockquote>

            <p>
              Removing immunity for mothers who choose abortion doesn&apos;t mean we&apos;ll charge a million mothers and fathers who made excruciating decisions with murder. It means the vast majority will never murder their children in the first place. Penalties are a deterrent.
            </p>

            <p>
              Of course, there are often difficult circumstances which lead to abortion. We should have compassion for people in those circumstances, which is exactly why we must not leave the murderous, soul-destroying option of self-induced abortion on the table for them. We must make sure the law teaches them the right things and deters murder. Pro-life laws which don&apos;t criminalize abortion provide no reason not to have an abortion.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">3) Roe v. Wade Relied on This Very Inconsistency</h3>

            <p>
              Thinking that it strengthens their case for automatic immunity for mothers and fathers who murder their children, pro-life leaders often highlight the fact that pre-Roe abortion bans provided immunity. This is true, but what they don&apos;t know, or simply don&apos;t want to acknowledge, is that these immunities are a huge part of the court&apos;s decision to force legal abortion on the states in the first place.
            </p>

            <p>
              In Roe, the State of Texas argued that the 14th Amendment&apos;s equal protection clause provided unborn human beings protection against murder, just like the law protected everyone else against murder. However, Texas&apos; pro-life laws gave full immunity to the parents who had their children murdered. Accordingly, Justice Harry Blackmun explained in footnote 54 of the Roe v. Wade decision that these immunities legally undercut the anti-abortion case:
            </p>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>
                There are other inconsistencies between Fourteenth Amendment status and the typical abortion statute. It has already been pointed out that in Texas the woman is not a principal or an accomplice with respect to an abortion upon her. If the fetus is a person, why is the woman not a principal or an accomplice? Further, the penalty for criminal abortion specified by Art. 1195 is significantly less than the maximum penalty for murder prescribed by Art. 1257 of the Texas Penal Code. If the fetus is a person, may the penalties be different?
              </p>
              <cite className="text-gray-600 not-italic">&mdash; Justice Harry Blackmun, Roe v. Wade, Footnote 54</cite>
            </blockquote>

            <p>
              Blackmun is essentially saying, &ldquo;If pro-lifers actually think preborn human beings are the same as all of us, why don&apos;t pro-lifers classify abortion as murder and why do pro-lifers give full immunity to people who have preborn human beings murdered? If pro-lifers don&apos;t treat abortion like murder, why should the court?&rdquo;
            </p>

            <p>
              These historic pro-life laws are not a good standard to try to return to, but an egregious mistake that we must learn from. We must demand the full criminalization of abortion as murder.
            </p>

            <div className="bg-gray-100 p-6 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-4">Equal Protection</h3>
              <p>
                Pro-life laws do nothing to actually criminalize the murder of preborn human beings. All they do is criminalize the act of helping a mother murder her preborn son or daughter. Pro-life laws do nothing to deter abortion and they legally undercut the entire anti-abortion argument. We must demand equal protection for preborn human beings. That means the same level of legal protection for preborn human beings that everyone else gets. That means the criminalization of abortion as murder.
              </p>
            </div>

            <div className="my-10">
              <Link
                href="/abolition-bills/components"
                className="inline-block px-8 py-4 bg-red-600 text-white font-bold text-sm tracking-wide hover:bg-red-700 transition-colors no-underline"
              >
                Read More &#10148; COMPONENTS OF AN ABOLITION BILL
              </Link>
            </div>

            <p className="text-sm text-gray-500 italic">
              This content was originally published by <a href="https://freethestates.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Free the States</a>, and is used by permission. Garden State Abolitionists is not formally affiliated with <a href="https://freethestates.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Free the States</a>, but shares its abolitionist mission and principles.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/what-we-believe/ignore-roe" className="text-red-600 font-semibold hover:underline">
              &larr; Ignore Roe
            </Link>
            <Link href="/what-we-believe" className="text-red-600 font-semibold hover:underline">
              Back to What We Believe &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
