import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Message of Reconciliation',
  description: 'In Christ, God is reconciling the world to himself. We are ambassadors of Christ, imploring you to be reconciled to God.',
  alternates: { canonical: '/the-gospel/message-of-reconciliation' },
};

export default function MessageOfReconciliationPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Message of</span>{' '}
            <span className="font-black">RECONCILIATION</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">In Christ, God is reconciling the world to himself</p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'The Gospel', href: '/the-gospel' }, { label: 'Message of Reconciliation' }]} />

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none space-y-6">
            <h2 className="text-3xl md:text-4xl mb-2">
              <span className="font-light">We Are Ambassadors of</span>{' '}
              <span className="font-black">CHRIST</span>
            </h2>
            <p className="text-sm tracking-[0.2em] uppercase font-semibold text-gray-800 mt-0 mb-2">We implore you on behalf of Christ, be reconciled to God. &mdash; 2 Cor. 5:20</p>
            <div className="w-12 h-[3px] bg-red-600 mb-8" />

            <p>
              Abolitionists aim to transform this wicked culture and society, by the grace of God, with the Gospel of Jesus the Messiah and His holy law. To all those who repent of the wickedness of their heart, thoughts, and actions, and who put their trust solely in Jesus, the Gospel offers forgiveness, eternal life, and freedom from sin. The Lord Jesus, who chose to leave the glory of Heaven, who came to Earth as an embryo, who grew up clothed in human flesh, who taught truth, love, and grace, who died on the cross at the hands of evil men, and who rose victoriously from the dead on the third day as He had predicted, is the focus of the abolitionist&apos;s life and work. It is out of love for Him that we obey his command to love our neighbor as ourselves.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">The Word of God declares that all men and women are guilty of sin before God.</h3>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>For all have sinned and fall short of the glory of God.</p>
              <cite className="text-gray-600 not-italic">&mdash; Romans 3:23</cite>
            </blockquote>

            <h3 className="text-xl font-bold mt-8 mb-4">That all will stand before God to be judged.</h3>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>And as it is appointed for men to die once, but after this the judgment.</p>
              <cite className="text-gray-600 not-italic">&mdash; Hebrews 9:27</cite>
            </blockquote>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>Then I saw a great white throne and Him who sat on it, from whose face the earth and heaven fled away. And there was found no place for them. And I saw the dead, small and great, standing before God, and books were opened. And another book was opened, which is the Book of Life. And the dead were judged according to their works, by the things which were written in the books.</p>
              <cite className="text-gray-600 not-italic">&mdash; Revelation 20:11,12</cite>
            </blockquote>

            <h3 className="text-xl font-bold mt-8 mb-4">That God has only one acceptable payment for sin.</h3>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>&hellip;and without shedding of blood there is no remission.</p>
              <cite className="text-gray-600 not-italic">&mdash; Hebrews 9:22</cite>
            </blockquote>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>For the life of the flesh is in the blood, and I have given it to you upon the altar to make atonement for your souls; for it is the blood that makes atonement for the soul.</p>
              <cite className="text-gray-600 not-italic">&mdash; Leviticus 17:11</cite>
            </blockquote>

            <p>
              But not any blood will do. The blood must be acceptable to God. All of mankind finds themselves in a seemingly impossible predicament. We are guilty sinners. The Judge stands ready to execute his judgment. We are unable to render any payment for our crime.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">But there is Good News! God ALSO loves us&hellip; and He has made provision for us through His only Son, Jesus Christ.</h3>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>For God so loved the world, that He gave His only begotten Son.</p>
              <cite className="text-gray-600 not-italic">&mdash; John 3:16a</cite>
            </blockquote>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>But God, who is rich in mercy, because of His great love with which He loved us, even when we were dead in trespasses, made us alive together with Christ (by grace you have been saved).</p>
              <cite className="text-gray-600 not-italic">&mdash; Ephesians 2:4,5</cite>
            </blockquote>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>But God demonstrates His own love toward us, in that while we were still sinners, Christ died for us. Much more then, having now been justified by His blood, we shall be saved from wrath through Him.</p>
              <cite className="text-gray-600 not-italic">&mdash; Romans 5:8,9</cite>
            </blockquote>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>But if we walk in the light as He is in the light, we have fellowship with one another, and the blood of Jesus Christ His Son cleanses us from all sin.</p>
              <cite className="text-gray-600 not-italic">&mdash; I John 1:7a</cite>
            </blockquote>

            <h3 className="text-xl font-bold mt-8 mb-4">Jesus Christ is the only way by which men can be saved.</h3>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>Jesus said to him, &ldquo;I am the way, the truth, and the life. No one comes to the Father except through Me.&rdquo;</p>
              <cite className="text-gray-600 not-italic">&mdash; John 14:6</cite>
            </blockquote>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>For there is one God and one Mediator between God and men, the Man Christ Jesus.</p>
              <cite className="text-gray-600 not-italic">&mdash; I Timothy 2:5</cite>
            </blockquote>

            <h3 className="text-xl font-bold mt-8 mb-4">God calls all men to repent and believe on Jesus Christ. This is faith. It is the one act of man that is not a meritorious work.</h3>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>&hellip;testifying to Jews, and also to Greeks, repentance toward God and faith toward our Lord Jesus Christ.</p>
              <cite className="text-gray-600 not-italic">&mdash; Acts 20:21</cite>
            </blockquote>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>The Lord is not slack concerning His promise, as some count slackness, but is longsuffering toward us, not willing that any should perish but that all should come to repentance.</p>
              <cite className="text-gray-600 not-italic">&mdash; II Peter 3:9</cite>
            </blockquote>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>But what does it say? &ldquo;The word is near you, in your mouth and in your heart&rdquo; (that is, the word of faith which we preach): that if you confess with your mouth the Lord Jesus and believe in your heart that God has raised Him from the dead, you will be saved. For with the heart one believes unto righteousness, and with the mouth confession is made unto salvation.</p>
              <cite className="text-gray-600 not-italic">&mdash; Romans 10:8-10</cite>
            </blockquote>

            <h3 className="text-xl font-bold mt-8 mb-4">We are saved by grace through faith and not by works.</h3>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>Therefore we conclude that a man is justified by faith apart from the deeds of the law.</p>
              <cite className="text-gray-600 not-italic">&mdash; Romans 3:28</cite>
            </blockquote>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>For what does the Scripture say? &ldquo;Abraham believed God, and it was accounted to him for righteousness.&rdquo; Now to him who works, the wages are not counted as grace but as debt. But to him who does not work but believes on Him who justifies the ungodly, his faith is accounted for righteousness.</p>
              <cite className="text-gray-600 not-italic">&mdash; Romans 4:3-5</cite>
            </blockquote>

            <h3 className="text-xl font-bold mt-8 mb-4">But true faith is always evidenced by works.</h3>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>What does it profit, my brethren, if someone says he has faith but does not have works? Can faith save him? If a brother or sister is naked and destitute of daily food, and one of you says to them, &ldquo;Depart in peace, be warmed and filled,&rdquo; but you do not give the things which are needed for the body, what does it profit? Thus also faith by itself, if it does not have works, is dead. But someone will say, &ldquo;You have faith, and I have works.&rdquo; Show me your faith without your works, and I will show you my faith by my works.</p>
              <cite className="text-gray-600 not-italic">&mdash; James 2:14-18</cite>
            </blockquote>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>Pure and undefiled religion before God and the Father is this: to visit orphans and widows in their trouble, and to keep oneself unspotted from the world.</p>
              <cite className="text-gray-600 not-italic">&mdash; James 1:27</cite>
            </blockquote>

            <h3 className="text-xl font-bold mt-8 mb-4">Upon being born again, believers are indwelt by the Holy Spirit.</h3>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>Now when they heard this, they were pricked in their heart, and said unto Peter and to the rest of the apostles, Men and brethren, what shall we do? Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost.</p>
              <cite className="text-gray-600 not-italic">&mdash; Acts 2:37-38</cite>
            </blockquote>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>For ye have not received the spirit of bondage again to fear; but ye have received the Spirit of adoption, whereby we cry, Abba, Father. The Spirit itself beareth witness with our spirit, that we are the children of God.</p>
              <cite className="text-gray-600 not-italic">&mdash; Romans 8:15-16</cite>
            </blockquote>

            <h3 className="text-xl font-bold mt-8 mb-4">The Gospel of Jesus Christ saves men from God&apos;s eternal judgment and from sin&apos;s power in their lives today.</h3>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>Then Jesus said to those Jews who believed Him, &ldquo;If you abide in My word, you are My disciples indeed. And you shall know the truth, and the truth shall make you free.&rdquo; They answered Him, &ldquo;We are Abraham&apos;s descendants, and have never been in bondage to anyone. How can You say, &lsquo;You will be made free&rsquo;?&rdquo; Jesus answered them, &ldquo;Most assuredly, I say to you, whoever commits sin is a slave of sin.&rdquo;</p>
              <cite className="text-gray-600 not-italic">&mdash; John 8:31-34</cite>
            </blockquote>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>But now having been set free from sin, and having become slaves of God, you have your fruit to holiness, and the end, everlasting life.</p>
              <cite className="text-gray-600 not-italic">&mdash; Romans 6:22</cite>
            </blockquote>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>And those who are Christ&apos;s have crucified the flesh with its passions and desires.</p>
              <cite className="text-gray-600 not-italic">&mdash; Galatians 5:24</cite>
            </blockquote>

            <h3 className="text-xl font-bold mt-8 mb-4">The Scriptures declare that salvation from eternal judgment comes by faith and that the righteous live by faith in the promises of God.</h3>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>For in it the righteousness of God is revealed from faith to faith; as it is written, &ldquo;The just shall live by faith.&rdquo;</p>
              <cite className="text-gray-600 not-italic">&mdash; Romans 1:17</cite>
            </blockquote>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>&ldquo;I have been crucified with Christ; it is no longer I who live, but Christ lives in me; and the life which I now live in the flesh I live by faith in the Son of God, who loved me and gave Himself for me.&rdquo;</p>
              <cite className="text-gray-600 not-italic">&mdash; Galatians 2:20</cite>
            </blockquote>

            <div className="bg-gray-100 p-6 rounded-lg my-8">
              <p>
                The reality of this good news, the truth of the Gospel, provides the impulse and foundation for all that we do. We have been transformed by the Gospel and by its truths are compelled and enabled to transform the world we live in. Because of the Grace we have received in Christ Jesus and the power and freedom we now possess in knowing and abiding in Him, we cannot remain silent. As ambassadors of Christ, we implore you to be reconciled to God. If you do not know the Lord, we urge you to repent of your sins and turn to Christ, trust in Him, and be baptized into His Name.
              </p>
            </div>

            <div className="my-10">
              <Link
                href="/the-gospel/answer-to-abortion"
                className="inline-block px-8 py-4 bg-red-600 text-white font-bold text-sm tracking-wide hover:bg-red-700 transition-colors no-underline"
              >
                Read More &#10148; THE ANSWER TO ABORTION
              </Link>
            </div>

            <p className="text-sm text-gray-500 italic">
              This content was originally published at <a href="https://web.archive.org/web/2026/https://abolishhumanabortion.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Abolish Human Abortion</a>. Garden State Abolitionists is not formally affiliated with <a href="https://web.archive.org/web/2026/https://abolishhumanabortion.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Abolish Human Abortion</a>, but shares its abolitionist principles.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/the-gospel/great-commission" className="text-red-600 font-semibold hover:underline">
              &larr; Abolitionism &amp; the Great Commission
            </Link>
            <Link href="/the-gospel/answer-to-abortion" className="text-red-600 font-semibold hover:underline">
              The Answer to Abortion &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
