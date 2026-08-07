import { Metadata } from 'next';
import CTABanner from '@/components/CTABanner';
import PetitionForm from '@/components/PetitionForm';
import ShareButtons from '@/components/ShareButtons';
import SignatureCount from '@/components/SignatureCount';

export const metadata: Metadata = {
  title: 'The Petition',
  description: 'Add your name to the petition calling on the New Jersey Legislature to abolish abortion completely — no exceptions, no compromise, no delay.',
  alternates: { canonical: '/the-petition' },
};

export default function ThePetitionPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">The</span>{' '}
            <span className="font-black">PETITION</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">Call for the abolition of abortion in New Jersey</p>
          <SignatureCount />
        </div>
      </section>

      {/* Petition Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gray-50 p-8 rounded-lg mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Petition to the New Jersey Legislature</h2>

            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                <strong>WHEREAS,</strong> all human beings are created in the image of God and possess inherent dignity and worth from the moment of fertilization;
              </p>
              <p className="mb-4">
                <strong>WHEREAS,</strong> the intentional killing of an innocent human being is murder, regardless of age, location, or stage of development;
              </p>
              <p className="mb-4">
                <strong>WHEREAS,</strong> abortion is the intentional killing of an innocent preborn human being and is therefore murder;
              </p>
              <p className="mb-4">
                <strong>WHEREAS,</strong> the State of New Jersey has a duty to protect all human life within its borders and to provide equal protection under the law for all persons;
              </p>
              <p className="mb-4">
                <strong>WHEREAS,</strong> no court opinion, federal law, or state constitutional amendment can make murder legal or just;
              </p>
              <p className="mb-6">
                <strong>THEREFORE,</strong> we the undersigned call upon the New Jersey Legislature to immediately pass a bill of abolition that:
              </p>
              <ol className="list-decimal pl-6 space-y-2 mb-6">
                <li>Defines abortion as the intentional killing of a preborn human being</li>
                <li>Criminalizes abortion as murder, with appropriate penalties</li>
                <li>Provides equal protection under the law for all human beings from the moment of fertilization</li>
                <li>Contains no exceptions for rape, incest, or any other circumstance</li>
                <li>Declares null and void any federal law, regulation, or court opinion that purports to permit abortion</li>
              </ol>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="mb-8">
            <ShareButtons url="https://www.gardenstateabolitionists.org/the-petition" />
          </div>

          {/* Petition Form */}
          <PetitionForm />

          {/* Why Sign */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Why Sign?</h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-700 mr-3 mt-1" aria-hidden="true">&#10003;</span>
                <span>Show your elected officials that the people of New Jersey demand equal protection for the preborn</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-700 mr-3 mt-1" aria-hidden="true">&#10003;</span>
                <span>Join a growing movement calling for immediate abolition, not more regulation</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-700 mr-3 mt-1" aria-hidden="true">&#10003;</span>
                <span>Take a public stand for the right to life of every human being</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-700 mr-3 mt-1" aria-hidden="true">&#10003;</span>
                <span>Receive updates on abolition efforts in New Jersey</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner
        title="SEEK JUSTICE"
        subtitle="Speak up for those who cannot speak for themselves"
        buttonText="SIGN"
        buttonLink="/the-petition#sign"
      />
    </>
  );
}
