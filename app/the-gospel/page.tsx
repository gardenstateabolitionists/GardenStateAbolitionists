import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'The Gospel',
  description: 'The Gospel of Jesus Christ — the good news that offers forgiveness for every sin, including abortion, and the power to end the practice entirely.',
  alternates: { canonical: '/the-gospel' },
};

export default function TheGospelPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">The</span>{' '}
            <span className="font-black">GOSPEL</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">The good news of Jesus Christ</p>
        </div>
      </section>

      {/* The Good News */}
      <section id="good-news" className="bg-gray-100 py-16 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">The Good News</h2>

          <div className="space-y-6 text-gray-700 text-lg">
            <p>
              At the heart of our mission is not just a political cause, but the Gospel of Jesus Christ. We believe that true and lasting change comes only through the transformation of hearts by God&apos;s grace.
            </p>

            <div className="bg-red-50 border-l-4 border-red-600 p-6 my-8">
              <p className="text-xl font-semibold text-[#1a1a1a]">
                &ldquo;For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.&rdquo;
              </p>
              <p className="text-gray-600 mt-2">— John 3:16</p>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">The Problem: Sin</h3>
            <p>
              The Bible teaches that all people have sinned and fallen short of God&apos;s glory (Romans 3:23). Sin is not just doing bad things—it is rebellion against God, our Creator. We have all broken God&apos;s law, and the penalty for sin is death and eternal separation from God (Romans 6:23).
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4">The Solution: Jesus Christ</h3>
            <p>
              God, in His great love, sent His Son Jesus Christ to save us. Jesus lived a perfect, sinless life. He died on the cross, taking the punishment that we deserved. On the third day, He rose from the dead, defeating sin and death forever.
            </p>
            <p>
              Through His death and resurrection, Jesus made a way for us to be forgiven and reconciled to God. This is the good news—the Gospel.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4">The Response: Faith and Repentance</h3>
            <p>
              God calls us to respond to the Gospel with repentance and faith. Repentance means turning away from sin and turning to God. Faith means trusting in Jesus Christ alone for salvation—not our own good works or efforts.
            </p>

            <div className="bg-white p-6 rounded-lg my-8 shadow-sm">
              <p className="text-xl font-semibold text-[#1a1a1a]">
                &ldquo;If you confess with your mouth that Jesus is Lord and believe in your heart that God raised him from the dead, you will be saved.&rdquo;
              </p>
              <p className="text-gray-600 mt-2">— Romans 10:9</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to be Saved */}
      <section id="salvation" className="bg-white py-16 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">How to be Saved</h2>

          <div className="space-y-6 text-gray-700 text-lg">
            <p>
              Salvation is a gift from God, received through faith in Jesus Christ. Here is what the Bible says about how to be saved:
            </p>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-red-600 mb-2">1. Acknowledge Your Sin</h3>
                <p>
                  Recognize that you have sinned against God and cannot save yourself. &ldquo;For all have sinned and fall short of the glory of God&rdquo; (Romans 3:23).
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-red-600 mb-2">2. Believe in Jesus Christ</h3>
                <p>
                  Trust that Jesus died for your sins and rose again. &ldquo;Believe in the Lord Jesus, and you will be saved&rdquo; (Acts 16:31).
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-red-600 mb-2">3. Repent of Your Sins</h3>
                <p>
                  Turn away from sin and turn to God. &ldquo;Repent therefore, and turn back, that your sins may be blotted out&rdquo; (Acts 3:19).
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-red-600 mb-2">4. Confess Jesus as Lord</h3>
                <p>
                  Publicly acknowledge Jesus as your Lord and Savior. &ldquo;If you confess with your mouth that Jesus is Lord and believe in your heart that God raised him from the dead, you will be saved&rdquo; (Romans 10:9).
                </p>
              </div>
            </div>

            <div className="bg-[#1a1a1a] text-white p-8 rounded-lg mt-8">
              <h3 className="text-2xl font-bold mb-4">A Word to Those Who Have Had Abortions</h3>
              <p className="mb-4">
                If you have been involved in abortion—whether as the mother, father, doctor, or in any other capacity—know this: <span className="text-red-500 font-semibold">there is forgiveness in Jesus Christ.</span>
              </p>
              <p className="mb-4">
                The same Gospel that calls abortion murder also offers complete forgiveness for all who repent and believe. No sin is too great for God&apos;s grace. Through faith in Christ, you can be washed clean and made new.
              </p>
              <p>
                &ldquo;If we confess our sins, he is faithful and just to forgive us our sins and to cleanse us from all unrighteousness&rdquo; (1 John 1:9).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Next Steps</h2>
          <p className="text-gray-700 text-lg mb-8">
            If you have questions about the Gospel or have made a decision to follow Christ, we would love to hear from you and help you find a Bible-believing church.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition-colors"
          >
            CONTACT US
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </>
  );
}
