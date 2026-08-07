/**
 * Abortion statistics shown on the homepage counter row.
 *
 * These are New Jersey figures from the Guttmacher Institute's 2024 data
 * release. The counter set was reshaped from the Michigan original because
 * New Jersey's data situation is different in two ways that matter:
 *
 * 1. New Jersey does not report abortion data to the CDC. State-reported
 *    counts run roughly half of Guttmacher's estimates (~23k vs ~59k a year),
 *    so a cumulative "total since 1973" would swing by over a million
 *    depending on which series you pick. It is not publishable as a single
 *    number and has been dropped rather than guessed at.
 * 2. Guttmacher's Abortion Provider Census ran every three years through 2020
 *    and annually only from 2023, so 2021 and 2022 have no figure. That makes
 *    an "abortions since the 2022 Freedom of Reproductive Choice Act" total
 *    uncomputable, so that counter was dropped too.
 *
 * What replaced them are figures that are directly sourced and, for New
 * Jersey, more striking anyway: the state's abortion rate is more than double
 * the national one.
 *
 * VERIFY BEFORE LAUNCH: confirm these against the Guttmacher release with the
 * client, and refresh when the next annual figures publish. Any field left
 * blank is hidden rather than rendered.
 */
export const statistics = {
  /** Abortions provided in New Jersey in 2024 (includes out-of-state patients). */
  annualAbortions: '59,830',
  /** 59,830 / 366 days. Rounded down. */
  dailyAbortions: '163',
  /** Per 1,000 women aged 15-44. National rate the same year was 15.5. */
  abortionRate: '32.9',
  /** Share of New Jersey pregnancies ending in abortion, 2024. */
  shareOfPregnancies: '37%',
};

/** Attribution line rendered beneath the counters when stats are populated. */
export const statisticsSource =
  'Guttmacher Institute, 2024 abortion provision estimates. New Jersey does not report abortion data to the CDC.';

/**
 * Social links — single source of truth referenced by Footer, Contact, and
 * homepage JSON-LD. A blank string hides that icon rather than linking to a
 * dead profile.
 *
 * TODO(client): paste the real Garden State Abolitionists profile URLs. These
 * are intentionally blank; the previous values pointed at another
 * organization's accounts, including a Signal group invite that would have
 * dropped visitors into a private chat that is not theirs.
 */
export const socialLinks = {
  // Canonical profile URL. The Page has no vanity username yet, so this is the
  // numeric-ID form that Facebook itself resolves to — the /share/ link the
  // Page owner copies is a redirect wrapper carrying a per-share tracking
  // token, which would rot and leaks referral data into our markup.
  // If a username is claimed later, switch this to facebook.com/<username>.
  facebook: 'https://www.facebook.com/people/Garden-State-Abolitionists/61591639320588/',
  x: 'https://x.com/abolitionnj',
  // The app's share sheet appends ?igsh=...&utm_source=qr; those are
  // session/QR attribution parameters and are deliberately stripped.
  instagram: 'https://www.instagram.com/newjerseyabolition',
  // Share links arrive with ?si=... (YouTube share attribution) — stripped for
  // the same reason, and the canonical www host is used since the bare
  // youtube.com form 301s.
  youtube: 'https://www.youtube.com/@newjerseyabolition',
  // Verified as a distinct group from the source organisation's — that invite
  // shipped in the copied code and would have dropped visitors into a private
  // chat belonging to someone else.
  signalGroup: 'https://signal.group/#CjQKIPkATnxKY3ezcE6vaORnxnMTZxIgOwLlUlffnLmfwu68EhBMQyB9ATptNaFHG1Tw1czz',
};

/**
 * Nonprofit disclosures. Google Ad Grants requires the EIN (Federal Tax ID)
 * or nonprofit registration number to be visible on the site — missing this
 * is the most common reason Ad Grants applications are rejected.
 *
 * TODO(client): every blank below needs the client's own value. Do not carry
 * anything over from another organization — the mailing address, tax status,
 * and founding year are legal representations, and `taxStatus` in particular
 * must not claim 501(c)(3) until the IRS determination letter actually
 * exists. Leave it blank while an application is pending.
 */
export const orgInfo = {
  legalName: 'Garden State Abolitionists',
  taxStatus: '',
  ein: process.env.NEXT_PUBLIC_ORG_EIN || '',
  registeredState: 'New Jersey',
  mailingAddress: {
    street: '',
    city: '',
    state: 'NJ',
    postalCode: '',
    country: 'US',
  },
  founded: '',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  // IRS Determination Letter — the official IRS document granting 501(c)(3)
  // status. Public via apps.irs.gov/pub/epostcard. This is the single most
  // credibility-boosting document a young nonprofit can display.
  irsDeterminationLetterUrl: process.env.NEXT_PUBLIC_IRS_DETERMINATION_LETTER_URL || '',
  // If/when a Form 990 or annual report is available, drop a public URL here
  // and the Financial Transparency section will link to it.
  form990Url: process.env.NEXT_PUBLIC_FORM_990_URL || '',
  annualReportUrl: process.env.NEXT_PUBLIC_ANNUAL_REPORT_URL || '',
};

// FAQ items with full content from screenshots
export const faqItems = [
  {
    id: 'human-life-fertilization',
    title: 'Does the Life of a Human Being Begin at Fertilization?',
    content: `
      <p>According to the God who created the universe and all humanity, humans are a unique kind of creation. He has explicitly stated that murder is evil at any age. He Himself took on human flesh and was knit together in His mother's womb from fertilization (Psalm 139:13-16, Luke 1:31).</p>
      <p>Scientific consensus affirms this:</p>
      <ul class="list-disc pl-6 space-y-2">
        <li>At fertilization, a new, genetically distinct human organism comes into existence</li>
        <li>This organism has its own unique DNA, separate from both mother and father</li>
        <li>From this moment, the human being begins a continuous process of development</li>
      </ul>
      <p class="mt-4"><span class="text-highlight">This is the definition.</span> This great atrocity must be abolished.</p>
    `,
  },
  {
    id: 'fetus-not-human',
    title: 'The Fetus is Not a Human Being',
    content: `
      <p><span class="text-highlight">The fetus is just a clump of cells.</span></p>
      <p>Response:</p>
      <ol class="list-decimal pl-6 space-y-2">
        <li>Every human being is a "clump of cells." This description applies equally to adults.</li>
        <li>The unborn child has unique human DNA from the moment of fertilization.</li>
        <li>The unborn child has a heartbeat as early as 6 weeks.</li>
        <li>The unborn child can feel pain and responds to stimuli.</li>
      </ol>
      <p class="mt-4">The term "fetus" is simply a Latin word meaning "offspring" or "little one." It is a stage of human development, not a different kind of being.</p>
    `,
  },
  {
    id: 'bodily-autonomy',
    title: 'The Mother Has a Right to Bodily Autonomy',
    content: `
      <p><span class="text-highlight">"My body, my choice."</span></p>
      <p>Response:</p>
      <ol class="list-decimal pl-6 space-y-2">
        <li>The child in the womb is not the mother's body. It has its own unique DNA, often a different blood type, and may be a different sex.</li>
        <li>Bodily autonomy does not extend to harming another person. You cannot use your body to assault or kill another human being.</li>
        <li>The right to bodily autonomy is not absolute. We accept many limitations on it for the good of society (vaccine mandates, drug laws, etc.).</li>
        <li>If bodily autonomy justified killing, it would justify killing any dependent person (infants, elderly, disabled).</li>
      </ol>
      <p class="mt-4"><span class="text-highlight">The child's right to life supersedes the mother's preference for convenience.</span></p>
    `,
  },
  {
    id: 'rape-exception',
    title: 'The Rape Exception',
    content: `
      <p><span class="text-highlight">"What about rape?"</span></p>
      <p>This is one of the most emotionally charged objections. We must respond with compassion while maintaining the truth.</p>
      <ol class="list-decimal pl-6 space-y-2">
        <li>Rape is a horrific crime deserving severe punishment. We have deep compassion for rape victims.</li>
        <li>However, the child conceived in rape is innocent. Why should an innocent child receive the death penalty for the crime of his father?</li>
        <li>Two wrongs don't make a right. Adding violence (abortion) to violence (rape) does not bring healing.</li>
        <li>Many women who have abortions after rape report additional trauma, not healing.</li>
        <li>We should punish rapists, not innocent children.</li>
      </ol>
      <p class="mt-4"><span class="text-highlight">The circumstances of fertilization do not determine a person's value or right to life.</span></p>
    `,
  },
  {
    id: 'mothers-life',
    title: "What About the Mother's Life?",
    content: `
      <p><span class="text-highlight">"What if the pregnancy threatens the mother's life?"</span></p>
      <p>Response:</p>
      <ol class="list-decimal pl-6 space-y-2">
        <li>Legitimate medical interventions to save the mother's life are not the same as elective abortion.</li>
        <li>When a doctor performs a procedure to save the mother and the child dies as an unintended consequence, this is not murder.</li>
        <li>Directly killing the child is never medically necessary. Treatment of the mother may result in the child's death, but the death is not the goal.</li>
        <li>Modern medicine has advanced to the point where these situations are extremely rare.</li>
      </ol>
      <p class="mt-4">We affirm that both lives have equal value, and doctors should make every effort to save both.</p>
    `,
  },
  {
    id: 'church-and-state',
    title: 'This is About Making America a Theocracy / Separation of Church and State',
    content: `
      <p><span class="text-highlight">"You can't legislate your religion!"</span></p>
      <p>Response:</p>
      <ol class="list-decimal pl-6 space-y-2">
        <li>Where does your law that religious beliefs shouldn't influence legislation come from? That itself is a religious or philosophical claim.</li>
        <li>All law is based on moral values. The question is: whose morality?</li>
        <li>The pro-choice position is also a moral position. It makes claims about personhood, rights, and value.</li>
        <li>We don't need religious arguments to oppose abortion. Science and reason support the pro-life position.</li>
        <li>Laws against murder, theft, and assault are all based on moral beliefs. Should we repeal them?</li>
      </ol>
      <p class="mt-4"><span class="text-highlight">Refusing to allow religious beliefs to influence legislation is itself a religious position that would disqualify most legislation in history.</span></p>
    `,
  },
  {
    id: 'not-woman',
    title: 'You Are Not a Woman and Have No Right to an Opinion',
    content: `
      <p><span class="text-highlight">"No uterus, no opinion!"</span></p>
      <p>Response:</p>
      <ol class="list-decimal pl-6 space-y-2">
        <li>This argument would also silence pro-choice men. Do you really want to do that?</li>
        <li>Many women are pro-life. In fact, women are roughly split on the issue.</li>
        <li>Truth is not determined by the identity of the speaker. An argument is valid or invalid regardless of who makes it.</li>
        <li>By this logic, we couldn't oppose slavery unless we were slaves, or oppose child abuse unless we were children.</li>
        <li>Abortion affects the entire society, not just women.</li>
      </ol>
      <p class="mt-4">The most affected party in an abortion is the child, who has no voice at all.</p>
    `,
  },
  {
    id: 'forcing-beliefs',
    title: "You Can't Force Your Beliefs on Others",
    content: `
      <p><span class="text-highlight">"Don't like abortion? Don't have one!"</span></p>
      <p>Response:</p>
      <ol class="list-decimal pl-6 space-y-2">
        <li>Every law "forces beliefs" on others. Laws against murder force the belief that murder is wrong.</li>
        <li>"Don't like slavery? Don't own a slave!" Would this argument have been acceptable?</li>
        <li>We're not talking about personal preferences like ice cream flavors. We're talking about human lives.</li>
        <li>Justice requires defending the innocent, even if some disagree.</li>
      </ol>
    `,
  },
  {
    id: 'would-have-bad-life',
    title: 'Should We Really Bring Children Into a World Where They Would Have a Bad Life?',
    content: `
      <p><span class="text-highlight">"The child would be born into poverty/abuse/etc."</span></p>
      <p>Response:</p>
      <ol class="list-decimal pl-6 space-y-2">
        <li>This argument justifies killing anyone who has a difficult life. Should we kill homeless people?</li>
        <li>We cannot predict the future. Many successful people came from difficult circumstances.</li>
        <li>The solution to poverty is not to kill poor people but to help them.</li>
        <li>Many couples are waiting to adopt. There is no shortage of loving homes.</li>
        <li>If difficult circumstances justify killing, we could justify killing anyone at any age.</li>
      </ol>
      <p class="mt-4"><span class="text-highlight">We should address problems without killing innocent human beings.</span></p>
    `,
  },
  {
    id: 'back-alley-abortions',
    title: 'Making Abortion Illegal Will Just Lead to Dangerous Back-Alley Abortions',
    content: `
      <p><span class="text-highlight">"Women will die in back alleys!"</span></p>
      <p>Response:</p>
      <ol class="list-decimal pl-6 space-y-2">
        <li>Should we legalize all crimes because some people will commit them anyway? Should we legalize bank robbery to make it "safer"?</li>
        <li>The statistics about back-alley abortion deaths before Roe v. Wade were vastly exaggerated.</li>
        <li>Abortion kills a child every time. We cannot legalize murder to make it "safer" for the murderer.</li>
        <li>Making abortion illegal does reduce abortion rates, as we've seen in many states and countries.</li>
        <li>We should provide resources for pregnant women, not kill their children.</li>
      </ol>
    `,
  },
  {
    id: 'miscarriage-investigation',
    title: 'Should Every Miscarriage be Investigated by the Police?',
    content: `
      <p>Response:</p>
      <ol class="list-decimal pl-6 space-y-2">
        <li>No. Miscarriages are natural deaths, not homicides.</li>
        <li>We don't investigate every natural death. We investigate suspicious deaths.</li>
        <li>This argument could apply to any age. "Should every infant death be investigated?" In cases of suspected abuse, yes. In cases of natural illness, no.</li>
        <li>The law already distinguishes between natural death and homicide. This would be no different.</li>
      </ol>
    `,
  },
  {
    id: 'ivf',
    title: 'What About IVF?',
    content: `
      <p>Response:</p>
      <ol class="list-decimal pl-6 space-y-2">
        <li>IVF that creates and destroys embryos is morally problematic because it intentionally creates human beings knowing many will die.</li>
        <li>Each embryo is a unique human being with its own DNA.</li>
        <li>Alternatives exist that do not involve creating excess embryos.</li>
        <li>The desire for children does not justify creating and discarding human lives.</li>
      </ol>
      <p class="mt-4">We encourage adoption and forms of fertility treatment that respect the dignity of all human life.</p>
    `,
  },
  {
    id: 'why-not-focus-born',
    title: 'Why Not Focus on Already-Born Children Who Are Suffering Instead?',
    content: `
      <p><span class="text-highlight">"Why don't you care about children after they're born?"</span></p>
      <p>Response:</p>
      <ol class="list-decimal pl-6 space-y-2">
        <li>This is a false choice. We can care about both.</li>
        <li>Pro-lifers adopt at higher rates than the general population.</li>
        <li>Crisis pregnancy centers provide extensive support for mothers and children.</li>
        <li>Would you accept this argument about any other injustice? "Why focus on sex trafficking when there are homeless people?"</li>
        <li>The fact that there are other problems doesn't mean we should ignore the killing of innocent children.</li>
      </ol>
      <p class="mt-4"><span class="text-highlight">Abolitionists are involved in many forms of charity and care. Fighting abortion doesn't preclude other good works.</span></p>
    `,
  },
  {
    id: 'why-not-incrementalism',
    title: 'Why Not Support Incremental Pro-Life Bills?',
    content: `
      <p><span class="text-highlight">"Shouldn't we take what we can get?"</span></p>
      <p>Response:</p>
      <ol class="list-decimal pl-6 space-y-2">
        <li>Incremental bills concede that some babies can be legally killed.</li>
        <li>A heartbeat bill says it's OK to kill a baby before the heartbeat. A 20-week ban says it's OK to kill a baby before 20 weeks.</li>
        <li>These bills have not worked. After 50 years of incrementalism, abortion is still legal.</li>
        <li>Abolition is the only strategy that treats all human beings equally from fertilization.</li>
        <li>Would we have accepted incremental abolition of slavery? "Only 3/5 of slaves can be freed this year"?</li>
      </ol>
      <p class="mt-4"><span class="text-highlight">Equal justice requires equal protection. We cannot negotiate away the right to life of any human being.</span></p>
    `,
  },
  {
    id: 'capital-punishment',
    title: 'How Can You Be Against Abortion Yet Support Capital Punishment?',
    content: `
      <p>Response:</p>
      <ol class="list-decimal pl-6 space-y-2">
        <li>There is a fundamental difference between innocent life and guilty life.</li>
        <li>The unborn child is completely innocent. A convicted murderer has forfeited his right to life by taking another's.</li>
        <li>Scripture distinguishes between murder (prohibited) and lawful execution (permitted in some circumstances).</li>
        <li>Protecting innocent life and punishing guilty murderers are consistent positions.</li>
        <li>Note: Many abolitionists have varying views on capital punishment. This is not a core issue for abolition.</li>
      </ol>
      <p class="mt-4">In Exodus 21:22, God did not regard the prebirth child as of the same stature as the woman. Notice that it says "if there is no serious injury..." This refers to injury to the mother, not the child. If the child is killed, it is still treated as a serious crime requiring compensation.</p>
    `,
  },
  {
    id: 'you-are-racist',
    title: 'You Are Racist',
    content: `
      <p><span class="text-highlight">"The pro-life movement is racist!"</span></p>
      <p>Response:</p>
      <ol class="list-decimal pl-6 space-y-2">
        <li>Actually, abortion is racist in its origins and effects.</li>
        <li>Margaret Sanger, founder of Planned Parenthood, was a eugenicist who targeted minority communities.</li>
        <li>Black babies are aborted at 3.5 times the rate of white babies.</li>
        <li>79% of Planned Parenthood facilities are located within walking distance of minority neighborhoods.</li>
        <li>More black babies are aborted than born in New York City.</li>
      </ol>
      <p class="mt-4"><span class="text-highlight">Abortion is the leading cause of death in the black community. Fighting abortion is fighting racism.</span></p>
    `,
  },
  {
    id: 'westboro-baptist',
    title: 'You Are Like Westboro Baptist',
    content: `
      <p><span class="text-highlight">"You're just hateful extremists!"</span></p>
      <p>Response:</p>
      <ol class="list-decimal pl-6 space-y-2">
        <li>Westboro Baptist Church celebrates death and rejoices in tragedy. We mourn the death of every aborted child.</li>
        <li>WBC attacks people. We seek to save both mothers and babies.</li>
        <li>WBC spreads hatred. We spread the gospel of love and forgiveness.</li>
        <li>Our message is one of hope: there is forgiveness in Christ for all sins, including abortion.</li>
        <li>We affirm our non-violence statement and commitment to peaceful, lawful activism.</li>
      </ol>
      <p class="mt-4">Read our <a href="/non-violence-statement" class="text-red-600 hover:underline">non-violence statement</a> for more information.</p>
    `,
  },
  {
    id: 'what-right-make-laws',
    title: 'What Right Do You Have to Make Laws About This?',
    content: `
      <p>Response:</p>
      <ol class="list-decimal pl-6 space-y-2">
        <li>Every citizen has the right to advocate for just laws.</li>
        <li>Laws against murder are not controversial. We simply believe the unborn are human beings who deserve legal protection.</li>
        <li>The question is not whether we have the "right" to make laws, but whether the laws are just.</li>
        <li>Do you think advocates for any other cause don't have the right to change laws?</li>
      </ol>
    `,
  },
  {
    id: 'shoot-abortionists',
    title: 'Do You Shoot Abortionists and Bomb Clinics?',
    content: `
      <p><span class="text-highlight">Absolutely not.</span></p>
      <p>Response:</p>
      <ol class="list-decimal pl-6 space-y-2">
        <li>We condemn all violence against any person, including abortionists.</li>
        <li>Violence is not only wrong but counterproductive to our cause.</li>
        <li>We seek to change hearts and laws through peaceful, legal means.</li>
        <li>The gospel calls us to love our enemies and pray for those who persecute us.</li>
        <li>We believe in the power of truth, not violence, to change minds.</li>
      </ol>
      <p class="mt-4">Read our <a href="/non-violence-statement" class="text-red-600 hover:underline">non-violence statement</a> for our full position on this issue.</p>
    `,
  },
];
