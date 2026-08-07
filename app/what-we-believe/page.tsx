import { Metadata } from 'next';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'What We Believe',
  description: 'Where Garden State Abolitionists stands on abortion, abolition, and the image of God from fertilization — with no exceptions and no compromise.',
  alternates: { canonical: '/what-we-believe' },
};

export default function WhatWeBelievePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">What We</span>{' '}
            <span className="font-black">BELIEVE</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">Our convictions about God, life, and justice</p>
        </div>
      </section>

      {/* Statement of Faith */}
      <section id="statement-of-faith" className="bg-gray-100 py-16 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Statement of Faith</h2>

          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-xl font-bold mb-2">The Bible</h3>
              <p>
                We believe the Bible is the inspired, inerrant, and authoritative Word of God. It is the final authority in all matters of faith and practice.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">God</h3>
              <p>
                We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit. God is the Creator, Sustainer, and Ruler of all things.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">Jesus Christ</h3>
              <p>
                We believe in the deity of Jesus Christ, His virgin birth, His sinless life, His miracles, His atoning death, His bodily resurrection, His ascension to the right hand of the Father, and His personal return in power and glory.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">Salvation</h3>
              <p>
                We believe salvation is by grace alone, through faith alone, in Christ alone. It is a gift from God, not a result of human works.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">The Church</h3>
              <p>
                We believe the Church is the body of Christ, called to worship God, make disciples, and be salt and light in the world, including speaking up for those who cannot speak for themselves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* On Abortion */}
      <section id="on-abortion" className="bg-white py-16 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">On Abortion</h2>

          <div className="space-y-4 text-gray-700">
            <p>
              <span className="text-red-700 font-semibold">We believe abortion is the intentional killing of an innocent human being</span> and is therefore murder, a grave sin against God and humanity.
            </p>
            <p>
              We believe human life begins at fertilization, when a new human being with unique DNA comes into existence. From that moment, every human being bears the image of God and has inherent dignity and worth.
            </p>
            <p>
              We believe there are no circumstances that justify the intentional killing of an innocent human being. This includes cases of rape, incest, disability, or any other circumstance.
            </p>
            <p>
              We believe those who have participated in abortion—whether as the mother, father, doctor, or in any other capacity—can find forgiveness through repentance and faith in Jesus Christ.
            </p>
          </div>
        </div>
      </section>

      {/* On Abolition */}
      <section id="on-abolition" className="bg-gray-100 py-16 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">On Abolition</h2>

          <div className="space-y-4 text-gray-700">
            <p>
              <span className="text-red-700 font-semibold">We believe abortion must be abolished immediately and totally</span>, not merely regulated or reduced.
            </p>
            <p>
              We oppose incremental legislation that permits some abortions to continue. Such legislation treats some children as less worthy of protection than others and perpetuates the lie that some abortions are acceptable.
            </p>
            <p>
              We believe states have the authority and obligation to protect all human life within their borders, regardless of federal rulings to the contrary. When federal law conflicts with the law of God, states must obey God rather than men.
            </p>
            <p>
              We call for bills of abolition that would:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Define abortion as the intentional killing of a preborn human being</li>
              <li>Criminalize abortion as murder, with no exceptions</li>
              <li>Provide equal protection under the law for all human beings from fertilization</li>
              <li>Nullify any federal law, regulation, or court opinion that permits abortion</li>
            </ul>
            <p className="mt-4">
              We are committed to peaceful, legal means of achieving abolition. We condemn all violence and work to change hearts and laws through persuasion, education, and political action.
            </p>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-[#1a1a1a] py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <blockquote className="text-xl md:text-2xl font-serif italic text-white mb-4">
            &ldquo;Learn to do good; seek justice, correct oppression; bring justice to the fatherless, plead the widow&apos;s cause.&rdquo;
          </blockquote>
          <cite className="text-gray-400">— Isaiah 1:17</cite>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </>
  );
}
