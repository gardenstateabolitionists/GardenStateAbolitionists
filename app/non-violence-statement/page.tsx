import { Metadata } from 'next';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'Non-Violence Statement',
  description: 'Garden State Abolitionists is committed to peaceful, lawful activism. We condemn violence against any person and pursue legislative and Gospel-driven change.',
  alternates: { canonical: '/non-violence-statement' },
};

export default function NonViolenceStatementPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Non-Violence</span>{' '}
            <span className="font-black">STATEMENT</span>
          </h1>
          <div className="w-12 h-[3px] bg-green-700 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">Our commitment to peaceful activism</p>
        </div>
      </section>

      {/* Statement Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-6">Our Position on Violence</h2>

            <p className="text-gray-700 mb-6">
              <span className="text-green-700 font-bold">Garden State Abolitionists unequivocally condemns all violence against any person, including those who perform or procure abortions.</span>
            </p>

            <p className="text-gray-700 mb-6">
              We believe that human life is sacred from fertilization to natural death. This conviction applies to all human beings—including abortionists, abortion clinic workers, and all others involved in the abortion industry. They, too, bear the image of God and are loved by Him.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">We Affirm:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>
                <strong>Violence is wrong.</strong> We oppose the use of violence, threats of violence, intimidation, or any illegal activity in pursuit of our goals.
              </li>
              <li>
                <strong>Violence is counterproductive.</strong> Acts of violence harm our cause and bring disrepute to the name of Christ.
              </li>
              <li>
                <strong>We follow Christ&apos;s example.</strong> Jesus taught us to love our enemies and pray for those who persecute us (Matthew 5:44).
              </li>
              <li>
                <strong>We trust in God&apos;s means.</strong> We believe in the power of prayer, the preaching of the Gospel, and peaceful, lawful advocacy to change hearts and laws.
              </li>
              <li>
                <strong>We seek conversion, not destruction.</strong> Our goal is to see abortionists and their supporters come to repentance and faith in Christ.
              </li>
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-4">We Reject:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Any use of physical force against persons or property</li>
              <li>Threats, harassment, or intimidation</li>
              <li>Any illegal activity in pursuit of abolition</li>
              <li>Any rhetoric that could incite violence</li>
              <li>Association with individuals or groups that advocate or practice violence</li>
            </ul>

            <div className="bg-gray-100 p-6 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-4">Our Methods</h3>
              <p className="text-gray-700 mb-4">
                We pursue the abolition of abortion through exclusively peaceful and legal means:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Prayer for the end of abortion and the conversion of those involved</li>
                <li>Preaching the Gospel of forgiveness through Jesus Christ</li>
                <li>Educating the public about the humanity of the preborn</li>
                <li>Equipping churches to speak out for the voiceless</li>
                <li>Advocating for abolition bills through the legislative process</li>
                <li>Peaceful, lawful public witness and demonstration</li>
                <li>Sidewalk counseling and offering help to abortion-minded women</li>
              </ul>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">A Word to Those Considering Violence</h3>
            <p className="text-gray-700 mb-6">
              If you are considering any act of violence in the name of opposing abortion, we urge you in the strongest possible terms: <span className="text-green-700 font-bold">Do not do it.</span>
            </p>
            <p className="text-gray-700 mb-6">
              Violence against persons is murder. It is sin against God. It will not save a single child. It will only bring harm to yourself, to others, and to the cause of abolition.
            </p>
            <p className="text-gray-700 mb-6">
              Instead, we call you to trust in God, to use the means He has appointed, and to leave vengeance to Him (Romans 12:19).
            </p>

            <div className="bg-green-50 border-l-4 border-green-700 p-6 my-8">
              <p className="text-lg font-semibold text-[#1a1a1a]">
                &ldquo;Beloved, never avenge yourselves, but leave it to the wrath of God, for it is written, &apos;Vengeance is mine, I will repay, says the Lord.&apos;&rdquo;
              </p>
              <p className="text-gray-600 mt-2">— Romans 12:19</p>
            </div>

            <p className="text-gray-700">
              We are committed to pursuing justice for the preborn through means that honor God and respect the dignity of all human beings. We invite you to join us in this commitment.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </>
  );
}
