import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';
import { orgInfo } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Who We Are',
  description: 'Meet the Christian abolitionists of Garden State Abolitionists — our mission, statement of faith, and commitment to ending abortion in the state completely.',
  alternates: { canonical: '/who-we-are' },
};

export default function WhoWeArePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Who We</span>{' '}
            <span className="font-black">ARE</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">Christians working to abolish abortion in New Jersey</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Our Identity</h2>
          <p className="text-gray-700 mb-6 text-lg">
            Garden State Abolitionists is a coalition of Christians who believe that abortion is murder and must be abolished immediately—not regulated, not reduced, but completely ended.
          </p>
          <p className="text-gray-700 mb-6">
            We are not a political organization, though we engage in political action. We are not primarily activists, though we take action. We are first and foremost followers of Jesus Christ who believe that loving our neighbors means defending the most vulnerable among us—the preborn.
          </p>
          <p className="text-gray-700 mb-8">
            We work alongside churches, pastors, and Christians throughout the state of New Jersey to call for the immediate abolition of abortion through bills of abolition that would treat abortion as the crime that it is.
          </p>

          <h2 className="text-3xl font-bold mb-6">Our Approach</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-red-600">Gospel-Centered</h3>
              <p className="text-gray-700">
                We believe that true change comes through the transformation of hearts by the Gospel of Jesus Christ. While we work for legal abolition, we also share the good news that there is forgiveness for all sins—including abortion—through faith in Christ.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-red-600">Church-Focused</h3>
              <p className="text-gray-700">
                We believe the Church must lead the way in calling for justice. We work to equip churches and pastors with resources and encouragement to speak out boldly for the preborn.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-red-600">Abolition, Not Regulation</h3>
              <p className="text-gray-700">
                We do not support incremental measures that regulate abortion while leaving it legal. We call for the immediate and total abolition of abortion as murder, with no exceptions.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-red-600">Peaceful & Lawful</h3>
              <p className="text-gray-700">
                We are committed to peaceful, legal means of advocacy. We condemn all violence and seek to change hearts and laws through persuasion, education, and the political process.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">What Makes Us Different</h2>
          <p className="text-gray-700 mb-4">
            Unlike traditional pro-life organizations that have spent fifty years trying to regulate abortion, we call for its immediate abolition. We believe that:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
            <li>Abortion is murder and should be treated as such under the law</li>
            <li>There should be no exceptions—not for rape, incest, or any other circumstance</li>
            <li>Incremental bills that permit some abortions are unjust and should be opposed</li>
            <li>States have the authority and obligation to protect all human life regardless of federal rulings</li>
            <li>The Church must be the conscience of the nation and call for equal justice for all</li>
          </ul>

          <h2 className="text-3xl font-bold mb-6">Join Us</h2>
          <p className="text-gray-700 mb-4">
            If you share our conviction that abortion must be abolished, we invite you to join us. There are many ways to get involved:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Sign the petition calling for abolition</li>
            <li>Contact your representatives and demand they support bills of abolition</li>
            <li>Share our resources with your church and community</li>
            <li>Donate to support our work</li>
            <li>Pray for the abolition of abortion in New Jersey and across America</li>
          </ul>

          {/* Nonprofit disclosure card — required for Google Ad Grants;
              the About page must state the org's nonprofit status + EIN. */}
          <div className="mt-12 border-l-4 border-red-600 bg-gray-50 p-6 rounded-r">
            <p className="text-gray-800 font-semibold mb-2">
              {orgInfo.taxStatus
                ? `${orgInfo.legalName} is a New Jersey ${orgInfo.taxStatus}.`
                : `${orgInfo.legalName} is an abolitionist organization based in New Jersey.`}
            </p>
            {orgInfo.ein ? (
              <p className="text-gray-700">
                Federal Tax ID (EIN): <span className="font-mono">{orgInfo.ein}</span>.{' '}
                {/* An EIN alone does not imply charitable status — the IRS
                    issues one to any entity — so deductibility still requires
                    confirmed tax status. */}
                {orgInfo.taxStatus
                  ? 'Contributions are tax-deductible to the fullest extent allowed by law. '
                  : ''}
                <Link
                  href="/financial-transparency"
                  className="text-red-700 underline hover:no-underline"
                >
                  See our financial transparency page
                </Link>
                .
              </p>
            ) : (
              <p className="text-gray-700">
                {/* Tax-deductibility is asserted only when tax status is
                    confirmed — without it this sentence would make a legal
                    claim the organization cannot yet support. */}
                {orgInfo.taxStatus
                  ? 'Contributions are tax-deductible to the fullest extent allowed by law. '
                  : ''}
                See our{' '}
                <Link
                  href="/financial-transparency"
                  className="text-red-700 underline hover:no-underline"
                >
                  financial transparency page
                </Link>{' '}
                for our EIN and disclosures.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </>
  );
}
