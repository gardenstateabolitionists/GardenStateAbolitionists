import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Abolitionism and The Great Commission',
  description: 'The Great Commission without abolition is dead. If faith without works is dead, what kind of faith refuses to help end the murder of preborn children?',
  alternates: { canonical: '/the-gospel/great-commission' },
};

export default function GreatCommissionPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Abolitionism &amp;</span>{' '}
            <span className="font-black">THE GREAT COMMISSION</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">The Great Commission Without Abolition is Dead</p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'The Gospel', href: '/the-gospel' }, { label: 'The Great Commission' }]} />

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none space-y-6">
            <h2 className="text-3xl md:text-4xl mb-2">
              <span className="font-light">If Faith Without</span>{' '}
              <span className="font-black">WORKS IS DEAD</span>
            </h2>
            <p className="text-sm tracking-[0.2em] uppercase font-semibold text-gray-800 mt-0 mb-2">What kind of faith refuses to help end the murder of preborn children?</p>
            <div className="w-12 h-[3px] bg-red-600 mb-8" />

            <div className="flex flex-col md:flex-row gap-8 my-8 items-start">
              <div className="md:w-2/3 space-y-6">
                <p className="mt-0">
                  A common objection from many within the institutional Protestant church today when confronted with our message of abolition is to &ldquo;keep the main thing the main thing.&rdquo; They often claim that the work of the church is to fulfill the Great Commission, plain and simple and not to muddle about with &ldquo;social justice&rdquo; causes. The result of such reasoning is an abundance of professedly &ldquo;pro-life&rdquo; churches that spend substantially more time and money running programs, paying the salaries of professional clergy, and maintaining landscaping, than they do exercising true religion (<a href="https://biblia.com/bible/esv/james/1/27" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Jas. 1:27</a>). With few exceptions the visible and professing church of Jesus Christ in America currently does little more than offer token expressions of opposition to the greatest and most dehumanizing evil of our age. A frequent justification of this abandonment of true religion is to hide behind the supposed &ldquo;work of the Great Commission.&rdquo; But a faithful examination of the Scriptures will confirm that just as faith without works is dead, so also is a &ldquo;Great Commission&rdquo; without the work of abolition.
                </p>
              </div>
              <div className="w-2/3 max-w-[220px] mx-auto md:max-w-none md:w-1/3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/obey-the-gospel.png"
                  alt="Obey the Gospel"
                  className="w-full rounded-lg"
                />
              </div>
            </div>

            <p>
              The text of the Great Commission is as follows:
            </p>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>
                Now the eleven disciples went to Galilee, to the mountain to which Jesus had directed them. And when they saw him they worshiped him, but some doubted. And Jesus came and said to them, &ldquo;All authority in heaven and on earth has been given to me. Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, <strong>teaching them to observe all that I have commanded you</strong>. And behold, I am with you always, to the end of the age.&rdquo;
              </p>
              <cite className="text-gray-600 not-italic">&mdash; Matt. 28:16-20, ESV (Emphasis added)</cite>
            </blockquote>

            <p>
              The Great Commission includes the work of evangelism and discipleship. This discipleship entails teaching the evangelized to obey all that Christ has commanded. And what has Christ commanded? A number of things, but if we must begin somewhere, the commandments that Christ identified as the two greatest, upon which depend all the Law and the Prophets, commend themselves to us.
            </p>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>
                But when the Pharisees heard that he had silenced the Sadducees, they gathered together. And one of them, a lawyer, asked him a question to test him. &ldquo;Teacher, which is the great commandment in the Law?&rdquo; And he said to him, &ldquo;You shall love the Lord your God with all your heart and with all your soul and with all your mind. This is the great and first commandment. And a second is like it: You shall love your neighbor as yourself. On these two commandments depend all the Law and the Prophets.&rdquo;
              </p>
              <cite className="text-gray-600 not-italic">&mdash; Matt. 22:34-40, ESV</cite>
            </blockquote>

            <p>
              Certainly, if Jesus has anything in mind regarding which commandments should be taught, He has these greatest in mind. Throughout the Gospels, we see that our obligation to love our neighbor was one of the main emphases of Christ&apos;s teaching ministry (<a href="https://biblia.com/bible/esv/matthew/7/12" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Matt. 7:12</a>, <a href="https://biblia.com/bible/esv/luke/10/25-37" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Luke 10:25-37</a>, <a href="https://biblia.com/bible/esv/john/15/12-14" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">John 15:12-14</a>, <a href="https://biblia.com/bible/esv/matthew/25/31-46" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Matt. 25:31-46</a>). So, if as part of the Great Commission, Christ commands that these two be taught, the question then arises: what do they entail?
            </p>

            <p>
              If you love your neighbor as yourself, will you stand idly by while he is legally dismembered, even though he has committed no crime, and wronged no one? Will you stand idly by while two of your neighbors (in this country alone) are so butchered every minute? While 3500 neighbors are ripped limb from limb every day? Or will you content yourself with token expressions of opposition to this great evil? If you simply listen to one &ldquo;sanctity of life&rdquo; sermon a year, of what benefit is that? If you are a Christian, do you not already know that life is sacred? Have you not read that human beings are created in the image of God (<a href="https://biblia.com/bible/esv/genesis/1/27" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Gen 1:27</a>)? Are you so dull of mind and spirit that you need to be reminded once a year that murdering children is wrong? Do you not rather need to be exhorted to action? Where is the frequent and thunderous call from the pulpits to rise up as the Body of Christ and put an end to this great evil? Where is the resounding call to love justice, correct oppression, and take up the cause of the fatherless (<a href="https://biblia.com/bible/esv/isaiah/1/17" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Isa. 1:17</a>)? Where is the rebuke of the carnal, the slothful, and the worldly weekly pew-fillers? Where is the call for such to repent of their sins and begin the exercise of true religion (<a href="https://biblia.com/bible/esv/james/1/27" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Jas. 1:27</a>)? The silence of our pulpits is so deafening that it could shatter every stained glass window, flip every pew, and wake every dead man from his grave.
            </p>

            <p>
              You, who claim to follow Christ &ndash; do you love your neighbor as you love yourself? If you were in the place of your preborn neighbor, being led to the slaughter, would you find what you do for them sufficient? Is simply &ldquo;voting pro-life,&rdquo; attending pro-life rallies, listening to sanctity of life sermons, and occasionally donating to crisis pregnancy centers the sum of loving your imperiled preborn neighbor as you love yourself? If the scalpel were even now at your throat, would you truly feel loved by those who do nothing more than warm the pews of the churches to prevent your death?
            </p>

            <p>
              If we love our preborn neighbors as we love ourselves, then we will not rest until abortion is abolished. We will not cease to agitate our culture and assist our neighbors until the blood of the most helpless and innocent members of our society ceases to flow as a river through this land. If we love our neighbors as we love ourselves &ndash; that is, if we actually do more than pay lip service to the commandments of Christ &ndash; then we can do no less. And if we actually seek to do something more than make a complete and total mockery of the Great Commission, then we will teach and exhort our brothers and sisters in Christ to do the same.
            </p>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/garrison-gospel.jpg"
              alt="Garrison - Gospel Immediately"
              className="w-full my-8 rounded-lg"
            />

            <p>
              As part of the Great Commission, Christ commands us to teach all that He has commanded. If you think that you are obeying Christ by &ldquo;keeping the main thing the main thing,&rdquo; but do not teach and exhort others to love their preborn neighbors as they love themselves and save them from the slaughter, you are not teaching them to observe the second greatest commandment. And if you are not teaching them to observe this commandment, then you are not teaching them to obey all that Christ commanded. And if you are not teaching them to obey all that Christ commanded, you are not being faithful to the work of the Great Commission.
            </p>

            <div className="bg-gray-100 p-6 rounded-lg my-8">
              <p>
                If your version of fulfilling the Great Commission does not result in people repenting of their sins and turning to obey the command of Christ to love their preborn neighbors as they love themselves, then you might be working to fulfill the Mediocre Commission or maybe the &ldquo;I&apos;ll-Spend-My-Life-Propagating-The-Kind-Of-Faith-That-Can-Exist-Without-Works&rdquo; Commission. But certainly not the Great Commission. A &ldquo;Great Commission&rdquo; that does not produce the work of abolition is the dead commission of a workless faith.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 my-8 items-start">
              <div className="md:w-2/3 space-y-6">
                <p className="mt-0">
                  If we obey the greatest commandment and love God with all of our heart, soul, mind and strength (<a href="https://biblia.com/bible/esv/mark/12/30" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Mk. 12:30</a>), then what will be our response to the legal dismemberment of the most innocent bearers of God&apos;s image in our country, not once but 3500 times a day? Are you willing to fight as hard to abolish the legalized slaughter of human children in your country as you are to fight against alcohol consumption in your denomination? Are you willing to oppose the practice of human abortion with the same tenacity with which you oppose theological liberals? Are you willing to fight even harder than that? If you are willing to spend thousands of hours toiling to fight for a particular doctrine and ensconce it as a denominational standard, should you not be willing to spend hundreds of thousands of hours toiling to abolish a practice that violently and ruthlessly desecrates the image of the God you claim to love, serve, and worship?
                </p>
              </div>
              <div className="w-2/3 max-w-[220px] mx-auto md:max-w-none md:w-1/3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/2-thessalonians.png"
                  alt="2 Thessalonians 1:8"
                  className="w-full rounded-lg"
                />
              </div>
            </div>

            <p>
              You cannot claim to love God while offering only token expressions of opposition to entrenched and celebrated evil against his very image. You cannot claim to be faithfully obeying the Great Commission, if those you convert and disciple have little desire to obey the greatest commands of Christ in the most crucial arenas. Examine yourself, lest you find yourself travelling over land and sea to make converts that are twice as much the sons of hell as yourself. Stop making a mockery of the Great Commission, as if a faith that does not produce obedience is a faith that can save. Wash your hands, you sinners, and purify your hearts, you double-minded! Grieve, mourn and wail! Change your laughter to mourning and your joy to gloom! Humble yourselves before the Lord, and He will lift you up.
            </p>

            <p>
              If you seek to obey the Great Commission, do so rightly. Proclaim the unadulterated Gospel of the Lord Jesus Christ. Command faith and repentance. Teach and exhort obedience to all that Christ has commanded. Make disciples that love what God loves, and hate what God hates. Make disciples who desire to seek justice, correct oppression, and take up the cause of the fatherless child who is murdered 3500 times a day in the land of the free and the home of the brave.
            </p>

            <p>
              We will not rest until we have effected the abolition of wanton child sacrifice. The love of Christ compels us. We can do no less.
            </p>

            <div className="my-10">
              <Link
                href="/the-gospel/message-of-reconciliation"
                className="inline-block px-8 py-4 bg-red-600 text-white font-bold text-sm tracking-wide hover:bg-red-700 transition-colors no-underline"
              >
                Read More &#10148; MESSAGE OF RECONCILIATION
              </Link>
            </div>

            <p className="text-sm text-gray-500 italic">
              This content was originally published at <a href="https://web.archive.org/web/2026/https://abolishhumanabortion.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Abolish Human Abortion</a>. Garden State Abolitionists is not formally affiliated with <a href="https://web.archive.org/web/2026/https://abolishhumanabortion.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Abolish Human Abortion</a>, but shares its abolitionist principles.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/the-gospel/kingdom-of-god" className="text-red-600 font-semibold hover:underline">
              &larr; Abolitionism &amp; the Kingdom of God
            </Link>
            <Link href="/the-gospel/message-of-reconciliation" className="text-red-600 font-semibold hover:underline">
              Message of Reconciliation &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
