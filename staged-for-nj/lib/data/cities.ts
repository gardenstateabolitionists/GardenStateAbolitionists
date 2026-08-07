/**
 * City-landing-page configs. One entry per city we cover. Kept in a
 * plain data module so a page is a rendered projection of a config —
 * add a new city by adding a new entry, and the route + OG image + all
 * of the JSON-LD wire up automatically.
 *
 * Districts are the union of the MI state House/Senate districts that
 * cover any part of the city. Derived by geocoding a spread of the
 * city's ZIP centroids through the Census /geographies/coordinates
 * endpoint (see scratchpad/probe scripts). District numbers match the
 * 2024 vintage (MI's 2022 redistricting), matching legislators.json.
 */

export interface CityFaq {
  q: string;
  /** Plain-text answer — used in FAQPage JSON-LD, must not contain HTML. */
  a: string;
  /** Optional set of {phrase → href} that turn matching phrases in
   *  the answer into clickable links when rendered. The plain-text
   *  `a` stays intact for the schema. */
  links?: Array<{ phrase: string; href: string }>;
}

export interface CityConfig {
  slug: string;
  name: string;
  region: string;                // e.g. "Wayne County"
  populationLabel: string;       // human-readable, e.g. "~633,000 residents"
  /** For sorting the city index by size + for future map dot-size. */
  population: number;
  /** City centroid — mean of ZIP centroids inside city limits. Used by
   * the "nearby cities" strip on each city page and by the /cities
   * interactive map. */
  latitude: number;
  longitude: number;
  houseDistricts: number[];
  senateDistricts: number[];
  /**
   * Two-paragraph hero + history section written specifically for
   * this city. Real content — not templated — so search treats each
   * city page as substantively distinct.
   */
  historyParagraphs: string[];
  /**
   * Intro sentence(s) before the clinic list. Sets the framing for
   * *why* the clinic count matters (voter context, provider
   * concentration, etc). Kept factual — abolition case is made in
   * the site-wide messaging. The clinics themselves are pulled from
   * data/abortion-mills.json by matching on `city === name`.
   */
  abortionLandscapeIntro: string;
  /** Any post-list note — e.g. voter context, ballot-measure history. */
  abortionLandscapeOutro?: string;
  faqs: CityFaq[];
}

export const CITIES: CityConfig[] = [
  {
    slug: 'detroit',
    name: 'Detroit',
    region: 'Wayne County',
    populationLabel: '~633,000 residents',
    population: 633000,
    latitude: 42.3314,
    longitude: -83.0458,
    houseDistricts: [1, 4, 5, 7, 8, 9, 10, 11, 16, 17],
    senateDistricts: [1, 2, 3, 6, 8, 10],
    historyParagraphs: [
      'Detroit sits at the northern terminus of the Underground Railroad. Second Baptist Church, founded in 1836 by thirteen freed African-Americans, sheltered an estimated 5,000 people fleeing slavery across the Detroit River into Windsor, Canada. William Lambert, George DeBaptiste, and the Detroit Vigilance Committee ran the "Midnight" station house that made those crossings possible.',
      'The abolitionists who built that network refused the "gradualist" argument that slavery would fade with time if you regulated it, taxed it, or waited for public opinion. They insisted on immediate, total abolition — codified in law and enforced by government. Abolish Abortion Michigan stands in that same tradition. The preborn are the same class of person the antebellum abolitionists fought for: image-bearers of God whose right to live is denied by law and defended only if we insist, immediately and totally, that the law protect them.',
    ],
    abortionLandscapeIntro:
      'In a city of ~633,000 residents, Detroit has one of the highest per-capita abortion-provider densities in Michigan. The facilities operating inside Detroit city limits:',
    abortionLandscapeOutro:
      'Michigan’s 2022 Reproductive Freedom for All ballot measure (Proposal 3) constitutionalized abortion access statewide. Wayne County voted 68% in favor. That vote was not the end of the abolitionist argument — it was the beginning of the case that abortion is a matter of biblical and constitutional equal-protection, not popular vote. Every Detroit-area state legislator listed below is on record voting to expand abortion access.',
    faqs: [
      {
        q: 'Is there an abolitionist group in Detroit?',
        a: 'Abolish Abortion Michigan (AAM) covers Detroit alongside the rest of the state. There is no separate Detroit-only coalition; visit our partners page for the national and state-by-state network we work alongside, or contact us to help us start local Detroit-area work.',
        links: [
          { phrase: 'partners page', href: '/partners' },
          { phrase: 'contact us', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Detroit?',
        a: 'Detroit is served by ten state House districts and six state Senate districts. Use our Find-my-legislator tool on the scorecard page — enter your Detroit ZIP code (or full address for a precise match) and it will return your specific House and Senate representative with their voting record.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Detroit?',
        a: 'Sign the Michigan abolition petition, contact your Detroit state representative through the scorecard, join our Signal group to connect with other Detroit-area abolitionists, share our resources with your church, and — if your church would consider adopting an abolitionist resolution — reach out to us. We can send you the model resolution and walk your pastor through it.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. That is distinct from the mainstream pro-life position, which is willing to accept exceptions (rape, incest, life of the mother) and to reduce abortion incrementally through waiting periods, regulations, and viability bans. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Grand Rapids ------------------------------------------------
  {
    slug: 'grand-rapids',
    name: 'Grand Rapids',
    region: 'Kent County',
    populationLabel: '~199,000 residents',
    population: 199000,
    latitude: 42.9369,
    longitude: -85.6318,
    houseDistricts: [80, 81, 82, 83, 84],
    senateDistricts: [29, 30],
    historyParagraphs: [
      'Grand Rapids is the historic center of Dutch Reformed Christianity in America. The Reformed Church in America (RCA) and Christian Reformed Church in North America (CRCNA) — both born out of the 19th-century Dutch immigration to West Michigan — have their denominational headquarters here. It\'s a city where confessional Protestantism has shaped civic life for six generations, and where the theological categories that undergird abolitionism (image-of-God anthropology, the imprecatory Psalms, magisterial responsibility to protect the innocent) are already in the water.',
      'That inheritance is what makes the modern Grand Rapids abortion picture so striking. A city whose sanctuaries are full of the confession that human life is a gift from God is a city that still hosts an active Planned Parenthood facility three blocks from Heritage Hill. Abolition of abortion is the logical downstream of the theology that built this city — the gap between confession and civil law is the gap this movement exists to close.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates inside Grand Rapids city limits — the only one in West Michigan north of Kalamazoo:',
    abortionLandscapeOutro:
      'Kent County voted 62% in favor of Proposal 3 in 2022. That vote sits in tension with the county\'s deeply-Reformed institutional churches, which almost uniformly teach against abortion. Abolition is what closes the gap.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Grand Rapids?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Grand Rapids city limits, though the city is home to hundreds of RCA / CRCNA / URC / OPC / PCA congregations. If your Grand Rapids church has adopted an abolition resolution, reach out — we\'ll list them here.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Grand Rapids?',
        a: 'Grand Rapids is served by five state House districts and two state Senate districts. Use the Find-my-legislator tool on the scorecard page — enter your Grand Rapids ZIP code (or full address) to get your specific reps.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Grand Rapids?',
        a: 'Sign the Michigan abolition petition, contact your Grand Rapids state representative through the scorecard, join our Signal group to connect with other West Michigan abolitionists, and — if your church would consider adopting the abolition resolution — reach out to us.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. That is distinct from the mainstream pro-life position, which is willing to accept exceptions and to reduce abortion incrementally. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Warren ------------------------------------------------------
  {
    slug: 'warren',
    name: 'Warren',
    region: 'Macomb County',
    populationLabel: '~138,000 residents',
    population: 138000,
    latitude: 42.4958,
    longitude: -83.0202,
    houseDistricts: [11, 13, 14],
    senateDistricts: [3, 10],
    historyParagraphs: [
      'Warren is Michigan\'s third-largest city and Macomb County\'s civic anchor — a post-war industrial suburb built by the Big Three auto boom. It is the home of the U.S. Army Detroit Arsenal, General Motors Technical Center, and a working-class electorate that has voted Republican in every presidential election since 2016 while also sending Democrats to the state Legislature.',
      'The politically-mixed profile of Warren makes it a strategically important abolition city. Unlike deep-blue Detroit or deep-red Ottawa County, Macomb is a persuadable place. The abolitionist argument — that abortion is homicide and must be treated as such under law — has more room to work in a district where voters split tickets and are unafraid of the moral case, if it\'s made plainly.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates inside Warren city limits, serving the broader Macomb County market:',
    abortionLandscapeOutro:
      'Macomb County voted 55% in favor of Proposal 3 in 2022 — narrower than Wayne or Washtenaw, and one of the closer margins in southeast Michigan. That closeness is the wedge for a serious abolition case here.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Warren?',
        a: 'We\'re not aware of any publicly-abolitionist churches inside Warren city limits at this time. If yours has taken a public stand for abolition, reach out and we\'ll add them.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Warren?',
        a: 'Warren is served by three state House districts and two state Senate districts. Use our Find-my-legislator tool on the scorecard page to get yours by Warren ZIP or address.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Warren?',
        a: 'Sign the Michigan abolition petition, contact your Warren state representative through the scorecard, join our Signal group, and if your church would consider adopting the abolition resolution — reach out to us.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. That is distinct from the mainstream pro-life position, which accepts exceptions and pursues incremental restrictions. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Sterling Heights -------------------------------------------
  {
    slug: 'sterling-heights',
    name: 'Sterling Heights',
    region: 'Macomb County',
    populationLabel: '~133,000 residents',
    population: 133000,
    latitude: 42.5842,
    longitude: -83.0268,
    houseDistricts: [57, 58, 61],
    senateDistricts: [9, 10],
    historyParagraphs: [
      'Sterling Heights is Michigan\'s fourth-largest city, a postwar Macomb County suburb built on the assembly-line prosperity of the Detroit auto industry. It is now one of the most ethnically diverse cities in the state — home to the largest Chaldean (Iraqi Christian) population outside of the Middle East, alongside significant Assyrian, Albanian, Bosnian, and Polish communities.',
      'The Chaldean population in particular carries an ancient Christian witness — a church that has confessed the humanity of the preborn from Nicaea forward. Sterling Heights sits at the intersection of that historic Christian anthropology and one of the highest abortion-provider densities in the Detroit metro area — two facilities within four miles of each other. Closing that gap is the local abolitionist work.',
    ],
    abortionLandscapeIntro:
      'Two abortion facilities operate inside Sterling Heights city limits — one of the highest concentrations of any suburban city in Michigan:',
    abortionLandscapeOutro:
      'Macomb County voted 55% in favor of Proposal 3 in 2022. The Chaldean and Assyrian Catholic communities voted against it in significant numbers — a reminder that historically-Christian minority communities in Sterling Heights are natural coalition partners for the abolition case.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Sterling Heights?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Sterling Heights city limits. If your Sterling Heights church — Reformed, Chaldean Catholic, Assyrian, or otherwise — has taken a public stand for the abolition of abortion, reach out and we\'ll add them.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Sterling Heights?',
        a: 'Sterling Heights is served by three state House districts and two state Senate districts. Use our Find-my-legislator tool on the scorecard page to look yours up by ZIP or address.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Sterling Heights?',
        a: 'Sign the Michigan abolition petition, contact your Sterling Heights state representative through the scorecard, join our Signal group, and reach out to us if your church would consider adopting the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Ann Arbor ---------------------------------------------------
  {
    slug: 'ann-arbor',
    name: 'Ann Arbor',
    region: 'Washtenaw County',
    populationLabel: '~122,000 residents',
    population: 122000,
    latitude: 42.2724,
    longitude: -83.7263,
    houseDistricts: [23, 33, 47, 48],
    senateDistricts: [14, 15],
    historyParagraphs: [
      'Ann Arbor was a hub of the antebellum abolitionist movement. The Michigan State Anti-Slavery Society met here in 1841, and the University of Michigan\'s Society of Inquiry hosted abolitionist speakers throughout the 1830s and 40s. Reverend Guy Beckley — a Wesleyan Methodist minister and Underground Railroad conductor — pastored in Ann Arbor and edited the state\'s leading abolitionist newspaper. Beckley\'s house on Pontiac Trail sheltered escaped slaves; it still stands today.',
      'Modern Ann Arbor is one of the most politically progressive cities in Michigan and hosts the state\'s only abortion facility that performs procedures up to nearly 20 weeks. The tension is exactly what it was in 1841: a university town proud of its abolitionist inheritance, running an institution that denies personhood to the smallest class of human beings. Beckley\'s question to his 1840s congregation was whether their theology matched their politics. It\'s the same question today.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates inside Ann Arbor city limits — with the latest gestational cutoff of any provider in Michigan:',
    abortionLandscapeOutro:
      'Washtenaw County voted 77% in favor of Proposal 3 in 2022 — the strongest pro-abortion-access margin in the state. The abolitionist case here is a minority case, but it is a real one, with a real historical inheritance to draw on.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Ann Arbor?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Ann Arbor city limits. Ann Arbor is home to strong PCA, OPC, and URC congregations — if any have taken a public stand for the abolition of abortion, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Ann Arbor?',
        a: 'Ann Arbor is served by four state House districts and two state Senate districts. Use our Find-my-legislator tool on the scorecard page to look yours up.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Ann Arbor?',
        a: 'Sign the Michigan abolition petition, contact your Ann Arbor state representative through the scorecard, join our Signal group to connect with other Ann Arbor-area abolitionists, and — if your church would adopt the abolition resolution — reach out to us.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Lansing -----------------------------------------------------
  {
    slug: 'lansing',
    name: 'Lansing',
    region: 'Ingham County',
    populationLabel: '~111,000 residents',
    population: 111000,
    latitude: 42.7273,
    longitude: -84.5658,
    houseDistricts: [74, 76, 77],
    senateDistricts: [21, 28],
    historyParagraphs: [
      'Lansing is Michigan\'s state capital and the seat of the state Legislature — the building where every abolition bill that has ever been introduced in this state was written, sponsored, and voted on. The Capitol on Michigan Avenue is where House Bill 4670 (the 2025 equal-protection abolition bill) died in committee. It is where Right to Life of Michigan\'s lobby is headquartered and where Planned Parenthood Advocates does its influence work.',
      'That makes Lansing the most strategically important abolition city in Michigan. Every legislator we grade on the scorecard has a Lansing office. Every rally, every hearing, every committee meeting worth attending happens here. The abolitionist argument doesn\'t win in the abstract — it wins because Christians show up in the capital and press for equal protection until it becomes law.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates inside Lansing city limits, serving the Michigan State University community and the mid-Michigan region:',
    abortionLandscapeOutro:
      'Ingham County voted 72% in favor of Proposal 3 in 2022. That vote is downstream of MSU\'s cultural gravity — and the university itself is the ministry field for every campus outreach in the state.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Lansing?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Lansing city limits. If your Lansing- or East-Lansing-area church has adopted an abolition resolution, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Lansing?',
        a: 'Lansing is served by three state House districts and two state Senate districts. Use our Find-my-legislator tool on the scorecard page. All of your Lansing legislators also work out of the Michigan Capitol just south of downtown.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Lansing?',
        a: 'Lansing is the most action-heavy city in the state. Sign the Michigan abolition petition, contact your Lansing state representative through the scorecard, join our Signal group for capitol rally coordination, and reach out to us if your church would consider adopting the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Dearborn ----------------------------------------------------
  {
    slug: 'dearborn',
    name: 'Dearborn',
    region: 'Wayne County',
    populationLabel: '~109,000 residents',
    population: 109000,
    latitude: 42.3136,
    longitude: -83.2161,
    houseDistricts: [3, 15],
    senateDistricts: [2],
    historyParagraphs: [
      'Dearborn is home to Henry Ford Museum, the Ford Motor Company world headquarters, and the largest Arab-American population in the United States. Ford recruited Lebanese laborers to the Rouge plant in the 1910s; today Dearborn is majority-Arab, with sizable Lebanese, Iraqi, Yemeni, and Palestinian communities. Islamic, Chaldean Catholic, and Maronite Christian congregations sit blocks from one another on Warren Avenue.',
      'That religious composition matters for abolition. The historic Christian teaching on abortion — that the preborn are ensouled human beings from conception — is shared by every ancient Christian tradition represented in Dearborn. Islamic teaching on abortion, though not identical, also grants human status to the fetus early. Dearborn is a city where the argument that abortion takes a human life is already the majority religious position; the abolitionist step is to insist the civil law reflect that consensus.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Dearborn city limits. The closest providers to Dearborn residents are in neighboring Detroit and Livonia (see the nearby-cities strip below).',
    abortionLandscapeOutro:
      'Wayne County voted 68% in favor of Proposal 3 in 2022. The dominant conservative religious ethics of Dearborn\'s Arab-American Christian and Muslim communities suggest a persuadable audience for the abolitionist argument that the state has misread its constitutional obligation to protect the preborn.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Dearborn?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Dearborn city limits. Dearborn is home to Chaldean Catholic, Maronite, Antiochian Orthodox, and Reformed Protestant congregations — if yours has adopted an abolition resolution, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Dearborn?',
        a: 'Dearborn is served by two state House districts and one state Senate district. Use our Find-my-legislator tool on the scorecard page to look yours up by ZIP or address.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Dearborn?',
        a: 'Sign the Michigan abolition petition, contact your Dearborn state representative through the scorecard, join our Signal group, and reach out to us if your church would consider adopting the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Livonia -----------------------------------------------------
  {
    slug: 'livonia',
    name: 'Livonia',
    region: 'Wayne County',
    populationLabel: '~93,000 residents',
    population: 93000,
    latitude: 42.3944,
    longitude: -83.3686,
    houseDistricts: [17, 22],
    senateDistricts: [5, 6],
    historyParagraphs: [
      'Livonia is a large Detroit suburb — the ninth-largest city in Michigan — built out during the postwar auto-industry boom. Its residents work overwhelmingly at Ford, GM, and their supplier network; its politics have historically been Republican-leaning even as neighboring Wayne County cities have shifted Democratic. Livonia\'s civic identity is small-town suburban despite its size: family-owned businesses, dense church attendance, and a strong Catholic parish network.',
      'Livonia sits at the political fault line where an abolitionist case can actually move votes. Its residents span the Reagan-Democrat lane that split on Proposal 3 in 2022, and the Livonia-area religious infrastructure — from St. Aidan and St. Michael to independent Bible churches — is broad and dense. The abolitionist argument here has a real audience.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates inside Livonia city limits, on the boundary between Farmington and Plymouth Roads:',
    abortionLandscapeOutro:
      'Wayne County voted 68% in favor of Proposal 3 in 2022, but Livonia\'s specific precincts split more evenly — the city is on the boundary between Wayne County\'s pro-Prop-3 core and Oakland/Washtenaw\'s split suburbs.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Livonia?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Livonia city limits. Livonia has a dense Catholic parish network + independent Bible churches — if yours has taken a public stand for abolition, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Livonia?',
        a: 'Livonia is served by two state House districts and two state Senate districts. Use our Find-my-legislator tool on the scorecard page to look yours up.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Livonia?',
        a: 'Sign the Michigan abolition petition, contact your Livonia state representative through the scorecard, join our Signal group, and reach out to us if your church would consider adopting the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Troy --------------------------------------------------------
  {
    slug: 'troy',
    name: 'Troy',
    region: 'Oakland County',
    populationLabel: '~87,000 residents',
    population: 87000,
    latitude: 42.5805,
    longitude: -83.1481,
    houseDistricts: [56],
    senateDistricts: [9],
    historyParagraphs: [
      'Troy is one of the wealthiest cities in Michigan, an Oakland County suburb built around the Somerset Collection, Kellogg Park, and a Big-Three engineering-and-management workforce. Its residents include large Chaldean Christian, Indian Hindu and Christian, and Chinese communities, along with a well-established secular professional class. Politically it has trended purple in recent cycles: Democratic in presidential races, Republican for local council seats.',
      'Troy\'s religious composition mirrors Sterling Heights\' Chaldean strength — several of the largest Chaldean Catholic parishes in the diaspora meet here. The Chaldean church\'s ancient position on abortion (against, without exception) puts a large fraction of Troy\'s Christian residents in natural sympathy with the abolition case, even where their political voting has diverged from that theology.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Troy city limits. The closest providers to Troy residents are in Sterling Heights and Warren (see the nearby-cities strip below).',
    abortionLandscapeOutro:
      'Oakland County voted 62% in favor of Proposal 3 in 2022. Troy specifically was closer to 55%, one of the more competitive suburbs in the county — an audience with room for a serious abolition argument.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Troy?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Troy city limits. Troy hosts several of the largest Chaldean Catholic parishes in the country — if any have taken a public stand for abolition, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Troy?',
        a: 'Troy is served by one state House district and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Troy?',
        a: 'Sign the Michigan abolition petition, contact your Troy state representative through the scorecard, join our Signal group, and reach out to us if your church would consider adopting the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Westland ----------------------------------------------------
  {
    slug: 'westland',
    name: 'Westland',
    region: 'Wayne County',
    populationLabel: '~84,000 residents',
    population: 84000,
    latitude: 42.3124,
    longitude: -83.3766,
    houseDistricts: [25, 26],
    senateDistricts: [5],
    historyParagraphs: [
      'Westland is a working-class Detroit suburb west of Dearborn, part of the postwar auto-industry ring. Named after the Westland Center shopping mall when it incorporated in 1966, the city has a large Union-Democrat electorate that has trended Republican in national races since 2016. Its churches lean evangelical, Catholic, and Missouri-Synod Lutheran — theologically-conservative traditions that hold historic pro-life positions.',
      'Westland is home to Northland Family Planning\'s Westland location on Ford Road — one of the highest-volume abortion facilities in metro Detroit. That the city hosts a major abortion provider despite its working-class Christian composition is exactly the pattern the abolitionist argument exists to answer: private conviction and public law have diverged, and the law needs to be brought back into line.',
    ],
    abortionLandscapeIntro:
      'One high-volume abortion facility operates inside Westland city limits:',
    abortionLandscapeOutro:
      'Wayne County voted 68% in favor of Proposal 3 in 2022 — a vote that put the constitutional protection of preborn Michiganders out of reach through the ordinary democratic process. Abolition insists that some questions of justice are prior to the ballot.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Westland?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Westland city limits. Westland has a dense Catholic + LCMS + evangelical church network — if yours has taken a public stand for abolition, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Westland?',
        a: 'Westland is served by two state House districts and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Westland?',
        a: 'Sign the Michigan abolition petition, contact your Westland state representative through the scorecard, join our Signal group, and reach out to us if your church would consider adopting the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Farmington Hills -------------------------------------------
  {
    slug: 'farmington-hills',
    name: 'Farmington Hills',
    region: 'Oakland County',
    populationLabel: '~83,000 residents',
    population: 83000,
    latitude: 42.4847,
    longitude: -83.3812,
    houseDistricts: [18, 19, 21],
    senateDistricts: [6, 13],
    historyParagraphs: [
      'Farmington Hills is a well-established Oakland County suburb, one of the wealthiest cities in Michigan by median household income. It hosts a substantial Jewish community with several major synagogues, along with strong Catholic, mainline Protestant, and Reformed congregations. Its politics lean Democratic in most cycles, with Republican pockets in the older-development neighborhoods.',
      'The Jewish teaching on abortion in Farmington Hills is not monolithic — the Orthodox community is unambiguously pro-life, while the Conservative and Reform movements have taken varying positions. The abolitionist argument in Farmington Hills is a religious one — an insistence that a preborn Jewish, Christian, or Muslim life is a life the civil law must protect — and it finds real theological allies here even where the political tide runs against it.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Farmington Hills city limits. The closest providers are in Livonia, Southfield-adjacent (WCM), and Sterling Heights (see the nearby-cities strip below).',
    abortionLandscapeOutro:
      'Oakland County voted 62% in favor of Proposal 3 in 2022. Farmington Hills was slightly above the county average — a challenging environment for the abolitionist argument, but one where the strong Orthodox Jewish and confessional-Christian pockets make the case still worth pressing.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Farmington Hills?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Farmington Hills city limits. If your Farmington Hills church has adopted an abolition resolution, reach out — we\'d also welcome contact from Orthodox Jewish congregations aligned with this cause.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Farmington Hills?',
        a: 'Farmington Hills is served by three state House districts and two state Senate districts. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Farmington Hills?',
        a: 'Sign the Michigan abolition petition, contact your Farmington Hills state representative through the scorecard, join our Signal group, and reach out to us if your church would consider adopting the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Flint -------------------------------------------------------
  {
    slug: 'flint',
    name: 'Flint',
    region: 'Genesee County',
    populationLabel: '~79,000 residents',
    population: 79000,
    latitude: 43.0362,
    longitude: -83.7013,
    houseDistricts: [69, 70],
    senateDistricts: [27],
    historyParagraphs: [
      'Flint is the birthplace of General Motors and — for most of the 20th century — one of the wealthiest per-capita cities in America. The post-war collapse of the auto industry hollowed out its economy; the 2014 water crisis, in which Governor Snyder\'s emergency manager switched Flint\'s municipal water source to the untreated Flint River and lead leached into 100,000 residents\' drinking water, cemented the city as a case study in how the state can fail its most vulnerable.',
      'That history matters for abolition. Flint is a majority-Black, working-class city whose residents have felt firsthand what happens when the state decides some lives are cheaper to lose than to protect. The abolitionist case for the preborn is a case for equal protection under the law — the same principle Flint has spent a decade demanding for its own children. Abortion facilities disproportionately locate in and serve communities like Flint\'s. Ending abortion is a justice issue for Flint specifically.',
    ],
    abortionLandscapeIntro:
      'Two abortion facilities operate inside Flint city limits — a high provider density for a city of its size:',
    abortionLandscapeOutro:
      'Genesee County voted 63% in favor of Proposal 3 in 2022. Flint\'s Black-majority Christian churches — historically the most theologically-conservative constituency on abortion in Michigan — are a natural coalition audience for the abolitionist argument.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Flint?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Flint city limits. Flint has a large Black-Baptist / AME / COGIC network — if your Flint-area church has taken a public stand for abolition, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Flint?',
        a: 'Flint is served by two state House districts and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Flint?',
        a: 'Sign the Michigan abolition petition, contact your Flint state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Wyoming -----------------------------------------------------
  {
    slug: 'wyoming',
    name: 'Wyoming',
    region: 'Kent County',
    populationLabel: '~78,000 residents',
    population: 78000,
    latitude: 42.8897,
    longitude: -85.7090,
    houseDistricts: [80, 83, 84],
    senateDistricts: [29],
    historyParagraphs: [
      'Wyoming is the largest suburb of Grand Rapids, sitting directly south of the city and sharing its Dutch Reformed civic inheritance. Its neighborhoods run from working-class near 28th Street to the leafy affluence of the Byron Center border. The Christian Reformed Church of North America (CRC) and Reformed Church in America (RCA) both maintain a dense congregational presence throughout the city.',
      'Wyoming\'s religious identity carries the historic Reformed teaching that human life begins at conception and is a gift of God. The gap between that teaching and Michigan\'s post-Proposal-3 constitutional protection of abortion is the exact gap the abolitionist argument exists to close. In a city where nearly every neighborhood has a CRC or RCA church within walking distance, abolition is a natural next-step for a movement already latent in the pulpits.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Wyoming city limits. The closest provider is Planned Parenthood\'s Irwin/Martin Health Center on Cherry Street in neighboring Grand Rapids (see the nearby-cities strip below).',
    abortionLandscapeOutro:
      'Kent County voted 62% in favor of Proposal 3 in 2022. Wyoming\'s precincts specifically split more evenly than the county as a whole — the city\'s dense Reformed and working-class Catholic churches are a persuadable audience.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Wyoming?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Wyoming city limits, though the city is home to many CRC/RCA congregations. If your Wyoming church has adopted an abolition resolution, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Wyoming?',
        a: 'Wyoming is served by three state House districts and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Wyoming?',
        a: 'Sign the Michigan abolition petition, contact your Wyoming state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Southfield --------------------------------------------------
  {
    slug: 'southfield',
    name: 'Southfield',
    region: 'Oakland County',
    populationLabel: '~76,000 residents',
    population: 76000,
    latitude: 42.4828,
    longitude: -83.2541,
    houseDistricts: [18, 19],
    senateDistricts: [7],
    historyParagraphs: [
      'Southfield is the corporate anchor of Oakland County — home to the world headquarters of Lear, Learjet\'s namesake fleet lessor Federal-Mogul, and dozens of Fortune-500 regional offices. It is also home to a strong Black professional class, one of the largest Chaldean populations in Michigan, and a substantial Orthodox Jewish community centered around Congregation Shomrey Emunah and Adat Shalom.',
      'That religious diversity concentrates natural allies for the abolition case. The Chaldean and Orthodox Jewish communities are theologically unambiguous that human life begins at conception. The Black-Baptist and Reformed Presbyterian congregations across the city hold the same position. Southfield hosts the largest single-provider abortion facility in the state (Northland Family Planning) — the exact concentration of religious anti-abortion witness and industrial-scale abortion provision that makes it a strategic abolition city.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates inside Southfield city limits — the largest single-provider abortion facility in the state of Michigan:',
    abortionLandscapeOutro:
      'Oakland County voted 62% in favor of Proposal 3 in 2022. Southfield\'s Chaldean Catholic and Orthodox Jewish communities voted against it in significant numbers — a reminder that the historic religious traditions represented in Southfield are natural coalition partners for abolition.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Southfield?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Southfield city limits. Southfield hosts Southfield Reformed Presbyterian Church (RPCNA), several Chaldean Catholic parishes, and Orthodox Jewish congregations. If yours has taken a public stand for the abolition of abortion, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Southfield?',
        a: 'Southfield is served by two state House districts and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Southfield?',
        a: 'Sign the Michigan abolition petition, contact your Southfield state representative through the scorecard, join our Signal group, and reach out to us if your church would consider adopting the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Rochester Hills --------------------------------------------
  {
    slug: 'rochester-hills',
    name: 'Rochester Hills',
    region: 'Oakland County',
    populationLabel: '~76,000 residents',
    population: 76000,
    latitude: 42.6827,
    longitude: -83.1543,
    houseDistricts: [55, 66],
    senateDistricts: [9],
    historyParagraphs: [
      'Rochester Hills is a wealthy, historically-Republican Oakland County suburb — a bedroom community for the auto-industry engineering class and the professional families of Rochester and Auburn Hills. Home to Oakland University\'s campus and a dense network of confessional Reformed, evangelical, and Catholic congregations, its civic identity mixes engineering, education, and old-line Midwest Protestantism.',
      'Rochester Hills\' political character has drifted more purple in recent cycles but its religious institutions remain among the most theologically-anti-abortion in southeast Michigan. Its OPC/PCA/URCNA churches, the RC parishes of the Rochester deanery, and the LCMS congregations all hold pro-life doctrine as core teaching. Abolition is the logical step from that doctrine into civil law — and the argument has a real audience here.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Rochester Hills city limits. The closest providers to Rochester Hills residents are in Sterling Heights and Warren (see the nearby-cities strip below).',
    abortionLandscapeOutro:
      'Oakland County voted 62% in favor of Proposal 3 in 2022. Rochester Hills specifically was closer to 55% — one of the more persuadable suburbs in the county.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Rochester Hills?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Rochester Hills city limits. If your Rochester Hills church has taken a public stand for the abolition of abortion, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Rochester Hills?',
        a: 'Rochester Hills is served by two state House districts and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Rochester Hills?',
        a: 'Sign the Michigan abolition petition, contact your Rochester Hills state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Kalamazoo ---------------------------------------------------
  {
    slug: 'kalamazoo',
    name: 'Kalamazoo',
    region: 'Kalamazoo County',
    populationLabel: '~74,000 residents',
    population: 74000,
    latitude: 42.2884,
    longitude: -85.5963,
    houseDistricts: [40, 41, 42],
    senateDistricts: [19],
    historyParagraphs: [
      'Kalamazoo is home to Western Michigan University, Kalamazoo College, and the Kalamazoo Promise — the anonymously-funded scholarship that pays college tuition for every graduate of Kalamazoo Public Schools. Its civic identity blends college-town liberalism with a deep vein of confessional Reformed Christianity through the Christian Reformed Church and the Bible-Baptist network across Portage and Comstock.',
      'Kalamazoo\'s dual identity — WMU\'s pro-choice mainstream and the CRC-Bible-church coalition\'s historic anti-abortion witness — makes it one of Michigan\'s more polarized cities on this question. The abolitionist argument here has to speak into a genuinely-divided audience, which is exactly the audience where the biblical and constitutional case makes the most difference.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates inside Kalamazoo city limits, serving the Kalamazoo/Battle Creek region:',
    abortionLandscapeOutro:
      'Kalamazoo County voted 68% in favor of Proposal 3 in 2022 — one of the higher pro-Prop-3 margins in West Michigan, driven by WMU\'s student population.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Kalamazoo?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Kalamazoo city limits. CityGate Church in nearby Portage is on the postmillennial abolitionist network — see the partners page for the national coalition. If your Kalamazoo church has taken a public stand, reach out.',
        links: [
          { phrase: 'partners page', href: '/partners' },
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Kalamazoo?',
        a: 'Kalamazoo is served by three state House districts and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Kalamazoo?',
        a: 'Sign the Michigan abolition petition, contact your Kalamazoo state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Novi --------------------------------------------------------
  {
    slug: 'novi',
    name: 'Novi',
    region: 'Oakland County',
    populationLabel: '~67,000 residents',
    population: 67000,
    latitude: 42.4777,
    longitude: -83.4858,
    houseDistricts: [21],
    senateDistricts: [13],
    historyParagraphs: [
      'Novi is the fastest-growing city in Oakland County — a Twelve-Mile-corridor suburb that grew from a rural township of 10,000 in 1970 to a wealthy commercial hub of nearly 70,000 today. It hosts Twelve Oaks Mall, the Suburban Collection Showplace, and the largest Muslim-American population in Michigan outside of Dearborn, along with substantial Indian-American, Korean, and Chinese communities.',
      'Novi\'s religious composition is a mosaic — Islamic Center of Detroit-Novi, several major Hindu temples, Korean and Chinese Presbyterian churches, Catholic parishes, and evangelical mega-churches. The historic pro-life teaching in Islam, Hinduism, Catholicism, and confessional Protestantism all converge here, making Novi a strategically important city for coalition-building on abolition.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Novi city limits. The closest providers to Novi residents are in Southfield, Livonia, and Farmington Hills-adjacent (see the nearby-cities strip below).',
    abortionLandscapeOutro:
      'Oakland County voted 62% in favor of Proposal 3 in 2022. Novi specifically was around 60% — persuadable, especially given the diverse religious traditions represented in the city that all teach against abortion.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Novi?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Novi city limits. If your Novi church has adopted an abolition resolution, reach out — we\'d also welcome contact from Novi\'s Islamic, Hindu, and Reformed congregations aligned with this cause.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Novi?',
        a: 'Novi is served by one state House district and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Novi?',
        a: 'Sign the Michigan abolition petition, contact your Novi state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Taylor ------------------------------------------------------
  {
    slug: 'taylor',
    name: 'Taylor',
    region: 'Wayne County',
    populationLabel: '~63,000 residents',
    population: 63000,
    latitude: 42.2317,
    longitude: -83.2673,
    houseDistricts: [29],
    senateDistricts: [1],
    historyParagraphs: [
      'Taylor is a downriver Detroit suburb — one of the classic postwar working-class cities south of the Rouge River, populated by generations of Ford Motor Company assembly-line families. Politically it swings; culturally it is unabashedly Reagan-Democrat: union households that vote Republican for president and Democrat for local government. Its churches are predominantly Catholic, LCMS Lutheran, and evangelical Baptist.',
      'Downriver Wayne County — Taylor especially — is exactly the kind of place where the abolitionist argument has to be made in plain, working-class terms. The people here have never accepted the pro-choice framework; what they have accepted is the mainstream pro-life strategy of incremental restrictions. The abolitionist case invites them to something further: the recognition that abortion is homicide and must be treated as such.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Taylor city limits. The closest providers to Taylor residents are in Westland (Northland) and Detroit (see the nearby-cities strip below).',
    abortionLandscapeOutro:
      'Wayne County voted 68% in favor of Proposal 3 in 2022. Downriver precincts (including Taylor) voted closer to 60% — one of the more persuadable pockets of Wayne County.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Taylor?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Taylor city limits. Zion Baptist Church in Taylor is on the NXR confessional Reformed directory but has not (as far as we know) publicly adopted an abolition resolution. If your Taylor-area church has, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Taylor?',
        a: 'Taylor is served by one state House district and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Taylor?',
        a: 'Sign the Michigan abolition petition, contact your Taylor state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Dearborn Heights -------------------------------------------
  {
    slug: 'dearborn-heights',
    name: 'Dearborn Heights',
    region: 'Wayne County',
    populationLabel: '~63,000 residents',
    population: 63000,
    latitude: 42.3060,
    longitude: -83.2735,
    houseDistricts: [15],
    senateDistricts: [2],
    historyParagraphs: [
      'Dearborn Heights sits west of Dearborn along Ford Road and Warren Avenue — a working- and middle-class suburb built alongside the auto-industry boom of the 1950s and 60s. Its population today is roughly a third Arab-American (Lebanese, Iraqi Chaldean, and Yemeni), with substantial Polish-Catholic, Ukrainian-Orthodox, and evangelical Protestant communities.',
      'The historic Christian and Islamic teachings on abortion converge in Dearborn Heights: the preborn are ensouled human beings deserving of protection. The abolitionist argument is that civil law must reflect this shared moral conviction rather than defer to an atomistic "right to choose" framework alien to every ancient tradition present in the city.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Dearborn Heights city limits. The closest providers are in Detroit, Livonia, and Westland (see the nearby-cities strip below).',
    abortionLandscapeOutro:
      'Wayne County voted 68% in favor of Proposal 3 in 2022. Dearborn Heights split closer to the Wayne County average, with Arab-American precincts voting more against Prop 3 than Wayne County as a whole.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Dearborn Heights?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Dearborn Heights city limits. If your Dearborn Heights church — Catholic, Orthodox, evangelical, or otherwise — has adopted an abolition resolution, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Dearborn Heights?',
        a: 'Dearborn Heights is served by one state House district and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Dearborn Heights?',
        a: 'Sign the Michigan abolition petition, contact your Dearborn Heights state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Pontiac -----------------------------------------------------
  {
    slug: 'pontiac',
    name: 'Pontiac',
    region: 'Oakland County',
    populationLabel: '~61,000 residents',
    population: 61000,
    latitude: 42.6471,
    longitude: -83.2909,
    houseDistricts: [53],
    senateDistricts: [7],
    historyParagraphs: [
      'Pontiac was, for the better part of the 20th century, the manufacturing heart of General Motors — home to the Pontiac division, Fisher Body, and the enormous factories that employed 90,000 people at their peak. The industry\'s collapse left Pontiac one of Michigan\'s poorest cities per capita, with a majority-Black population, a shrinking tax base, and a churn of state-imposed emergency managers throughout the 2010s.',
      'Pontiac\'s Black church network — historic AME, COGIC, and Baptist congregations dating back to the Great Migration — has always held that abortion disproportionately harms Black communities and Black babies. The abolitionist framing, that abortion is homicide and Black lives are equally protected by law, is the natural theological and civil-rights extension of that conviction.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Pontiac city limits. The closest providers to Pontiac residents are in Southfield (Northland) and Sterling Heights (see the nearby-cities strip below).',
    abortionLandscapeOutro:
      'Oakland County voted 62% in favor of Proposal 3 in 2022. Pontiac\'s Black-majority precincts split closer to 55% — the Black-church network\'s historic opposition to abortion is visible in that number.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Pontiac?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Pontiac city limits. Pontiac has a large historic Black-Baptist / AME / COGIC network — if your Pontiac church has adopted an abolition resolution, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Pontiac?',
        a: 'Pontiac is served by one state House district and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Pontiac?',
        a: 'Sign the Michigan abolition petition, contact your Pontiac state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Royal Oak ---------------------------------------------------
  {
    slug: 'royal-oak',
    name: 'Royal Oak',
    region: 'Oakland County',
    populationLabel: '~59,000 residents',
    population: 59000,
    latitude: 42.5048,
    longitude: -83.1468,
    houseDistricts: [6, 56],
    senateDistricts: [8],
    historyParagraphs: [
      'Royal Oak is Woodward Corridor\'s hip nightlife center — a dense, walkable, historically-artist-and-professional suburb where the Detroit Zoo has stood since 1928 and the annual Woodward Dream Cruise rolls past 40,000-strong crowds every August. Its politics run steadily Democratic; its churches are a mix of Catholic (Shrine of the Little Flower — Fr. Charles Coughlin\'s controversial 1930s radio parish), mainline Protestant (Royal Oak First United Methodist), and PCA-adjacent (New City Presbyterian).',
      'Royal Oak\'s dominant political direction is not naturally friendly to the abolitionist argument. But the confessional Christian congregations here have never accepted the pro-choice framework, and New City Presbyterian in particular has a track record of clear pro-life teaching. The abolition case in Royal Oak is a case for the church against the culture.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Royal Oak city limits. The closest provider is Northland Family Planning in neighboring Southfield (see the nearby-cities strip below).',
    abortionLandscapeOutro:
      'Oakland County voted 62% in favor of Proposal 3 in 2022. Royal Oak specifically voted much higher — around 78% — one of the most pro-Prop-3 cities outside Ann Arbor and Ypsilanti.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Royal Oak?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Royal Oak city limits. Royal Oak hosts New City Presbyterian Church (PCA) and Shrine of the Little Flower (Catholic) — if your Royal Oak church has adopted an abolition resolution, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Royal Oak?',
        a: 'Royal Oak is served by two state House districts and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Royal Oak?',
        a: 'Sign the Michigan abolition petition, contact your Royal Oak state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- St. Clair Shores ----------------------------------
  {
    slug: 'st-clair-shores',
    name: 'St. Clair Shores',
    region: 'Macomb County',
    populationLabel: '~58,000 residents',
    population: 58000,
    latitude: 42.4972,
    longitude: -82.8951,
    houseDistricts: [12, 13, 62],
    senateDistricts: [12],
    historyParagraphs: [
      'St. Clair Shores is Michigan\'s ninth-largest city on the Lake St. Clair shoreline — a postwar Macomb County suburb built around the boating industry and named for its 15 miles of lakefront. The city is politically Republican-leaning in local races but sends Democrats to the state Legislature, a classic Reagan-Democrat pattern.',
      'The Catholic parish network here is dense — St. Joan of Arc, St. Isaac Jogues, St. Margaret of Scotland — and holds the historic teaching that abortion is intrinsically evil. The distance between that pulpit teaching and the state\'s post-Prop-3 constitutional protection of abortion is the gap the abolitionist argument exists to close.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside St. Clair Shores city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in St. Clair Shores?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside St. Clair Shores city limits. If your St. Clair Shores-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in St. Clair Shores?',
        a: 'St. Clair Shores is served by 3 state House districts and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in St. Clair Shores?',
        a: 'Sign the Michigan abolition petition, contact your St. Clair Shores state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Kentwood ------------------------------------------
  {
    slug: 'kentwood',
    name: 'Kentwood',
    region: 'Kent County',
    populationLabel: '~54,000 residents',
    population: 54000,
    latitude: 42.9177,
    longitude: -85.5926,
    houseDistricts: [80, 81, 82],
    senateDistricts: [29, 30],
    historyParagraphs: [
      'Kentwood is a Grand Rapids suburb built out through the 1960s-90s auto-industry-adjacent boom, now one of the most ethnically diverse cities in West Michigan with substantial Bosnian, Vietnamese, Congolese, and Nepali populations alongside the historic Dutch Reformed core.',
      'That diversity concentrates ancient Christian anti-abortion witness across denominations — CRC / RCA / Catholic / Orthodox / evangelical — in a city where the pulpit teaching aligns almost universally against abortion. Abolition is the logical civic expression of that shared conviction.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Kentwood city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Kentwood?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Kentwood city limits. If your Kentwood-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Kentwood?',
        a: 'Kentwood is served by 3 state House districts and 2 state Senate districts. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Kentwood?',
        a: 'Sign the Michigan abolition petition, contact your Kentwood state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Battle Creek --------------------------------------
  {
    slug: 'battle-creek',
    name: 'Battle Creek',
    region: 'Calhoun County',
    populationLabel: '~52,000 residents',
    population: 52000,
    latitude: 42.3208,
    longitude: -85.1855,
    houseDistricts: [44, 45],
    senateDistricts: [18],
    historyParagraphs: [
      'Battle Creek is Cereal City — the birthplace of Kellogg\'s and Post, both founded here in the late 1800s by figures with Seventh-day Adventist roots. The Adventist and Methodist traditions in Battle Creek have deep historical influence over the city\'s civic character.',
      'The historic SDA teaching on abortion is that it is contrary to God\'s plan for human life; the mainline Methodist position has drifted, but Battle Creek\'s African Methodist Episcopal (AME) congregations remain strongly pro-life. The abolitionist argument here has an audience across traditions that agree on the personhood of the preborn.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Battle Creek city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Battle Creek?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Battle Creek city limits. If your Battle Creek-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Battle Creek?',
        a: 'Battle Creek is served by 2 state House districts and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Battle Creek?',
        a: 'Sign the Michigan abolition petition, contact your Battle Creek state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Portage -------------------------------------------
  {
    slug: 'portage',
    name: 'Portage',
    region: 'Kalamazoo County',
    populationLabel: '~48,000 residents',
    population: 48000,
    latitude: 42.1956,
    longitude: -85.5917,
    houseDistricts: [40],
    senateDistricts: [19],
    historyParagraphs: [
      'Portage is Kalamazoo\'s largest suburb, home to Stryker Corporation, Pfizer\'s Kalamazoo campus, and the Air Zoo aviation museum. Its churches include CityGate Church (on the postmillennial-network AAM Partners page), several major Reformed congregations, and a strong Catholic parish network.',
      'Portage\'s postmillennial-adjacent CityGate presence is exactly the kind of nucleus around which local abolition coalitions form. See the partners page for the broader national network.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Portage city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Portage?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Portage city limits. If your Portage-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Portage?',
        a: 'Portage is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Portage?',
        a: 'Sign the Michigan abolition petition, contact your Portage state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Roseville -----------------------------------------
  {
    slug: 'roseville',
    name: 'Roseville',
    region: 'Macomb County',
    populationLabel: '~47,000 residents',
    population: 47000,
    latitude: 42.5034,
    longitude: -82.9387,
    houseDistricts: [13],
    senateDistricts: [11],
    historyParagraphs: [
      'Roseville is a working-class Macomb County inner-ring suburb — a Detroit-Metro city built on the auto industry, home to Macomb Community College\'s south campus and the Macomb Mall. Politically it splits — trending Republican in presidential races since 2016, still sending Democrats to Lansing.',
      'The dominant religious traditions in Roseville — Catholic, LCMS Lutheran, and evangelical Baptist — all teach against abortion. The abolitionist case here is a case for aligning private conviction with public law.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Roseville city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Roseville?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Roseville city limits. If your Roseville-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Roseville?',
        a: 'Roseville is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Roseville?',
        a: 'Sign the Michigan abolition petition, contact your Roseville state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- East Lansing --------------------------------------
  {
    slug: 'east-lansing',
    name: 'East Lansing',
    region: 'Ingham County',
    populationLabel: '~47,000 residents',
    population: 47000,
    latitude: 42.7335,
    longitude: -84.4823,
    houseDistricts: [73, 75],
    senateDistricts: [28],
    historyParagraphs: [
      'East Lansing is Michigan State University\'s home — a college town whose politics are shaped by the university\'s 50,000-student population and its progressive Big Ten-flagship faculty. The city\'s dominant political culture runs deep-Democratic, but its confessional-Christian congregations (PCA, LCMS, Catholic) hold the historic pro-life teaching without compromise.',
      'East Lansing is exactly the audience the abolitionist argument was built to reach — university-educated professionals who take theology seriously and hear the biblical case for the personhood of the preborn as a substantive argument rather than a slogan.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside East Lansing city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in East Lansing?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside East Lansing city limits. If your East Lansing-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in East Lansing?',
        a: 'East Lansing is served by 2 state House districts and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in East Lansing?',
        a: 'Sign the Michigan abolition petition, contact your East Lansing state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Saginaw -------------------------------------------
  {
    slug: 'saginaw',
    name: 'Saginaw',
    region: 'Saginaw County',
    populationLabel: '~44,000 residents',
    population: 44000,
    latitude: 43.4392,
    longitude: -83.9606,
    houseDistricts: [94],
    senateDistricts: [35],
    historyParagraphs: [
      'Saginaw was the world\'s leading lumber city in the 1870s and later a major GM manufacturing hub. The industry\'s collapse left it one of the state\'s poorest cities per capita, majority-Black, with a long history of investment from the Black church network — AME, COGIC, Baptist — that anchors its civic life.',
      'Saginaw\'s Black-church coalition has historically held the pro-life position and understood abortion\'s disproportionate impact on Black communities. The abolitionist argument extends that conviction into civil-rights terms: equal protection under the law for the smallest class of Black lives.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates inside Saginaw city limits:',
    faqs: [
      {
        q: 'Are there abolitionist churches in Saginaw?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Saginaw city limits. If your Saginaw-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Saginaw?',
        a: 'Saginaw is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Saginaw?',
        a: 'Sign the Michigan abolition petition, contact your Saginaw state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Midland -------------------------------------------
  {
    slug: 'midland',
    name: 'Midland',
    region: 'Midland County',
    populationLabel: '~42,000 residents',
    population: 42000,
    latitude: 43.6376,
    longitude: -84.233,
    houseDistricts: [95],
    senateDistricts: [35],
    historyParagraphs: [
      'Midland is the world headquarters of Dow Chemical — the city was built by Dow in the early 20th century, and its civic and philanthropic life is still shaped by the company. The Midland Center for the Arts, the Dow Gardens, and the Herbert H. and Grace A. Dow Foundation all descend from that industrial legacy.',
      'Midland is a wealthy, Republican-leaning city with a dense Catholic and evangelical Protestant church network. The abolitionist argument has natural traction here — the theology aligns and the political culture is open to it.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Midland city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Midland?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Midland city limits. If your Midland-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Midland?',
        a: 'Midland is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Midland?',
        a: 'Sign the Michigan abolition petition, contact your Midland state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Muskegon ------------------------------------------
  {
    slug: 'muskegon',
    name: 'Muskegon',
    region: 'Muskegon County',
    populationLabel: '~38,000 residents',
    population: 38000,
    latitude: 43.2272,
    longitude: -86.2379,
    houseDistricts: [87, 89],
    senateDistricts: [32],
    historyParagraphs: [
      'Muskegon is the largest Lake Michigan port on the west side of the state — historically a lumber-and-foundry town, now Michigan\'s Adventure amusement park and the West Michigan cruise ship terminal. The city is majority-white, working-class, and has a strong Reformed / Christian Reformed presence alongside a substantial Black Baptist community.',
      'Muskegon\'s church network — CRC, RCA, Baptist, and Catholic — is uniformly against abortion. What\'s missing is the political coalition that translates that pulpit consensus into civic law. Abolition is the framework that translation requires.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Muskegon city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Muskegon?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Muskegon city limits. If your Muskegon-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Muskegon?',
        a: 'Muskegon is served by 2 state House districts and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Muskegon?',
        a: 'Sign the Michigan abolition petition, contact your Muskegon state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Holland -------------------------------------------
  {
    slug: 'holland',
    name: 'Holland',
    region: 'Ottawa County',
    populationLabel: '~34,000 residents',
    population: 34000,
    latitude: 42.7913,
    longitude: -86.1295,
    houseDistricts: [86],
    senateDistricts: [31],
    historyParagraphs: [
      'Holland is the most densely Dutch-Reformed city in America outside the Netherlands. The Christian Reformed Church, Reformed Church in America, and Netherlands Reformed traditions all have their strongest concentrations here. Hope College (RCA-affiliated) and Western Theological Seminary anchor its intellectual life; Tulip Time festival is its annual civic showpiece.',
      'Holland\'s confessional Reformed theology is unambiguous on the personhood of the preborn from conception. The abolitionist case is the logical extension — that civil law must reflect what the pulpits already teach — and Holland is one of the cities in Michigan where that argument has the deepest theological reception.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Holland city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Holland?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Holland city limits. If your Holland-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Holland?',
        a: 'Holland is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Holland?',
        a: 'Sign the Michigan abolition petition, contact your Holland state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Bay City ------------------------------------------
  {
    slug: 'bay-city',
    name: 'Bay City',
    region: 'Bay County',
    populationLabel: '~32,000 residents',
    population: 32000,
    latitude: 43.5954,
    longitude: -83.9155,
    houseDistricts: [96],
    senateDistricts: [35],
    historyParagraphs: [
      'Bay City is the Saginaw Bay port that made Michigan\'s 19th-century lumber trade possible — a working-class Great Lakes shipping town whose civic identity remains tied to Ford and Dow-Chemical-adjacent manufacturing. Home of Madonna\'s actual birthplace and the annual Bay City Fireworks.',
      'The Catholic parish network here — St. Stanislaus, All Saints, Our Lady of Consolation — is dense and historically strong. The abolitionist argument fits the city\'s working-class Catholic conservatism, where the church has always taught what the state has refused to enact.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Bay City city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Bay City?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Bay City city limits. If your Bay City-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Bay City?',
        a: 'Bay City is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Bay City?',
        a: 'Sign the Michigan abolition petition, contact your Bay City state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Jackson -------------------------------------------
  {
    slug: 'jackson',
    name: 'Jackson',
    region: 'Jackson County',
    populationLabel: '~31,000 residents',
    population: 31000,
    latitude: 42.249,
    longitude: -84.403,
    houseDistricts: [46],
    senateDistricts: [14],
    historyParagraphs: [
      'Jackson is the birthplace of the Republican Party — the first Republican convention was held here in 1854, under the oaks now marked at the corner of 2nd and Franklin. The city was founded on the anti-slavery abolition argument that later carried Lincoln to the presidency. That inheritance is Jackson\'s most important civic identity.',
      'Abolish Abortion Michigan stands in the same tradition that Jackson helped found. The 1854 Republican Party existed because ordinary Michigan Christians refused to accept that slavery was settled law. The abolition of abortion asks the same conviction of Jackson\'s residents today — and no city in Michigan has a stronger historical reason to make that case.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Jackson city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Jackson?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Jackson city limits. If your Jackson-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Jackson?',
        a: 'Jackson is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Jackson?',
        a: 'Sign the Michigan abolition petition, contact your Jackson state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Southgate -----------------------------------------
  {
    slug: 'southgate',
    name: 'Southgate',
    region: 'Wayne County',
    populationLabel: '~30,000 residents',
    population: 30000,
    latitude: 42.2044,
    longitude: -83.1999,
    houseDistricts: [27],
    senateDistricts: [4],
    historyParagraphs: [
      'Southgate is a downriver Detroit suburb built alongside the auto industry — home to Southgate Community Schools, the Southgate Anderson High football tradition, and a working-class Reagan-Democrat electorate similar to Taylor and Wyandotte.',
      'The Catholic and LCMS Lutheran churches here hold the historic pro-life teaching. The abolitionist argument speaks to Southgate residents in the plain-terms working-class case for the personhood of the preborn.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Southgate city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Southgate?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Southgate city limits. If your Southgate-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Southgate?',
        a: 'Southgate is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Southgate?',
        a: 'Sign the Michigan abolition petition, contact your Southgate state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Madison Heights -----------------------------------
  {
    slug: 'madison-heights',
    name: 'Madison Heights',
    region: 'Oakland County',
    populationLabel: '~30,000 residents',
    population: 30000,
    latitude: 42.5016,
    longitude: -83.1027,
    houseDistricts: [14],
    senateDistricts: [3],
    historyParagraphs: [
      'Madison Heights is a small, dense inner-ring Oakland County suburb north of Detroit — home to the Oakland Mall, a strong Vietnamese community centered around John R Road\'s Little Saigon, and a mix of postwar Catholic and evangelical churches.',
      'The Catholic parish network here — including St. Vincent Ferrer — teaches the historic anti-abortion position. Madison Heights\' Vietnamese-American Catholic community adds another confessional voice to the coalition.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Madison Heights city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Madison Heights?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Madison Heights city limits. If your Madison Heights-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Madison Heights?',
        a: 'Madison Heights is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Madison Heights?',
        a: 'Sign the Michigan abolition petition, contact your Madison Heights state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Port Huron ----------------------------------------
  {
    slug: 'port-huron',
    name: 'Port Huron',
    region: 'St. Clair County',
    populationLabel: '~28,000 residents',
    population: 28000,
    latitude: 42.9958,
    longitude: -82.4599,
    houseDistricts: [64],
    senateDistricts: [25],
    historyParagraphs: [
      'Port Huron is the Blue Water Bridge to Canada — Michigan\'s easternmost city, at the mouth of Lake Huron. Its 19th-century identity was as a shipping-and-shipbuilding port; today its economy is mixed retail, tourism, and cross-border trade. The city is historically Republican, with a strong Catholic-and-Methodist church network.',
      'Port Huron\'s political culture is right-leaning enough that the abolitionist argument has room to move votes if the case is made plainly. The mainstream pro-life vote here is a floor to build from, not a ceiling.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Port Huron city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Port Huron?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Port Huron city limits. If your Port Huron-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Port Huron?',
        a: 'Port Huron is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Port Huron?',
        a: 'Sign the Michigan abolition petition, contact your Port Huron state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Mount Pleasant ------------------------------------
  {
    slug: 'mount-pleasant',
    name: 'Mount Pleasant',
    region: 'Isabella County',
    populationLabel: '~26,000 residents',
    population: 26000,
    latitude: 43.6013,
    longitude: -84.7736,
    houseDistricts: [92],
    senateDistricts: [34],
    historyParagraphs: [
      'Mount Pleasant is home to Central Michigan University and the Saginaw Chippewa Indian Tribe\'s Soaring Eagle Casino & Resort — a mid-Michigan college town whose politics reflect the split between CMU\'s student progressivism and Isabella County\'s rural Republican character.',
      'The Catholic and evangelical church network in Mount Pleasant has been consistent in its pro-life witness. The abolitionist argument at CMU is the argument for taking the pro-life conviction seriously as a matter of law, not just personal preference.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Mount Pleasant city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Mount Pleasant?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Mount Pleasant city limits. If your Mount Pleasant-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Mount Pleasant?',
        a: 'Mount Pleasant is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Mount Pleasant?',
        a: 'Sign the Michigan abolition petition, contact your Mount Pleasant state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Wyandotte -----------------------------------------
  {
    slug: 'wyandotte',
    name: 'Wyandotte',
    region: 'Wayne County',
    populationLabel: '~25,000 residents',
    population: 25000,
    latitude: 42.2084,
    longitude: -83.1616,
    houseDistricts: [27],
    senateDistricts: [4],
    historyParagraphs: [
      'Wyandotte is a downriver Detroit suburb on the Detroit River — historically a Polish and Ukrainian Catholic working-class city, its economy shaped by the Wyandotte Chemical Company (now BASF) and Ford\'s downriver plants.',
      'The Polish and Ukrainian Catholic parishes in Wyandotte hold the traditional teaching on abortion without compromise. The abolitionist argument is the natural civil-law expression of that theology.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Wyandotte city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Wyandotte?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Wyandotte city limits. If your Wyandotte-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Wyandotte?',
        a: 'Wyandotte is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Wyandotte?',
        a: 'Sign the Michigan abolition petition, contact your Wyandotte state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Auburn Hills --------------------------------------
  {
    slug: 'auburn-hills',
    name: 'Auburn Hills',
    region: 'Oakland County',
    populationLabel: '~24,000 residents',
    population: 24000,
    latitude: 42.6583,
    longitude: -83.2375,
    houseDistricts: [54],
    senateDistricts: [7],
    historyParagraphs: [
      'Auburn Hills is Oakland County\'s automotive-corporate hub — home to Chrysler\'s world headquarters, the Palace of Auburn Hills (now demolished but the site of Pistons and countless concerts through 2017), and the Oakland University campus.',
      'The Reformed, evangelical, and Catholic churches in Auburn Hills carry the historic pro-life teaching. The abolitionist argument in Auburn Hills is the civil-law extension of that pulpit consensus — a shift from private conviction to public code.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Auburn Hills city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Auburn Hills?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Auburn Hills city limits. If your Auburn Hills-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Auburn Hills?',
        a: 'Auburn Hills is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Auburn Hills?',
        a: 'Sign the Michigan abolition petition, contact your Auburn Hills state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Ferndale ------------------------------------------
  {
    slug: 'ferndale',
    name: 'Ferndale',
    region: 'Oakland County',
    populationLabel: '~20,000 residents',
    population: 20000,
    latitude: 42.4586,
    longitude: -83.1363,
    houseDistricts: [8],
    senateDistricts: [8],
    historyParagraphs: [
      'Ferndale is Woodward Avenue\'s most-progressive Detroit-adjacent suburb — a dense, walkable city with the DIY Street Fair, First Friday art walks, and one of Michigan\'s most active LGBTQ communities. Politically it runs deep-Democratic; culturally it\'s the anti-Royal-Oak (older, weirder, more artistic).',
      'The abolitionist argument in Ferndale is a minority position by design. But the city is home to Planned Parenthood on Woodward — the highest-volume PP in southeast Michigan — and a church network that includes Baptist, Catholic, and traditional Lutheran congregations that have never accepted the pro-choice framework. Abolition here is the case for the church against the culture, made in the city where the culture is most self-consciously secular.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates inside Ferndale city limits:',
    faqs: [
      {
        q: 'Are there abolitionist churches in Ferndale?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Ferndale city limits. If your Ferndale-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Ferndale?',
        a: 'Ferndale is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Ferndale?',
        a: 'Sign the Michigan abolition petition, contact your Ferndale state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Marquette -----------------------------------------
  {
    slug: 'marquette',
    name: 'Marquette',
    region: 'Marquette County',
    populationLabel: '~20,000 residents',
    population: 20000,
    latitude: 46.5786,
    longitude: -87.4545,
    houseDistricts: [109],
    senateDistricts: [38],
    historyParagraphs: [
      'Marquette is the largest city in the Upper Peninsula, home to Northern Michigan University and the port that historically shipped iron ore from the Marquette Iron Range. Its civic identity is a mix of the UP\'s independent, blue-collar character and NMU\'s college-town liberal streak.',
      'The Catholic and Finnish-Lutheran church traditions dominant in Marquette hold the historic teaching against abortion. The UP\'s political culture is more open to unusual arguments than the lower peninsula\'s; abolition finds a real hearing here.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Marquette city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Marquette?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Marquette city limits. If your Marquette-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Marquette?',
        a: 'Marquette is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Marquette?',
        a: 'Sign the Michigan abolition petition, contact your Marquette state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Ypsilanti -----------------------------------------
  {
    slug: 'ypsilanti',
    name: 'Ypsilanti',
    region: 'Washtenaw County',
    populationLabel: '~20,000 residents',
    population: 20000,
    latitude: 42.2382,
    longitude: -83.6083,
    houseDistricts: [32],
    senateDistricts: [15],
    historyParagraphs: [
      'Ypsilanti is home to Eastern Michigan University and the historic Depot Town district — a college town whose civic identity is inseparable from Ann Arbor\'s. It shares Washtenaw County\'s progressive political character while retaining its own working-class base.',
      'Ypsilanti\'s Black Baptist and Catholic congregations hold the historic pro-life teaching that has always been at odds with the county\'s Prop-3 vote. The abolitionist argument here is that private theology should not remain private when the state votes to constitutionalize what the theology calls sin.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Ypsilanti city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Ypsilanti?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Ypsilanti city limits. If your Ypsilanti-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Ypsilanti?',
        a: 'Ypsilanti is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Ypsilanti?',
        a: 'Sign the Michigan abolition petition, contact your Ypsilanti state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Trenton -------------------------------------------
  {
    slug: 'trenton',
    name: 'Trenton',
    region: 'Wayne County',
    populationLabel: '~18,000 residents',
    population: 18000,
    latitude: 42.1382,
    longitude: -83.2179,
    houseDistricts: [28],
    senateDistricts: [4],
    historyParagraphs: [
      'Trenton is a downriver Detroit suburb on the Detroit River — historically a shipbuilding and industrial city, now a wealthier suburb with the Trenton Historical Museum and Elizabeth Park (Michigan\'s oldest county park).',
      'The Catholic and Methodist church network here holds the historic pro-life teaching. The abolitionist case is the same case as in Southgate, Wyandotte, and Riverview: the theology and the law are misaligned, and the alignment is achievable.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Trenton city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Trenton?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Trenton city limits. If your Trenton-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Trenton?',
        a: 'Trenton is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Trenton?',
        a: 'Sign the Michigan abolition petition, contact your Trenton state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Berkley -------------------------------------------
  {
    slug: 'berkley',
    name: 'Berkley',
    region: 'Oakland County',
    populationLabel: '~15,000 residents',
    population: 15000,
    latitude: 42.5028,
    longitude: -83.1887,
    houseDistricts: [6],
    senateDistricts: [8],
    historyParagraphs: [
      'Berkley is a dense, walkable Oakland County inner-ring suburb between Royal Oak and Ferndale — a family-oriented town with the Berkley Days street festival and a strong local-schools identity.',
      'The Catholic and mainline Protestant churches here are the traditional bearers of the anti-abortion witness. Abolition is the natural next step from that pulpit teaching.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Berkley city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Berkley?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Berkley city limits. If your Berkley-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Berkley?',
        a: 'Berkley is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Berkley?',
        a: 'Sign the Michigan abolition petition, contact your Berkley state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Traverse City -------------------------------------
  {
    slug: 'traverse-city',
    name: 'Traverse City',
    region: 'Grand Traverse County',
    populationLabel: '~15,000 residents',
    population: 15000,
    latitude: 44.7395,
    longitude: -85.5835,
    houseDistricts: [103],
    senateDistricts: [37],
    historyParagraphs: [
      'Traverse City is Michigan\'s cherry capital and the largest city in northwest Lower Michigan — Interlochen, the National Cherry Festival, and the Grand Traverse Bay wine country. Its economy is tourism, agriculture, and a growing tech scene; its politics have trended purple in recent cycles.',
      'The Catholic and evangelical Protestant church network in Traverse City is strong; the confessional Reformed presence is smaller than downstate but growing. The abolitionist argument in a city that has trended purple politically has a real audience.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Traverse City city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Traverse City?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Traverse City city limits. If your Traverse City-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Traverse City?',
        a: 'Traverse City is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Traverse City?',
        a: 'Sign the Michigan abolition petition, contact your Traverse City state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Sault Ste. Marie ----------------------------------
  {
    slug: 'sault-ste-marie',
    name: 'Sault Ste. Marie',
    region: 'Chippewa County',
    populationLabel: '~13,000 residents',
    population: 13000,
    latitude: 46.4151,
    longitude: -84.2854,
    houseDistricts: [107],
    senateDistricts: [37],
    historyParagraphs: [
      'Sault Ste. Marie is Michigan\'s oldest continuously-inhabited European settlement — a Franco-Ojibwe city on the St. Marys River that has been a trading post since 1668. Home to the Soo Locks and Lake Superior State University.',
      'The Catholic parishes here — descendants of the 17th-century Jesuit mission — hold the historic teaching against abortion without compromise. The abolitionist argument in "the Soo" is the argument for civil law to catch up with 350+ years of Catholic teaching.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Sault Ste. Marie city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Sault Ste. Marie?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Sault Ste. Marie city limits. If your Sault Ste. Marie-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Sault Ste. Marie?',
        a: 'Sault Ste. Marie is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Sault Ste. Marie?',
        a: 'Sign the Michigan abolition petition, contact your Sault Ste. Marie state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Rochester -----------------------------------------
  {
    slug: 'rochester',
    name: 'Rochester',
    region: 'Oakland County',
    populationLabel: '~12,000 residents',
    population: 12000,
    latitude: 42.6489,
    longitude: -83.1269,
    houseDistricts: [55],
    senateDistricts: [9],
    historyParagraphs: [
      'Rochester is a small, wealthy Oakland County city bordering Rochester Hills — home to Oakland University\'s original campus, the Rochester Big, Bright Light Show at Christmas, and a walkable downtown.',
      'Rochester\'s church network mirrors Rochester Hills\' — PCA, OPC, LCMS Lutheran, Catholic — all bearing the historic anti-abortion teaching. Abolition is the civic-law extension.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Rochester city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Rochester?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Rochester city limits. If your Rochester-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Rochester?',
        a: 'Rochester is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Rochester?',
        a: 'Sign the Michigan abolition petition, contact your Rochester state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Escanaba ------------------------------------------
  {
    slug: 'escanaba',
    name: 'Escanaba',
    region: 'Delta County',
    populationLabel: '~12,000 residents',
    population: 12000,
    latitude: 45.7659,
    longitude: -87.089,
    houseDistricts: [108],
    senateDistricts: [38],
    historyParagraphs: [
      'Escanaba is an Upper Peninsula port on Little Bay de Noc — historically an iron-ore and paper-mill city, still shaped by the UPI (Upper Peninsula Independent) political culture that rejects easy alignment with either lower-peninsula party.',
      'The Catholic and Finnish-Lutheran churches in Escanaba hold the historic teaching against abortion. The UP\'s willingness to consider arguments the lower peninsula has already dismissed makes this a receptive audience for the abolitionist case.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Escanaba city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Escanaba?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Escanaba city limits. If your Escanaba-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Escanaba?',
        a: 'Escanaba is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Escanaba?',
        a: 'Sign the Michigan abolition petition, contact your Escanaba state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Allen Park ----------------------------------------
  {
    slug: 'allen-park',
    name: 'Allen Park',
    region: 'Wayne County',
    populationLabel: '~28,000 residents',
    population: 28000,
    latitude: 42.2522,
    longitude: -83.212,
    houseDistricts: [2],
    senateDistricts: [1],
    historyParagraphs: [
      'Allen Park is a downriver Detroit suburb — one of the classic postwar Wayne County cities named after Lewis Allen, the early-19th-century land grantee. Home to the Detroit Lions\' Allen Park training facility and a working-class civic culture built around Ford\'s downriver plants.',
      'The Catholic and evangelical churches here — Sacred Heart, St. Frances Cabrini, and the community Bible fellowships — hold the historic pro-life teaching. The abolitionist argument in Allen Park is the plain-terms working-class case for the personhood of the preborn.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Allen Park city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Allen Park?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Allen Park city limits. If your Allen Park-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Allen Park?',
        a: 'Allen Park is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Allen Park?',
        a: 'Sign the Michigan abolition petition, contact your Allen Park state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Canton --------------------------------------------
  {
    slug: 'canton',
    name: 'Canton',
    region: 'Wayne County',
    populationLabel: '~98,000 residents',
    population: 98000,
    latitude: 42.332,
    longitude: -83.4695,
    houseDistricts: [24],
    senateDistricts: [5],
    historyParagraphs: [
      'Canton is the largest township in Michigan — home to nearly 100,000 residents, one of the fastest-growing communities in the state, and one of the most religiously and ethnically diverse. Its population is a mix of white professionals, one of the largest Indian-American populations in the Midwest (with major Hindu temples on Ford Road), a substantial Chinese-American community, and a strong Muslim presence anchored by the Muslim Community Association.',
      'That religious diversity concentrates natural allies for the abolition case. Hinduism, Islam, and Christianity all teach that human life begins early in the womb. The abolitionist argument in Canton is that the state law must honor the moral consensus already present in Canton\'s temples, mosques, and churches.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Canton city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Canton?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Canton city limits. If your Canton-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Canton?',
        a: 'Canton is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Canton?',
        a: 'Sign the Michigan abolition petition, contact your Canton state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Van Buren Charter Township ------------------------
  {
    slug: 'van-buren-charter-township',
    name: 'Van Buren Charter Township',
    region: 'Wayne County',
    populationLabel: '~29,000 residents',
    population: 29000,
    latitude: 42.1949,
    longitude: -83.4854,
    houseDistricts: [31],
    senateDistricts: [4],
    historyParagraphs: [
      'Van Buren Charter Township sits west of Wayne along Belleville Lake — a semi-rural community with Belleville at its center. Its civic identity mixes long-standing farming heritage with suburban growth driven by proximity to Ford\'s Rawsonville and Willow Run plants.',
      'The Catholic and Baptist church network in Van Buren is unambiguously pro-life. The abolitionist case here fits the township\'s traditional-values character.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Van Buren Charter Township city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Van Buren Charter Township?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Van Buren Charter Township city limits. If your Van Buren Charter Township-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Van Buren Charter Township?',
        a: 'Van Buren Charter Township is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Van Buren Charter Township?',
        a: 'Sign the Michigan abolition petition, contact your Van Buren Charter Township state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Adrian --------------------------------------------
  {
    slug: 'adrian',
    name: 'Adrian',
    region: 'Lenawee County',
    populationLabel: '~20,000 residents',
    population: 20000,
    latitude: 41.9005,
    longitude: -84.0446,
    houseDistricts: [34],
    senateDistricts: [16],
    historyParagraphs: [
      'Adrian is the seat of Lenawee County and home to Adrian College and Siena Heights University — both liberal-arts colleges with historic religious affiliations (Methodist and Dominican Catholic, respectively). The city\'s civic identity blends agricultural southeastern Michigan with a small-college intellectual life.',
      'The Catholic and evangelical churches in Adrian carry the historic pro-life teaching without compromise. Adrian\'s Dominican Sisters heritage runs deep — a tradition that has always taught the personhood of the preborn. The abolitionist argument is the civil-law extension of that teaching.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Adrian city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Adrian?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Adrian city limits. If your Adrian-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Adrian?',
        a: 'Adrian is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Adrian?',
        a: 'Sign the Michigan abolition petition, contact your Adrian state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Monroe --------------------------------------------
  {
    slug: 'monroe',
    name: 'Monroe',
    region: 'Monroe County',
    populationLabel: '~19,000 residents',
    population: 19000,
    latitude: 41.908,
    longitude: -83.4719,
    houseDistricts: [30],
    senateDistricts: [16],
    historyParagraphs: [
      'Monroe is the seat of Monroe County — a Lake Erie shore city where the River Raisin meets the lake. Historic site of the War of 1812 River Raisin battles (now a national park). Politically it has trended Republican in recent cycles despite its historically Democratic union heritage.',
      'The Catholic church network — St. Mary\'s, St. John the Baptist, and the IHM Sisters of Charity motherhouse — has been a foundational institution in Monroe since the 1820s. IHM teaching on abortion has been consistent for two centuries: it is intrinsically evil. Abolition is that teaching brought into civil law.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Monroe city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Monroe?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Monroe city limits. If your Monroe-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Monroe?',
        a: 'Monroe is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Monroe?',
        a: 'Sign the Michigan abolition petition, contact your Monroe state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Coldwater -----------------------------------------
  {
    slug: 'coldwater',
    name: 'Coldwater',
    region: 'Branch County',
    populationLabel: '~11,000 residents',
    population: 11000,
    latitude: 41.9255,
    longitude: -85.0057,
    houseDistricts: [35],
    senateDistricts: [17],
    historyParagraphs: [
      'Coldwater is the seat of Branch County — a small southwest Michigan city on the Chicago-Detroit rail corridor, home to Kellogg Community College\'s Grahl Center and a strong rural-manufacturing economy.',
      'The Catholic and Baptist churches in Coldwater hold the historic pro-life teaching. The abolitionist argument fits a rural county whose voters have consistently rejected abortion-rights ballot measures.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Coldwater city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Coldwater?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Coldwater city limits. If your Coldwater-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Coldwater?',
        a: 'Coldwater is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Coldwater?',
        a: 'Sign the Michigan abolition petition, contact your Coldwater state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Niles ---------------------------------------------
  {
    slug: 'niles',
    name: 'Niles',
    region: 'Berrien County',
    populationLabel: '~11,000 residents',
    population: 11000,
    latitude: 41.8202,
    longitude: -86.2368,
    houseDistricts: [37],
    senateDistricts: [17],
    historyParagraphs: [
      'Niles is a southwest Michigan city on the St. Joseph River — home to the Niles Historic District, close to Notre Dame University in South Bend just across the Indiana border. Its civic identity blends Michigan and northern-Indiana Catholic influences.',
      'The Catholic parish network here — deeply shaped by the Notre Dame presence — teaches against abortion. The abolitionist argument extends that theology into civil-rights terms.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Niles city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Niles?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Niles city limits. If your Niles-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Niles?',
        a: 'Niles is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Niles?',
        a: 'Sign the Michigan abolition petition, contact your Niles state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- St. Joseph ----------------------------------------
  {
    slug: 'st-joseph',
    name: 'St. Joseph',
    region: 'Berrien County',
    populationLabel: '~8,000 residents',
    population: 8000,
    latitude: 42.064,
    longitude: -86.4783,
    houseDistricts: [38],
    senateDistricts: [20],
    historyParagraphs: [
      'St. Joseph sits on Lake Michigan at the mouth of the St. Joseph River — a resort-and-manufacturing city, home of Whirlpool Corporation\'s world headquarters and the Silver Beach Carousel. Its civic identity is coastal Michigan blended with corporate Whirlpool influence.',
      'The Catholic and Reformed churches in St. Joseph carry the pro-life teaching that has always been the western-Michigan norm. Abolition is the civil-law expression of that pulpit consensus.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside St. Joseph city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in St. Joseph?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside St. Joseph city limits. If your St. Joseph-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in St. Joseph?',
        a: 'St. Joseph is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in St. Joseph?',
        a: 'Sign the Michigan abolition petition, contact your St. Joseph state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Howell --------------------------------------------
  {
    slug: 'howell',
    name: 'Howell',
    region: 'Livingston County',
    populationLabel: '~10,000 residents',
    population: 10000,
    latitude: 42.6159,
    longitude: -83.9248,
    houseDistricts: [50],
    senateDistricts: [22],
    historyParagraphs: [
      'Howell is the seat of Livingston County — a fast-growing exurb between Ann Arbor and Lansing, home of the Howell Melon Festival and one of the most politically Republican counties in Lower Michigan.',
      'The Catholic and Baptist churches in Howell hold the historic pro-life teaching, and Livingston County\'s political culture is receptive to the abolitionist argument. The gap between what pulpits teach and what state law protects is smaller here than in most of Michigan.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Howell city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Howell?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Howell city limits. If your Howell-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Howell?',
        a: 'Howell is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Howell?',
        a: 'Sign the Michigan abolition petition, contact your Howell state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Clarkston -----------------------------------------
  {
    slug: 'clarkston',
    name: 'Clarkston',
    region: 'Oakland County',
    populationLabel: '~8,000 residents',
    population: 8000,
    latitude: 42.7239,
    longitude: -83.4232,
    houseDistricts: [52],
    senateDistricts: [23],
    historyParagraphs: [
      'Clarkston is a wealthy small city in northern Oakland County — home to the DTE Energy Music Theatre (the busiest outdoor concert venue in the country) and a historic downtown centered on Depot Road. The surrounding Independence Township is a Reagan-Republican bedroom community for the auto-industry executive class.',
      'The Reformed and evangelical churches in the Clarkston-Independence area hold the historic pro-life teaching. The abolitionist argument has natural political traction here.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Clarkston city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Clarkston?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Clarkston city limits. If your Clarkston-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Clarkston?',
        a: 'Clarkston is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Clarkston?',
        a: 'Sign the Michigan abolition petition, contact your Clarkston state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Chesterfield Charter Township ---------------------
  {
    slug: 'chesterfield-charter-township',
    name: 'Chesterfield Charter Township',
    region: 'Macomb County',
    populationLabel: '~46,000 residents',
    population: 46000,
    latitude: 42.673,
    longitude: -82.7753,
    houseDistricts: [63],
    senateDistricts: [12],
    historyParagraphs: [
      'Chesterfield Charter Township is one of the largest municipalities on Lake St. Clair\'s Anchor Bay — a fast-growing northern Macomb community that has doubled in population since 1990. Home to New Baltimore just inside its boundaries and a strong marina-and-boating economy.',
      'The Catholic parishes here (St. Mary Queen of Creation, Sacred Heart) hold the historic teaching against abortion. The abolitionist argument in Chesterfield is the civil-law extension of that pulpit teaching in a growing community with room to shape its civic future.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Chesterfield Charter Township city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Chesterfield Charter Township?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Chesterfield Charter Township city limits. If your Chesterfield Charter Township-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Chesterfield Charter Township?',
        a: 'Chesterfield Charter Township is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Chesterfield Charter Township?',
        a: 'Sign the Michigan abolition petition, contact your Chesterfield Charter Township state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Macomb Township -----------------------------------
  {
    slug: 'macomb-township',
    name: 'Macomb Township',
    region: 'Macomb County',
    populationLabel: '~91,000 residents',
    population: 91000,
    latitude: 42.6442,
    longitude: -82.8985,
    houseDistricts: [60],
    senateDistricts: [11],
    historyParagraphs: [
      'Macomb Township is Michigan\'s fifth-largest municipality by population — a rapidly-growing northern Macomb community that has nearly quadrupled in size since 1990. Politically it has trended Republican, culturally it is family-suburban Catholic.',
      'The Catholic parish network — including St. Peter Chanel and the many young families anchoring its parish schools — teaches the historic anti-abortion position. Macomb Township\'s growth is exactly the kind of demographic environment where abolition can take institutional root.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Macomb Township city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Macomb Township?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Macomb Township city limits. If your Macomb Township-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Macomb Township?',
        a: 'Macomb Township is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Macomb Township?',
        a: 'Sign the Michigan abolition petition, contact your Macomb Township state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Shelby Charter Township ---------------------------
  {
    slug: 'shelby-charter-township',
    name: 'Shelby Charter Township',
    region: 'Macomb County',
    populationLabel: '~79,000 residents',
    population: 79000,
    latitude: 42.6413,
    longitude: -83.0504,
    houseDistricts: [59],
    senateDistricts: [24],
    historyParagraphs: [
      'Shelby Charter Township is one of Macomb County\'s wealthiest and largest municipalities — a fast-growing suburb north of Sterling Heights with a strong Catholic parish network, a Reagan-Republican political culture, and Stony Creek Metropark on its northern edge.',
      'Shelby\'s civic character — family-oriented, church-going, politically-conservative — is exactly the audience the abolitionist argument was built for. The theology is already in the pulpits; the argument invites the pews to demand it in law.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Shelby Charter Township city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Shelby Charter Township?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Shelby Charter Township city limits. If your Shelby Charter Township-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Shelby Charter Township?',
        a: 'Shelby Charter Township is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Shelby Charter Township?',
        a: 'Sign the Michigan abolition petition, contact your Shelby Charter Township state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Burton --------------------------------------------
  {
    slug: 'burton',
    name: 'Burton',
    region: 'Genesee County',
    populationLabel: '~30,000 residents',
    population: 30000,
    latitude: 43.0259,
    longitude: -83.6041,
    houseDistricts: [68],
    senateDistricts: [26],
    historyParagraphs: [
      'Burton is a Genesee County suburb adjacent to Flint — historically a working-class GM-employee community, now a somewhat-depressed inner-ring suburb sharing Flint\'s post-industrial economic challenges.',
      'The Catholic and Baptist churches in Burton hold the pro-life teaching that has always been the Genesee County norm. The abolitionist argument in Burton, as in Flint, is the equal-protection case: the state protects some lives and not others, and it should protect all.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Burton city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Burton?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Burton city limits. If your Burton-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Burton?',
        a: 'Burton is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Burton?',
        a: 'Sign the Michigan abolition petition, contact your Burton state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Lapeer --------------------------------------------
  {
    slug: 'lapeer',
    name: 'Lapeer',
    region: 'Lapeer County',
    populationLabel: '~9,000 residents',
    population: 9000,
    latitude: 43.0579,
    longitude: -83.3332,
    houseDistricts: [67],
    senateDistricts: [26],
    historyParagraphs: [
      'Lapeer is the seat of Lapeer County — a rural-suburban Thumb-region city named for the French word for "flint." Its civic identity blends farming heritage with proximity to Flint\'s manufacturing economy.',
      'The Catholic and evangelical Protestant churches in Lapeer hold the historic pro-life teaching. Lapeer County\'s political culture is Republican-leaning and receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Lapeer city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Lapeer?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Lapeer city limits. If your Lapeer-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Lapeer?',
        a: 'Lapeer is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Lapeer?',
        a: 'Sign the Michigan abolition petition, contact your Lapeer state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Fenton --------------------------------------------
  {
    slug: 'fenton',
    name: 'Fenton',
    region: 'Genesee County',
    populationLabel: '~12,000 residents',
    population: 12000,
    latitude: 42.7851,
    longitude: -83.7294,
    houseDistricts: [72],
    senateDistricts: [22],
    historyParagraphs: [
      'Fenton is a small Genesee County city on Lake Fenton — home of the historic Fenton Hotel Tavern & Grille (1856), a downtown revival, and a bedroom-community role for both Flint and Detroit-metro professionals.',
      'The Catholic and Bible-Baptist churches in Fenton hold the historic pro-life teaching. Fenton\'s political culture is Republican, receptive to the abolitionist case.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Fenton city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Fenton?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Fenton city limits. If your Fenton-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Fenton?',
        a: 'Fenton is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Fenton?',
        a: 'Sign the Michigan abolition petition, contact your Fenton state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Ionia ---------------------------------------------
  {
    slug: 'ionia',
    name: 'Ionia',
    region: 'Ionia County',
    populationLabel: '~11,000 residents',
    population: 11000,
    latitude: 42.9859,
    longitude: -85.071,
    houseDistricts: [78],
    senateDistricts: [33],
    historyParagraphs: [
      'Ionia is the seat of Ionia County — a mid-Michigan city along the Grand River, home of the Ionia Free Fair (Michigan\'s largest county fair) and several state correctional facilities that anchor the local economy.',
      'The Catholic and Reformed church network in Ionia County holds the pro-life teaching. The abolitionist argument in rural mid-Michigan works with the grain of a region that has never accepted the pro-choice framework.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Ionia city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Ionia?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Ionia city limits. If your Ionia-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Ionia?',
        a: 'Ionia is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Ionia?',
        a: 'Sign the Michigan abolition petition, contact your Ionia state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Grand Haven ---------------------------------------
  {
    slug: 'grand-haven',
    name: 'Grand Haven',
    region: 'Ottawa County',
    populationLabel: '~11,000 residents',
    population: 11000,
    latitude: 43.0378,
    longitude: -86.1912,
    houseDistricts: [88],
    senateDistricts: [31],
    historyParagraphs: [
      'Grand Haven is a Lake Michigan resort city at the mouth of the Grand River — home of the Grand Haven Musical Fountain (the world\'s largest), the annual Coast Guard Festival, and a strong Reformed-Christian civic culture.',
      'Grand Haven\'s Reformed and Christian Reformed church presence is one of the strongest in Michigan outside Holland. The abolitionist argument fits West Michigan\'s confessional theology naturally.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Grand Haven city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Grand Haven?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Grand Haven city limits. If your Grand Haven-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Grand Haven?',
        a: 'Grand Haven is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Grand Haven?',
        a: 'Sign the Michigan abolition petition, contact your Grand Haven state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Rockford ------------------------------------------
  {
    slug: 'rockford',
    name: 'Rockford',
    region: 'Kent County',
    populationLabel: '~6,000 residents',
    population: 6000,
    latitude: 43.1152,
    longitude: -85.5136,
    houseDistricts: [90],
    senateDistricts: [33],
    historyParagraphs: [
      'Rockford is a small city north of Grand Rapids — home of the historic Wolverine World Wide shoe manufacturer (Hush Puppies) and a strong small-town Reformed Christian civic culture.',
      'Rockford\'s Reformed and evangelical churches carry the West Michigan CRC/RCA teaching against abortion. The abolitionist argument extends that theology into civil law.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Rockford city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Rockford?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Rockford city limits. If your Rockford-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Rockford?',
        a: 'Rockford is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Rockford?',
        a: 'Sign the Michigan abolition petition, contact your Rockford state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Caro ----------------------------------------------
  {
    slug: 'caro',
    name: 'Caro',
    region: 'Tuscola County',
    populationLabel: '~4,000 residents',
    population: 4000,
    latitude: 43.4833,
    longitude: -83.3835,
    houseDistricts: [97],
    senateDistricts: [25],
    historyParagraphs: [
      'Caro is the seat of Tuscola County — a small Thumb-region city named after the historic Cairo, Egypt (renamed for pronunciation). Home to Colwood Church and Providence Church, both on the postmillennial-abolitionist network our partners page tracks.',
      'Caro is one of the few MI cities with named churches on the national abolitionist / postmillennial-network directory. That confessional presence is the foundation for the abolitionist argument locally.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Caro city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Caro?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Caro city limits. If your Caro-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Caro?',
        a: 'Caro is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Caro?',
        a: 'Sign the Michigan abolition petition, contact your Caro state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Big Rapids ----------------------------------------
  {
    slug: 'big-rapids',
    name: 'Big Rapids',
    region: 'Mecosta County',
    populationLabel: '~10,000 residents',
    population: 10000,
    latitude: 43.6897,
    longitude: -85.4797,
    houseDistricts: [100],
    senateDistricts: [34],
    historyParagraphs: [
      'Big Rapids is the seat of Mecosta County and home of Ferris State University — a mid-Michigan college city on the Muskegon River. Its civic identity blends Ferris\' 12,000-student population with rural-north Michigan character.',
      'The Catholic and evangelical Protestant churches in Big Rapids hold the historic pro-life teaching. Mecosta County\'s political culture is Republican, receptive to the abolitionist case.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Big Rapids city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Big Rapids?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Big Rapids city limits. If your Big Rapids-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Big Rapids?',
        a: 'Big Rapids is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Big Rapids?',
        a: 'Sign the Michigan abolition petition, contact your Big Rapids state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Cadillac ------------------------------------------
  {
    slug: 'cadillac',
    name: 'Cadillac',
    region: 'Wexford County',
    populationLabel: '~10,000 residents',
    population: 10000,
    latitude: 44.2504,
    longitude: -85.43,
    houseDistricts: [101],
    senateDistricts: [36],
    historyParagraphs: [
      'Cadillac sits on Lake Cadillac in the northwest Lower Peninsula — a rural-north city named after Detroit\'s founder Antoine de la Mothe Cadillac. Home to the Cadillac Country Music Festival and a strong small-city civic tradition.',
      'The Catholic and Bible-Baptist churches in Cadillac hold the traditional pro-life teaching. Northern Michigan\'s political culture is receptive to strong moral arguments made plainly.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Cadillac city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Cadillac?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Cadillac city limits. If your Cadillac-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Cadillac?',
        a: 'Cadillac is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Cadillac?',
        a: 'Sign the Michigan abolition petition, contact your Cadillac state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Ludington -----------------------------------------
  {
    slug: 'ludington',
    name: 'Ludington',
    region: 'Mason County',
    populationLabel: '~8,000 residents',
    population: 8000,
    latitude: 43.9688,
    longitude: -86.4403,
    houseDistricts: [102],
    senateDistricts: [32],
    historyParagraphs: [
      'Ludington sits on Lake Michigan at the mouth of the Pere Marquette River — home of the S.S. Badger car ferry to Manitowoc, Wisconsin (the last coal-fired passenger steamship on the Great Lakes) and a strong tourism-and-maritime economy.',
      'Ludington\'s Catholic and Reformed churches hold the historic pro-life teaching. The city\'s small-town civic culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Ludington city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Ludington?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Ludington city limits. If your Ludington-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Ludington?',
        a: 'Ludington is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Ludington?',
        a: 'Sign the Michigan abolition petition, contact your Ludington state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Alpena --------------------------------------------
  {
    slug: 'alpena',
    name: 'Alpena',
    region: 'Alpena County',
    populationLabel: '~10,000 residents',
    population: 10000,
    latitude: 45.079,
    longitude: -83.4602,
    houseDistricts: [106],
    senateDistricts: [36],
    historyParagraphs: [
      'Alpena is the largest city on the Lake Huron shore north of Bay City — a Great Lakes port shaped by cement manufacturing (Lafarge\'s Alpena plant), the annual Brown Trout Festival, and Northeast Michigan\'s independent political character.',
      'The Catholic and Lutheran churches in Alpena hold the historic pro-life teaching. Northeast Michigan\'s political culture is willing to consider arguments the population centers have already dismissed — abolition finds a real hearing here.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Alpena city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Alpena?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Alpena city limits. If your Alpena-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Alpena?',
        a: 'Alpena is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Alpena?',
        a: 'Sign the Michigan abolition petition, contact your Alpena state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Grayling ------------------------------------------
  {
    slug: 'grayling',
    name: 'Grayling',
    region: 'Crawford County',
    populationLabel: '~2,000 residents',
    population: 2000,
    latitude: 44.671,
    longitude: -84.6913,
    houseDistricts: [105],
    senateDistricts: [36],
    historyParagraphs: [
      'Grayling is a small Northern Michigan city on the AuSable River — best known for canoeing, trout fishing, the Michigan Army National Guard\'s Camp Grayling training center (the largest state-owned military training facility east of the Mississippi), and the AuSable River Canoe Marathon.',
      'The Catholic and evangelical churches in Grayling hold the pro-life teaching. Northern Michigan\'s independent political character makes it receptive to arguments the lower peninsula has already tired of.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Grayling city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Grayling?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Grayling city limits. If your Grayling-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Grayling?',
        a: 'Grayling is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Grayling?',
        a: 'Sign the Michigan abolition petition, contact your Grayling state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Iron Mountain -------------------------------------
  {
    slug: 'iron-mountain',
    name: 'Iron Mountain',
    region: 'Dickinson County',
    populationLabel: '~8,000 residents',
    population: 8000,
    latitude: 45.8219,
    longitude: -88.0683,
    houseDistricts: [110],
    senateDistricts: [38],
    historyParagraphs: [
      'Iron Mountain is the largest city in the west-central Upper Peninsula — an iron-ore mining town on the Menominee Range, named for the mountain of hematite that anchored its 19th-century economy. Home to the Cornish Pump Museum and a strong Finnish-American and Italian-American heritage.',
      'The Catholic and Finnish-Lutheran churches in Iron Mountain hold the historic pro-life teaching. The Upper Peninsula\'s political culture is independent and receptive to the abolitionist argument made on its merits.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Iron Mountain city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Iron Mountain?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Iron Mountain city limits. If your Iron Mountain-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Iron Mountain?',
        a: 'Iron Mountain is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Iron Mountain?',
        a: 'Sign the Michigan abolition petition, contact your Iron Mountain state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- West Bloomfield -----------------------------------
  {
    slug: 'west-bloomfield',
    name: 'West Bloomfield',
    region: 'Oakland County',
    populationLabel: '~65,000 residents',
    population: 65000,
    latitude: 42.5461,
    longitude: -83.383,
    houseDistricts: [20],
    senateDistricts: [13],
    historyParagraphs: [
      'West Bloomfield is a wealthy Oakland County township on the Cass Lake / Sylvan Lake corridor — home of one of the largest Jewish populations in Michigan (Adat Shalom, Congregation Beth Ahm, Temple Israel), a substantial Chaldean Catholic community, and a growing Indian-American professional class.',
      'West Bloomfield\'s Orthodox Jewish and Chaldean Catholic communities both teach that human life begins early in the womb. The abolitionist case here finds coalition partners across religious traditions that agree on the core fact.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside West Bloomfield city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in West Bloomfield?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside West Bloomfield city limits. If your West Bloomfield-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in West Bloomfield?',
        a: 'West Bloomfield is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in West Bloomfield?',
        a: 'Sign the Michigan abolition petition, contact your West Bloomfield state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Sturgis -------------------------------------------
  {
    slug: 'sturgis',
    name: 'Sturgis',
    region: 'St. Joseph County',
    populationLabel: '~11,000 residents',
    population: 11000,
    latitude: 41.8089,
    longitude: -85.4264,
    houseDistricts: [36],
    senateDistricts: [17],
    historyParagraphs: [
      'Sturgis is a small St. Joseph County city near the Indiana border — historically the home of the Sturgis-Elkhart RV manufacturing corridor, with a strong small-town evangelical and Catholic church network.',
      'The Catholic and Baptist churches in Sturgis hold the historic pro-life teaching. Rural southwest Michigan\'s political culture is Republican-leaning and receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Sturgis city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Sturgis?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Sturgis city limits. If your Sturgis-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Sturgis?',
        a: 'Sturgis is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Sturgis?',
        a: 'Sign the Michigan abolition petition, contact your Sturgis state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Paw Paw -------------------------------------------
  {
    slug: 'paw-paw',
    name: 'Paw Paw',
    region: 'Van Buren County',
    populationLabel: '~4,000 residents',
    population: 4000,
    latitude: 42.2349,
    longitude: -85.9005,
    houseDistricts: [39],
    senateDistricts: [20],
    historyParagraphs: [
      'Paw Paw is the seat of Van Buren County — Michigan wine country, home of the Warner Vineyards and St. Julian Winery, and the surrounding agricultural region.',
      'The Catholic and evangelical churches in Paw Paw hold the traditional pro-life teaching. Van Buren County\'s rural political culture is receptive to the abolitionist case.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Paw Paw city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Paw Paw?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Paw Paw city limits. If your Paw Paw-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Paw Paw?',
        a: 'Paw Paw is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Paw Paw?',
        a: 'Sign the Michigan abolition petition, contact your Paw Paw state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Whitmore Lake -------------------------------------
  {
    slug: 'whitmore-lake',
    name: 'Whitmore Lake',
    region: 'Washtenaw County',
    populationLabel: '~6,000 residents',
    population: 6000,
    latitude: 42.4289,
    longitude: -83.7828,
    houseDistricts: [49],
    senateDistricts: [22],
    historyParagraphs: [
      'Whitmore Lake is a small Washtenaw County community north of Ann Arbor — a lakeside village whose civic identity is shaped by proximity to the Ann Arbor academic and professional class while retaining a small-town character.',
      'The Catholic and evangelical churches in Whitmore Lake hold the historic pro-life teaching. Whitmore Lake is a persuadable audience — closer to Ann Arbor\'s Prop-3 support than downstate rural counties, but not aligned with the university city\'s dominant culture.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Whitmore Lake city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Whitmore Lake?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Whitmore Lake city limits. If your Whitmore Lake-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Whitmore Lake?',
        a: 'Whitmore Lake is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Whitmore Lake?',
        a: 'Sign the Michigan abolition petition, contact your Whitmore Lake state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Richmond ------------------------------------------
  {
    slug: 'richmond',
    name: 'Richmond',
    region: 'Macomb County',
    populationLabel: '~6,000 residents',
    population: 6000,
    latitude: 42.8389,
    longitude: -82.7996,
    houseDistricts: [65],
    senateDistricts: [25],
    historyParagraphs: [
      'Richmond is a small city in northern Macomb County — the seat of Richmond Township, home of the Good Ol\' Days Festival and a strong agricultural-suburban civic identity.',
      'The Catholic and Baptist churches in Richmond hold the historic pro-life teaching. Northern Macomb\'s rural-conservative political culture is receptive to the abolitionist case.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Richmond city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Richmond?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Richmond city limits. If your Richmond-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Richmond?',
        a: 'Richmond is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Richmond?',
        a: 'Sign the Michigan abolition petition, contact your Richmond state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Durand --------------------------------------------
  {
    slug: 'durand',
    name: 'Durand',
    region: 'Shiawassee County',
    populationLabel: '~4,000 residents',
    population: 4000,
    latitude: 42.9117,
    longitude: -83.9877,
    houseDistricts: [71],
    senateDistricts: [28],
    historyParagraphs: [
      'Durand is a small Shiawassee County city — historically a major railroad hub (the Michigan Railroad History Museum is here) and now a bedroom community for Flint and East Lansing professionals.',
      'The Catholic and Bible-Baptist churches in Durand hold the traditional pro-life teaching. Rural Shiawassee County\'s political culture is Republican-leaning and receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Durand city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Durand?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Durand city limits. If your Durand-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Durand?',
        a: 'Durand is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Durand?',
        a: 'Sign the Michigan abolition petition, contact your Durand state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Zeeland -------------------------------------------
  {
    slug: 'zeeland',
    name: 'Zeeland',
    region: 'Ottawa County',
    populationLabel: '~6,000 residents',
    population: 6000,
    latitude: 42.8256,
    longitude: -86.0104,
    houseDistricts: [85],
    senateDistricts: [31],
    historyParagraphs: [
      'Zeeland is the smaller of West Michigan\'s two Dutch Reformed anchor cities — Holland\'s twin, home to the Zeeland Historical Museum, De Kruif Furniture Company (established 1908), and one of the highest per-capita concentrations of CRC / RCA / URC / Netherlands Reformed congregations anywhere in America.',
      'Zeeland\'s confessional Reformed churches are unambiguous on the personhood of the preborn. The abolitionist argument here is the natural civil-law expression of West Michigan\'s most-densely-Reformed-outside-Holland theological inheritance.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Zeeland city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Zeeland?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Zeeland city limits. If your Zeeland-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Zeeland?',
        a: 'Zeeland is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Zeeland?',
        a: 'Sign the Michigan abolition petition, contact your Zeeland state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Elk Rapids ----------------------------------------
  {
    slug: 'elk-rapids',
    name: 'Elk Rapids',
    region: 'Antrim County',
    populationLabel: '~2,000 residents',
    population: 2000,
    latitude: 44.8945,
    longitude: -85.4147,
    houseDistricts: [104],
    senateDistricts: [37],
    historyParagraphs: [
      'Elk Rapids is a small village on the shore of Elk Lake — one of the postcard-perfect small towns of northwest Lower Michigan wine country, home of the Petobego Dam and a strong tourism economy.',
      'The Catholic and evangelical churches in Elk Rapids hold the traditional pro-life teaching. Northern Michigan\'s independent political culture is receptive to arguments the downstate population centers have already tired of.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Elk Rapids city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Elk Rapids?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Elk Rapids city limits. If your Elk Rapids-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Elk Rapids?',
        a: 'Elk Rapids is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Elk Rapids?',
        a: 'Sign the Michigan abolition petition, contact your Elk Rapids state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Clinton Charter Township --------------------------
  {
    slug: 'clinton-charter-township',
    name: 'Clinton Charter Township',
    region: 'Macomb County',
    populationLabel: '~100,000 residents',
    population: 100000,
    latitude: 42.5512,
    longitude: -82.9167,
    houseDistricts: [61],
    senateDistricts: [11],
    historyParagraphs: [
      'Clinton Charter Township is Michigan\'s fourth-largest municipality by population — a fast-growing central Macomb community that has doubled since 1990. Home to a strong Catholic parish network, a substantial Chaldean and Assyrian Christian community, and Macomb Community College\'s Center Campus.',
      'The Chaldean and Assyrian congregations here carry ancient Christian teaching on the personhood of the preborn from Nicaea forward. Clinton Township\'s Catholic majority holds the same. The abolitionist argument is the civil-law extension of the theological consensus already in the pulpits.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Clinton Charter Township city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Clinton Charter Township?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Clinton Charter Township city limits. If your Clinton Charter Township-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Clinton Charter Township?',
        a: 'Clinton Charter Township is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Clinton Charter Township?',
        a: 'Sign the Michigan abolition petition, contact your Clinton Charter Township state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Waterford Charter Township ------------------------
  {
    slug: 'waterford-charter-township',
    name: 'Waterford Charter Township',
    region: 'Oakland County',
    populationLabel: '~71,000 residents',
    population: 71000,
    latitude: 42.6429,
    longitude: -83.3546,
    houseDistricts: [53],
    senateDistricts: [23],
    historyParagraphs: [
      'Waterford Charter Township is the largest municipality in northern Oakland County — a lakes-region community built around Cass Lake, Elizabeth Lake, and Pontiac Lake. Its economy blends light manufacturing, retail along Dixie Highway, and the Oakland County International Airport.',
      'The Catholic, Missouri-Synod Lutheran, and evangelical Protestant churches in Waterford hold the historic pro-life teaching. Waterford\'s mixed-political character makes it a persuadable audience for the abolitionist case made plainly.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Waterford Charter Township city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Waterford Charter Township?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Waterford Charter Township city limits. If your Waterford Charter Township-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Waterford Charter Township?',
        a: 'Waterford Charter Township is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Waterford Charter Township?',
        a: 'Sign the Michigan abolition petition, contact your Waterford Charter Township state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Redford Charter Township --------------------------
  {
    slug: 'redford-charter-township',
    name: 'Redford Charter Township',
    region: 'Wayne County',
    populationLabel: '~47,000 residents',
    population: 47000,
    latitude: 42.3756,
    longitude: -83.289,
    houseDistricts: [16],
    senateDistricts: [6],
    historyParagraphs: [
      'Redford Charter Township is a working-class inner-ring Wayne County community — built out during the Ford-Rouge-plant boom, home to Bishop Borgess High School (closed 2007), the Grand River Corridor, and a dense Polish, Italian, and Irish Catholic heritage.',
      'The Catholic parish network in Redford (St. Robert Bellarmine, St. Valentine, Our Lady of Loretto) holds the traditional teaching against abortion without compromise. The abolitionist argument fits Redford\'s working-class Catholic conservatism naturally.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Redford Charter Township city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Redford Charter Township?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Redford Charter Township city limits. If your Redford Charter Township-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Redford Charter Township?',
        a: 'Redford Charter Township is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Redford Charter Township?',
        a: 'Sign the Michigan abolition petition, contact your Redford Charter Township state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Bloomfield Charter Township -----------------------
  {
    slug: 'bloomfield-charter-township',
    name: 'Bloomfield Charter Township',
    region: 'Oakland County',
    populationLabel: '~42,000 residents',
    population: 42000,
    latitude: 42.5848,
    longitude: -83.2821,
    houseDistricts: [54],
    senateDistricts: [7],
    historyParagraphs: [
      'Bloomfield Charter Township is one of the wealthiest municipalities in Michigan — home to Cranbrook Educational Community (the Cranbrook Schools, Art Museum, and Institute of Science), the historic Bloomfield Hills-adjacent estates, and a substantial Jewish community centered around Adat Shalom and Temple Beth El.',
      'Bloomfield\'s Orthodox Jewish community and traditional Catholic parishes both teach that human life begins early in the womb. The abolitionist argument finds coalition partners across the wealth-and-religion pluralism of Bloomfield Township.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Bloomfield Charter Township city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Bloomfield Charter Township?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Bloomfield Charter Township city limits. If your Bloomfield Charter Township-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Bloomfield Charter Township?',
        a: 'Bloomfield Charter Township is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Bloomfield Charter Township?',
        a: 'Sign the Michigan abolition petition, contact your Bloomfield Charter Township state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Lincoln Park --------------------------------------
  {
    slug: 'lincoln-park',
    name: 'Lincoln Park',
    region: 'Wayne County',
    populationLabel: '~40,000 residents',
    population: 40000,
    latitude: 42.2422,
    longitude: -83.1807,
    houseDistricts: [2],
    senateDistricts: [1],
    historyParagraphs: [
      'Lincoln Park is one of Detroit\'s oldest downriver suburbs — established as a working-class Ford-employee community along Fort Street, with a strong Polish, Southern-Baptist, and Latino population mix. Home to Lincoln Park High School and the historic Fort Street Presbyterian.',
      'The Catholic, Polish National Catholic, and evangelical Baptist churches in Lincoln Park hold the historic pro-life teaching. Downriver\'s Reagan-Democrat character makes the abolitionist case a real possibility here.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Lincoln Park city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Lincoln Park?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Lincoln Park city limits. If your Lincoln Park-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Lincoln Park?',
        a: 'Lincoln Park is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Lincoln Park?',
        a: 'Sign the Michigan abolition petition, contact your Lincoln Park state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Hamtramck -----------------------------------------
  {
    slug: 'hamtramck',
    name: 'Hamtramck',
    region: 'Wayne County',
    populationLabel: '~28,000 residents',
    population: 28000,
    latitude: 42.4081,
    longitude: -83.0583,
    houseDistricts: [7],
    senateDistricts: [3],
    historyParagraphs: [
      'Hamtramck is a 2.1-square-mile enclave completely surrounded by Detroit — historically the Polish-American immigrant capital of Michigan (St. Florian Church still holds a Polish-language Mass), now the first Muslim-majority-elected city council in the United States (2021), with substantial Bangladeshi, Yemeni, and Bosnian populations.',
      'The historic Islamic and Catholic teachings on abortion align on the personhood of the preborn early in gestation. Hamtramck\'s Muslim-majority political leadership and its remnant Polish Catholic parishes represent a rare coalition where anti-abortion conviction crosses religious lines with intact clarity.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Hamtramck city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Hamtramck?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Hamtramck city limits. If your Hamtramck-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Hamtramck?',
        a: 'Hamtramck is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Hamtramck?',
        a: 'Sign the Michigan abolition petition, contact your Hamtramck state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Norton Shores -------------------------------------
  {
    slug: 'norton-shores',
    name: 'Norton Shores',
    region: 'Muskegon County',
    populationLabel: '~24,000 residents',
    population: 24000,
    latitude: 43.1962,
    longitude: -86.2738,
    houseDistricts: [87],
    senateDistricts: [32],
    historyParagraphs: [
      'Norton Shores is Muskegon\'s southern suburb on Mona Lake — home to Muskegon County Airport, Grand Valley State University\'s Meijer Campus, and the Lake Michigan shoreline that runs south to Grand Haven.',
      'The Reformed, evangelical Protestant, and Catholic churches in Norton Shores carry the West Michigan pro-life teaching. The abolitionist argument extends that theology into civil-rights terms.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Norton Shores city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Norton Shores?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Norton Shores city limits. If your Norton Shores-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Norton Shores?',
        a: 'Norton Shores is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Norton Shores?',
        a: 'Sign the Michigan abolition petition, contact your Norton Shores state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Mount Clemens -------------------------------------
  {
    slug: 'mount-clemens',
    name: 'Mount Clemens',
    region: 'Macomb County',
    populationLabel: '~16,000 residents',
    population: 16000,
    latitude: 42.5978,
    longitude: -82.8823,
    houseDistricts: [61],
    senateDistricts: [12],
    historyParagraphs: [
      'Mount Clemens is the seat of Macomb County — historically famous for its mineral spring resorts (President McKinley visited in 1902) and now the civic anchor of Macomb County\'s court system, city hall, and public services. Home to the Anton Art Center and the annual Bath City Festival.',
      'The Catholic parishes in Mount Clemens (St. Peter Chanel, St. Mary) hold the historic teaching against abortion. As Macomb County\'s seat, Mount Clemens is where county-wide political conversation happens — a strategic city for the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Mount Clemens city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Mount Clemens?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Mount Clemens city limits. If your Mount Clemens-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Mount Clemens?',
        a: 'Mount Clemens is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Mount Clemens?',
        a: 'Sign the Michigan abolition petition, contact your Mount Clemens state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- East Grand Rapids ---------------------------------
  {
    slug: 'east-grand-rapids',
    name: 'East Grand Rapids',
    region: 'Kent County',
    populationLabel: '~11,000 residents',
    population: 11000,
    latitude: 42.944,
    longitude: -85.6213,
    houseDistricts: [80],
    senateDistricts: [29],
    historyParagraphs: [
      'East Grand Rapids is one of the wealthiest small cities in West Michigan — a Grand Rapids suburb built around Reeds Lake, home of the Gaslight Village shopping district, East Grand Rapids High School (perennially top-ranked in the state), and a strong Christian Reformed / Reformed Church in America presence.',
      'The confessional Reformed theology of East Grand Rapids\' CRC and RCA congregations teaches unambiguously the personhood of the preborn from conception. Abolition is the natural civil-law expression of that pulpit teaching in one of Michigan\'s most-densely-Reformed neighborhoods.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside East Grand Rapids city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in East Grand Rapids?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside East Grand Rapids city limits. If your East Grand Rapids-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in East Grand Rapids?',
        a: 'East Grand Rapids is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in East Grand Rapids?',
        a: 'Sign the Michigan abolition petition, contact your East Grand Rapids state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Grand Blanc ---------------------------------------
  {
    slug: 'grand-blanc',
    name: 'Grand Blanc',
    region: 'Genesee County',
    populationLabel: '~8,000 residents',
    population: 8000,
    latitude: 42.9282,
    longitude: -83.6264,
    houseDistricts: [68],
    senateDistricts: [27],
    historyParagraphs: [
      'Grand Blanc is a suburb southeast of Flint — home to the Warwick Hills Golf & Country Club (host of the PGA Tour\'s Buick Open through 2009), a large General Motors employee base, and OneLife Church, which appears on our partners page as part of the postmillennial-network state directory of allied congregations.',
      'OneLife Church\'s presence in Grand Blanc puts this city on the small list of MI cities with a named church on the national abolitionist-adjacent postmillennial-network directory. That is a foundation on which local abolition work can build.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Grand Blanc city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Grand Blanc?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Grand Blanc city limits. If your Grand Blanc-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Grand Blanc?',
        a: 'Grand Blanc is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Grand Blanc?',
        a: 'Sign the Michigan abolition petition, contact your Grand Blanc state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Houghton ------------------------------------------
  {
    slug: 'houghton',
    name: 'Houghton',
    region: 'Houghton County',
    populationLabel: '~7,000 residents',
    population: 7000,
    latitude: 47.1158,
    longitude: -88.558,
    houseDistricts: [110],
    senateDistricts: [38],
    historyParagraphs: [
      'Houghton is the Copper Country capital of Michigan\'s western Upper Peninsula — home to Michigan Technological University and the historic seat of the Keweenaw Peninsula copper-mining boom that shaped the UP\'s Finnish, Cornish, and Italian immigrant heritage. Now a college town anchored by MTU\'s 7,000-student engineering-focused campus.',
      'The Finnish Lutheran, Catholic, and Reformed churches in Houghton hold the historic teaching against abortion. The UP\'s independent political character makes it receptive to arguments the population centers of the lower peninsula have already dismissed — abolition finds a real hearing here.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Houghton city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Houghton?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Houghton city limits. If your Houghton-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Houghton?',
        a: 'Houghton is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Houghton?',
        a: 'Sign the Michigan abolition petition, contact your Houghton state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Georgetown Charter Township -----------------------
  {
    slug: 'georgetown-charter-township',
    name: 'Georgetown Charter Township',
    region: 'Ottawa County',
    populationLabel: '~55,000 residents',
    population: 55000,
    latitude: 42.8748,
    longitude: -85.8751,
    houseDistricts: [85],
    senateDistricts: [31],
    historyParagraphs: [
      'Georgetown Charter Township is the sixth-largest municipality by population in Michigan — home to Hudsonville, the annual Hudsonville Fair, and the Hudsonville Ice Cream company. Its civic identity is dominated by the Christian Reformed Church / Reformed Church in America heritage of West Michigan Dutch-immigrant families.',
      'Georgetown\'s confessional Reformed theology is unambiguous: human life begins at conception. The abolitionist argument is the natural civil-law extension of that pulpit teaching in one of the state\'s most-densely-Reformed communities.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Georgetown Charter Township.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Georgetown Charter Township?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Georgetown Charter Township. If your Georgetown Charter Township-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Georgetown Charter Township?',
        a: 'Georgetown Charter Township is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Georgetown Charter Township?',
        a: 'Sign the Michigan abolition petition, contact your Georgetown Charter Township state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Ypsilanti Charter Township ------------------------
  {
    slug: 'ypsilanti-charter-township',
    name: 'Ypsilanti Charter Township',
    region: 'Washtenaw County',
    populationLabel: '~55,000 residents',
    population: 55000,
    latitude: 42.2439,
    longitude: -83.583,
    houseDistricts: [32],
    senateDistricts: [15],
    historyParagraphs: [
      'Ypsilanti Charter Township wraps around the city of Ypsilanti — a separate, larger municipality with its own government, schools, and identity. Home to Eastern Michigan University\'s outer campus and a substantial Black and Latino population that shapes its cultural life.',
      'The Black Baptist and Catholic congregations in Ypsilanti Township hold the historic pro-life teaching. In a Washtenaw County that voted 77% pro-Prop-3, that pulpit witness is the minority position — and the abolitionist argument is the case for making it a governing one.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Ypsilanti Charter Township.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Ypsilanti Charter Township?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Ypsilanti Charter Township. If your Ypsilanti Charter Township-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Ypsilanti Charter Township?',
        a: 'Ypsilanti Charter Township is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Ypsilanti Charter Township?',
        a: 'Sign the Michigan abolition petition, contact your Ypsilanti Charter Township state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Meridian Charter Township -------------------------
  {
    slug: 'meridian-charter-township',
    name: 'Meridian Charter Township',
    region: 'Ingham County',
    populationLabel: '~45,000 residents',
    population: 45000,
    latitude: 42.7053,
    longitude: -84.4187,
    houseDistricts: [73],
    senateDistricts: [28],
    historyParagraphs: [
      'Meridian Charter Township contains Okemos and Haslett — wealthy East Lansing-adjacent communities that anchor the professional-class residential ring around Michigan State University. Home to the Meridian Mall and the historic Okemos village.',
      'Meridian\'s Reformed, Catholic, and evangelical churches hold the historic pro-life teaching. Being in the direct MSU-professional orbit puts Meridian at the intersection of secular-progressive culture and confessional Christian conviction — a place where the abolitionist argument must be made carefully and clearly.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Meridian Charter Township.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Meridian Charter Township?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Meridian Charter Township. If your Meridian Charter Township-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Meridian Charter Township?',
        a: 'Meridian Charter Township is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Meridian Charter Township?',
        a: 'Sign the Michigan abolition petition, contact your Meridian Charter Township state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Commerce Charter Township -------------------------
  {
    slug: 'commerce-charter-township',
    name: 'Commerce Charter Township',
    region: 'Oakland County',
    populationLabel: '~44,000 residents',
    population: 44000,
    latitude: 42.5582,
    longitude: -83.4773,
    houseDistricts: [51],
    senateDistricts: [23],
    historyParagraphs: [
      'Commerce Charter Township is one of the wealthier northwestern Oakland County lakes-region communities — home to Cass Lake, Wolverine Lake, and Walled Lake. Its economy blends corporate-suburban professionals with the marina-and-boating businesses of the lakes region.',
      'The Catholic and evangelical churches in Commerce hold the historic pro-life teaching. Northern Oakland County\'s political culture — trending purple but still Republican-leaning — is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Commerce Charter Township.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Commerce Charter Township?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Commerce Charter Township. If your Commerce Charter Township-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Commerce Charter Township?',
        a: 'Commerce Charter Township is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Commerce Charter Township?',
        a: 'Sign the Michigan abolition petition, contact your Commerce Charter Township state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Grand Blanc Charter Township ----------------------
  {
    slug: 'grand-blanc-charter-township',
    name: 'Grand Blanc Charter Township',
    region: 'Genesee County',
    populationLabel: '~40,000 residents',
    population: 40000,
    latitude: 42.9282,
    longitude: -83.6264,
    houseDistricts: [68],
    senateDistricts: [27],
    historyParagraphs: [
      'Grand Blanc Charter Township wraps around the city of Grand Blanc — a separate, smaller municipality — and is Genesee County\'s largest township. Home to General Motors\' Grand Blanc plant, the Warwick Hills Country Club (former Buick Open PGA venue), and the postmillennial-network OneLife Church that appears on our partners page.',
      'OneLife Church\'s presence in the Grand Blanc area — one of the few named MI churches on the national abolitionist-adjacent postmillennial-network directory — is the local foundation for the abolitionist argument here.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Grand Blanc Charter Township.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Grand Blanc Charter Township?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Grand Blanc Charter Township. If your Grand Blanc Charter Township-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Grand Blanc Charter Township?',
        a: 'Grand Blanc Charter Township is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Grand Blanc Charter Township?',
        a: 'Sign the Michigan abolition petition, contact your Grand Blanc Charter Township state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Pittsfield Charter Township -----------------------
  {
    slug: 'pittsfield-charter-township',
    name: 'Pittsfield Charter Township',
    region: 'Washtenaw County',
    populationLabel: '~40,000 residents',
    population: 40000,
    latitude: 42.2328,
    longitude: -83.7015,
    houseDistricts: [33],
    senateDistricts: [15],
    historyParagraphs: [
      'Pittsfield Charter Township is Ann Arbor\'s largest southern suburb — home to Briarwood Mall, Pittsfield Village, and much of the professional-class housing stock that supports the University of Michigan and its adjacent tech industry.',
      'Pittsfield\'s political culture is Ann-Arbor-adjacent progressive, but its Catholic, LCMS Lutheran, and Reformed Presbyterian congregations hold the historic pro-life teaching. The abolitionist argument here is the case for making pulpit teaching politically consequential.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Pittsfield Charter Township.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Pittsfield Charter Township?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Pittsfield Charter Township. If your Pittsfield Charter Township-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Pittsfield Charter Township?',
        a: 'Pittsfield Charter Township is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Pittsfield Charter Township?',
        a: 'Sign the Michigan abolition petition, contact your Pittsfield Charter Township state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Independence Charter Township ---------------------
  {
    slug: 'independence-charter-township',
    name: 'Independence Charter Township',
    region: 'Oakland County',
    populationLabel: '~35,000 residents',
    population: 35000,
    latitude: 42.7605,
    longitude: -83.404,
    houseDistricts: [52],
    senateDistricts: [23],
    historyParagraphs: [
      'Independence Charter Township contains Clarkston — a wealthy small city — and much of the surrounding lakes-region rural-suburban Oakland County. Home to the DTE Energy Music Theatre (the busiest outdoor concert venue in the country) and a strong Reagan-Republican political culture.',
      'The Reformed, evangelical Protestant, and Catholic churches in Independence hold the historic pro-life teaching. This is one of the receptive audiences in Oakland County for the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Independence Charter Township.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Independence Charter Township?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Independence Charter Township. If your Independence Charter Township-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Independence Charter Township?',
        a: 'Independence Charter Township is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Independence Charter Township?',
        a: 'Sign the Michigan abolition petition, contact your Independence Charter Township state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Delta Charter Township ----------------------------
  {
    slug: 'delta-charter-township',
    name: 'Delta Charter Township',
    region: 'Eaton County',
    populationLabel: '~33,000 residents',
    population: 33000,
    latitude: 42.7376,
    longitude: -84.6244,
    houseDistricts: [76],
    senateDistricts: [21],
    historyParagraphs: [
      'Delta Charter Township is the largest suburb of Lansing to the west — home to the Grand River Avenue commercial corridor, the Lansing Mall, and a mix of light manufacturing and professional-class residential.',
      'Delta\'s Catholic and evangelical churches hold the historic pro-life teaching. In a Lansing metro that trends Democratic, the western suburbs like Delta are the persuadable audience for the abolitionist case.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Delta Charter Township.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Delta Charter Township?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Delta Charter Township. If your Delta Charter Township-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Delta Charter Township?',
        a: 'Delta Charter Township is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Delta Charter Township?',
        a: 'Sign the Michigan abolition petition, contact your Delta Charter Township state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Flint Charter Township ----------------------------
  {
    slug: 'flint-charter-township',
    name: 'Flint Charter Township',
    region: 'Genesee County',
    populationLabel: '~30,000 residents',
    population: 30000,
    latitude: 43.0111,
    longitude: -83.803,
    houseDistricts: [69],
    senateDistricts: [27],
    historyParagraphs: [
      'Flint Charter Township wraps around the city of Flint — a separate municipality — and hosts much of the professional-class housing, retail, and healthcare facilities (including Genesys Regional Medical Center) that serve the greater Flint area.',
      'The Catholic and Baptist churches in Flint Township hold the historic pro-life teaching. The equal-protection framing that the Flint water crisis brought to civic language extends naturally into the abolitionist argument for the preborn.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Flint Charter Township.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Flint Charter Township?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Flint Charter Township. If your Flint Charter Township-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Flint Charter Township?',
        a: 'Flint Charter Township is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Flint Charter Township?',
        a: 'Sign the Michigan abolition petition, contact your Flint Charter Township state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Northville Charter Township -----------------------
  {
    slug: 'northville-charter-township',
    name: 'Northville Charter Township',
    region: 'Wayne County',
    populationLabel: '~30,000 residents',
    population: 30000,
    latitude: 42.4086,
    longitude: -83.4978,
    houseDistricts: [23],
    senateDistricts: [13],
    historyParagraphs: [
      'Northville Charter Township wraps around the small, wealthy city of Northville — a Wayne-Washtenaw-Oakland border community anchored by the historic Northville Downtown Development District and the annual Victorian Festival.',
      'Northville\'s Catholic, Reformed Presbyterian, and evangelical Protestant churches hold the historic pro-life teaching. Northville\'s demographic profile — wealthy, family-oriented, church-attending — is one of the natural audiences for the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Northville Charter Township.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Northville Charter Township?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Northville Charter Township. If your Northville Charter Township-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Northville Charter Township?',
        a: 'Northville Charter Township is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Northville Charter Township?',
        a: 'Sign the Michigan abolition petition, contact your Northville Charter Township state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Plymouth Charter Township -------------------------
  {
    slug: 'plymouth-charter-township',
    name: 'Plymouth Charter Township',
    region: 'Wayne County',
    populationLabel: '~28,000 residents',
    population: 28000,
    latitude: 42.3688,
    longitude: -83.4799,
    houseDistricts: [22],
    senateDistricts: [13],
    historyParagraphs: [
      'Plymouth Charter Township surrounds the city of Plymouth — a walkable historic downtown community west of Detroit. Home to the Plymouth International Ice Sculpture Festival and a strong small-town civic culture that has resisted the sprawl of neighboring Canton.',
      'The Catholic and evangelical churches in Plymouth Township hold the historic pro-life teaching. Plymouth\'s Republican-leaning suburban character is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Plymouth Charter Township.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Plymouth Charter Township?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Plymouth Charter Township. If your Plymouth Charter Township-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Plymouth Charter Township?',
        a: 'Plymouth Charter Township is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Plymouth Charter Township?',
        a: 'Sign the Michigan abolition petition, contact your Plymouth Charter Township state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Harrisville (Alcona County) ------------------------------
  {
    slug: 'harrisville',
    name: 'Harrisville',
    region: 'Alcona County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 44.6546,
    longitude: -83.3424,
    houseDistricts: [106],
    senateDistricts: [36],
    historyParagraphs: [
      'Harrisville is the seat of Alcona County on the northeastern Lake Huron shore — a small resort city named after early lumberman Erastus Harris. Its economy runs on Sunrise Coast tourism, the Harrisville State Park, and small-town summer trade.',
      'Northeast Michigan\'s Catholic and evangelical Protestant churches hold the historic pro-life teaching. Rural Alcona County\'s independent political culture is receptive to the abolitionist argument made plainly.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Harrisville.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Harrisville?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Harrisville. If your Harrisville-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Harrisville?',
        a: 'Harrisville is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Harrisville?',
        a: 'Sign the Michigan abolition petition, contact your Harrisville state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Munising (Alger County) ------------------------------
  {
    slug: 'munising',
    name: 'Munising',
    region: 'Alger County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 46.3994,
    longitude: -86.6983,
    houseDistricts: [109],
    senateDistricts: [38],
    historyParagraphs: [
      'Munising is the seat of Alger County — a small Upper Peninsula city on Munising Bay, gateway to Pictured Rocks National Lakeshore. Its economy is centered on tourism, sport fishing, and the small logging trade that persists in the Hiawatha National Forest.',
      'The Catholic and Finnish-Lutheran churches in Munising hold the historic teaching against abortion. The UP\'s independent civic character is one of the most receptive audiences in Michigan for the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Munising.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Munising?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Munising. If your Munising-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Munising?',
        a: 'Munising is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Munising?',
        a: 'Sign the Michigan abolition petition, contact your Munising state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Allegan (Allegan County) ------------------------------
  {
    slug: 'allegan',
    name: 'Allegan',
    region: 'Allegan County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 42.5256,
    longitude: -85.8661,
    houseDistricts: [43],
    senateDistricts: [20],
    historyParagraphs: [
      'Allegan is the seat of Allegan County — a small city on the Kalamazoo River between Grand Rapids and Kalamazoo, home to the historic Allegan Historic District and the Perrigo Company (the world\'s largest maker of store-brand medicines).',
      'Allegan\'s Reformed, Catholic, and evangelical Protestant churches hold the historic pro-life teaching. West Michigan\'s confessional theology is unambiguous on the personhood of the preborn.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Allegan.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Allegan?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Allegan. If your Allegan-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Allegan?',
        a: 'Allegan is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Allegan?',
        a: 'Sign the Michigan abolition petition, contact your Allegan state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- L'Anse (Baraga County) ------------------------------
  {
    slug: 'l-anse',
    name: "L'Anse",
    region: 'Baraga County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 46.7704,
    longitude: -88.421,
    houseDistricts: [109],
    senateDistricts: [38],
    historyParagraphs: [
      'L\'Anse is the seat of Baraga County — a small Upper Peninsula village at the head of Keweenaw Bay, home to the Keweenaw Bay Indian Community and a strong French-Canadian and Ojibwe heritage.',
      'The Catholic parishes serving L\'Anse and the Keweenaw Bay Community hold the historic teaching against abortion. The KBIC\'s traditional Anishinaabe teachings on the sanctity of life converge with the Catholic pro-life witness in this small UP community.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside L\'Anse.',
    faqs: [
      {
        q: 'Are there abolitionist churches in L\'Anse?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside L\'Anse. If your L\'Anse-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in L\'Anse?',
        a: 'L\'Anse is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in L\'Anse?',
        a: 'Sign the Michigan abolition petition, contact your L\'Anse state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Hastings (Barry County) ------------------------------
  {
    slug: 'hastings',
    name: 'Hastings',
    region: 'Barry County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 42.643,
    longitude: -85.2937,
    houseDistricts: [78],
    senateDistricts: [18],
    historyParagraphs: [
      'Hastings is the seat of Barry County — a small city on the Thornapple River in southwest-central Michigan, home to the Barry County Fair and a strong agricultural civic identity.',
      'The Reformed, Catholic, and evangelical Protestant churches in Hastings hold the historic pro-life teaching. Rural Barry County\'s Republican-leaning political culture is receptive to the abolitionist case.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Hastings.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Hastings?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Hastings. If your Hastings-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Hastings?',
        a: 'Hastings is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Hastings?',
        a: 'Sign the Michigan abolition petition, contact your Hastings state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Frankfort (Benzie County) ------------------------------
  {
    slug: 'frankfort',
    name: 'Frankfort',
    region: 'Benzie County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 44.6311,
    longitude: -86.2212,
    houseDistricts: [104],
    senateDistricts: [32],
    historyParagraphs: [
      'Frankfort is a small city on Lake Michigan at the mouth of the Betsie River — the seat of Benzie County, home to Point Betsie Lighthouse and the annual Frankfort Music Festival.',
      'Northwest Michigan\'s Catholic and evangelical Protestant churches hold the historic teaching against abortion. Benzie County\'s small-town political culture is receptive to arguments made honestly.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Frankfort.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Frankfort?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Frankfort. If your Frankfort-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Frankfort?',
        a: 'Frankfort is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Frankfort?',
        a: 'Sign the Michigan abolition petition, contact your Frankfort state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Dowagiac (Cass County) ------------------------------
  {
    slug: 'dowagiac',
    name: 'Dowagiac',
    region: 'Cass County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 41.991,
    longitude: -86.1168,
    houseDistricts: [37],
    senateDistricts: [17],
    historyParagraphs: [
      'Dowagiac is the largest city in Cass County — a small southwest Michigan community named for a Potawatomi word meaning "land of many fishes." Home to Southwestern Michigan College and the historic Round Oak Stove Company.',
      'The Catholic and evangelical Protestant churches in Dowagiac hold the historic pro-life teaching. Rural Cass County\'s political culture is Republican-leaning and receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Dowagiac.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Dowagiac?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Dowagiac. If your Dowagiac-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Dowagiac?',
        a: 'Dowagiac is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Dowagiac?',
        a: 'Sign the Michigan abolition petition, contact your Dowagiac state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Charlevoix (Charlevoix County) ------------------------------
  {
    slug: 'charlevoix',
    name: 'Charlevoix',
    region: 'Charlevoix County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 45.2654,
    longitude: -85.2297,
    houseDistricts: [107],
    senateDistricts: [37],
    historyParagraphs: [
      'Charlevoix is the seat of Charlevoix County — a small resort city on Lake Michigan and Lake Charlevoix, home to the annual Venetian Festival, Earl Young\'s mushroom houses, and a strong tourism economy.',
      'Northwest Michigan\'s Catholic and evangelical Protestant churches hold the historic teaching against abortion. Charlevoix\'s small-town civic culture is receptive to the abolitionist case.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Charlevoix.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Charlevoix?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Charlevoix. If your Charlevoix-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Charlevoix?',
        a: 'Charlevoix is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Charlevoix?',
        a: 'Sign the Michigan abolition petition, contact your Charlevoix state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Cheboygan (Cheboygan County) ------------------------------
  {
    slug: 'cheboygan',
    name: 'Cheboygan',
    region: 'Cheboygan County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 45.608,
    longitude: -84.4867,
    houseDistricts: [106],
    senateDistricts: [37],
    historyParagraphs: [
      'Cheboygan is the seat of Cheboygan County — a Lake Huron / Straits of Mackinac city, home to the U.S. Coast Guard Cutter Mackinaw and the historic Opera House downtown.',
      'Northern Michigan\'s Catholic and Lutheran churches in Cheboygan hold the historic pro-life teaching. Cheboygan\'s independent political culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Cheboygan.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Cheboygan?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Cheboygan. If your Cheboygan-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Cheboygan?',
        a: 'Cheboygan is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Cheboygan?',
        a: 'Sign the Michigan abolition petition, contact your Cheboygan state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Clare (Clare County) ------------------------------
  {
    slug: 'clare',
    name: 'Clare',
    region: 'Clare County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 43.8223,
    longitude: -84.7635,
    houseDistricts: [100],
    senateDistricts: [34],
    historyParagraphs: [
      'Clare is a small central Michigan city that straddles Clare and Isabella counties — the self-proclaimed "Gateway to the North," home to the annual Clare Irish Festival and the Doherty Hotel (a family-run landmark since 1924).',
      'The Catholic and evangelical churches in Clare hold the historic pro-life teaching. Central Michigan\'s rural political culture is Republican-leaning and receptive to the abolitionist case.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Clare.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Clare?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Clare. If your Clare-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Clare?',
        a: 'Clare is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Clare?',
        a: 'Sign the Michigan abolition petition, contact your Clare state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- St. Johns (Clinton County) ------------------------------
  {
    slug: 'st-johns',
    name: 'St. Johns',
    region: 'Clinton County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 43.0059,
    longitude: -84.5719,
    houseDistricts: [75],
    senateDistricts: [28],
    historyParagraphs: [
      'St. Johns is the seat of Clinton County — a small mid-Michigan city north of Lansing, home to the historic Clinton Northern Railway Museum and one of the state\'s most productive agricultural corridors (Mint Festival draws visitors annually).',
      'The Catholic and Reformed churches in St. Johns hold the historic pro-life teaching. Clinton County\'s political culture is Republican-leaning and receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside St. Johns.',
    faqs: [
      {
        q: 'Are there abolitionist churches in St. Johns?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside St. Johns. If your St. Johns-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in St. Johns?',
        a: 'St. Johns is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in St. Johns?',
        a: 'Sign the Michigan abolition petition, contact your St. Johns state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Petoskey (Emmet County) ------------------------------
  {
    slug: 'petoskey-emmet',
    name: 'Petoskey',
    region: 'Emmet County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 45.3559,
    longitude: -84.9133,
    houseDistricts: [107],
    senateDistricts: [37],
    historyParagraphs: [
      'Petoskey is the seat of Emmet County — a Lake Michigan resort city named after Chief Petoskey (Anishinaabe). Home to Bay View Association, the Petoskey Stone (Michigan\'s state stone), and Hemingway\'s summer haunts along Little Traverse Bay.',
      'Emmet County\'s Catholic and evangelical Protestant churches hold the historic pro-life teaching. The area\'s independent north-Michigan political culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Petoskey.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Petoskey?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Petoskey. If your Petoskey-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Petoskey?',
        a: 'Petoskey is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Petoskey?',
        a: 'Sign the Michigan abolition petition, contact your Petoskey state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Gladwin (Gladwin County) ------------------------------
  {
    slug: 'gladwin',
    name: 'Gladwin',
    region: 'Gladwin County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 44.0296,
    longitude: -84.4968,
    houseDistricts: [99],
    senateDistricts: [34],
    historyParagraphs: [
      'Gladwin is the seat of Gladwin County — a small central-Michigan city on the Sugar River, home to the Gladwin County Historical Museum and a strong hunting-and-fishing tourism trade.',
      'The Catholic and Baptist churches in Gladwin hold the historic pro-life teaching. Rural central Michigan\'s political culture is Republican-leaning and receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Gladwin.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Gladwin?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Gladwin. If your Gladwin-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Gladwin?',
        a: 'Gladwin is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Gladwin?',
        a: 'Sign the Michigan abolition petition, contact your Gladwin state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Ironwood (Gogebic County) ------------------------------
  {
    slug: 'ironwood',
    name: 'Ironwood',
    region: 'Gogebic County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 46.4638,
    longitude: -90.1588,
    houseDistricts: [110],
    senateDistricts: [38],
    historyParagraphs: [
      'Ironwood is the largest city in Gogebic County — Michigan\'s westernmost city, on the Wisconsin border. Historically an iron-mining boomtown, now a Big Snow Country ski-and-snowmobile-tourism economy.',
      'The Catholic and Finnish-Lutheran churches in Ironwood hold the historic teaching against abortion. The western Upper Peninsula\'s independent political culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Ironwood.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Ironwood?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Ironwood. If your Ironwood-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Ironwood?',
        a: 'Ironwood is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Ironwood?',
        a: 'Sign the Michigan abolition petition, contact your Ironwood state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Alma (Gratiot County) ------------------------------
  {
    slug: 'alma',
    name: 'Alma',
    region: 'Gratiot County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 43.3809,
    longitude: -84.6635,
    houseDistricts: [92],
    senateDistricts: [34],
    historyParagraphs: [
      'Alma is the largest city in Gratiot County — home to Alma College (Presbyterian-affiliated) and the annual Highland Festival (Michigan\'s largest Scottish festival). Central Michigan agricultural belt.',
      'Alma College\'s Presbyterian heritage and Alma\'s Catholic parish network both carry the historic pro-life teaching. The abolitionist argument fits the confessional theological character of the city.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Alma.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Alma?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Alma. If your Alma-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Alma?',
        a: 'Alma is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Alma?',
        a: 'Sign the Michigan abolition petition, contact your Alma state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Hillsdale (Hillsdale County) ------------------------------
  {
    slug: 'hillsdale',
    name: 'Hillsdale',
    region: 'Hillsdale County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 41.924,
    longitude: -84.6208,
    houseDistricts: [35],
    senateDistricts: [16],
    historyParagraphs: [
      'Hillsdale is the seat of Hillsdale County — home of Hillsdale College, the classical-education / conservative-Christian liberal-arts institution. The city\'s civic identity is inseparable from the college\'s theological and political vision.',
      'Hillsdale College\'s public stance on the sanctity of human life is unambiguous. The abolitionist argument in Hillsdale has one of the most-natural theological audiences in the state — the college\'s own students and faculty.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Hillsdale.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Hillsdale?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Hillsdale. If your Hillsdale-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Hillsdale?',
        a: 'Hillsdale is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Hillsdale?',
        a: 'Sign the Michigan abolition petition, contact your Hillsdale state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Bad Axe (Huron County) ------------------------------
  {
    slug: 'bad-axe',
    name: 'Bad Axe',
    region: 'Huron County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 43.8067,
    longitude: -83.0054,
    houseDistricts: [98],
    senateDistricts: [25],
    historyParagraphs: [
      'Bad Axe is the seat of Huron County — the Thumb-region agricultural anchor, named after a broken axe found by early surveyors. Its economy is farming, wind energy, and small-town retail.',
      'The Catholic and Lutheran churches in Bad Axe hold the historic pro-life teaching. Huron County\'s independent Thumb-region political culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Bad Axe.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Bad Axe?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Bad Axe. If your Bad Axe-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Bad Axe?',
        a: 'Bad Axe is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Bad Axe?',
        a: 'Sign the Michigan abolition petition, contact your Bad Axe state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Tawas City (Iosco County) ------------------------------
  {
    slug: 'tawas-city',
    name: 'Tawas City',
    region: 'Iosco County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 44.2675,
    longitude: -83.5449,
    houseDistricts: [99],
    senateDistricts: [36],
    historyParagraphs: [
      'Tawas City is the seat of Iosco County — a Lake Huron shore city, home to Tawas Point State Park and the annual Perchville USA winter festival.',
      'Northeast Michigan\'s Catholic and Lutheran churches hold the historic pro-life teaching. The Sunrise Coast\'s political culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Tawas City.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Tawas City?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Tawas City. If your Tawas City-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Tawas City?',
        a: 'Tawas City is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Tawas City?',
        a: 'Sign the Michigan abolition petition, contact your Tawas City state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Iron River (Iron County) ------------------------------
  {
    slug: 'iron-river',
    name: 'Iron River',
    region: 'Iron County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 46.093,
    longitude: -88.646,
    houseDistricts: [110],
    senateDistricts: [38],
    historyParagraphs: [
      'Iron River is a small Upper Peninsula city — historically an iron-mining boomtown, now a small resort-and-hunting economy in Iron County.',
      'The Catholic and Finnish-Lutheran churches in Iron River hold the historic teaching against abortion. The western UP\'s independent political culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Iron River.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Iron River?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Iron River. If your Iron River-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Iron River?',
        a: 'Iron River is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Iron River?',
        a: 'Sign the Michigan abolition petition, contact your Iron River state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Kalkaska (Kalkaska County) ------------------------------
  {
    slug: 'kalkaska',
    name: 'Kalkaska',
    region: 'Kalkaska County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 44.7355,
    longitude: -85.1207,
    houseDistricts: [104],
    senateDistricts: [36],
    historyParagraphs: [
      'Kalkaska is the seat of Kalkaska County — a small northern-Michigan village, home to the annual National Trout Festival and the Kalkaska Historic Railway.',
      'Northern Michigan\'s Catholic and evangelical churches hold the historic pro-life teaching. Kalkaska County\'s rural political culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Kalkaska.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Kalkaska?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Kalkaska. If your Kalkaska-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Kalkaska?',
        a: 'Kalkaska is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Kalkaska?',
        a: 'Sign the Michigan abolition petition, contact your Kalkaska state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Copper Harbor (Keweenaw County) ------------------------------
  {
    slug: 'copper-harbor',
    name: 'Copper Harbor',
    region: 'Keweenaw County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 47.4716,
    longitude: -87.9463,
    houseDistricts: [110],
    senateDistricts: [38],
    historyParagraphs: [
      'Copper Harbor is the northernmost point of Michigan — a tiny unincorporated community at the tip of the Keweenaw Peninsula, home to Fort Wilkins Historic State Park and one of the darkest night skies in the eastern US.',
      'Keweenaw County\'s Catholic and Finnish-Lutheran heritage — descendants of the copper-mining boom\'s immigrant families — holds the historic teaching against abortion. The northernmost tip of Michigan is receptive to the abolitionist argument in its own quiet way.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Copper Harbor.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Copper Harbor?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Copper Harbor. If your Copper Harbor-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Copper Harbor?',
        a: 'Copper Harbor is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Copper Harbor?',
        a: 'Sign the Michigan abolition petition, contact your Copper Harbor state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Baldwin (Lake County) ------------------------------
  {
    slug: 'baldwin',
    name: 'Baldwin',
    region: 'Lake County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 43.8894,
    longitude: -85.8819,
    houseDistricts: [101],
    senateDistricts: [33],
    historyParagraphs: [
      'Baldwin is the seat of Lake County — a small Northern Michigan village on the Pere Marquette River, home to the Idlewild resort community (historically Michigan\'s most-important African-American resort during segregation).',
      'The Baptist and Catholic churches in Baldwin hold the historic pro-life teaching. Rural Lake County\'s Republican-leaning political culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Baldwin.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Baldwin?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Baldwin. If your Baldwin-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Baldwin?',
        a: 'Baldwin is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Baldwin?',
        a: 'Sign the Michigan abolition petition, contact your Baldwin state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Suttons Bay (Leelanau County) ------------------------------
  {
    slug: 'suttons-bay',
    name: 'Suttons Bay',
    region: 'Leelanau County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 44.9656,
    longitude: -85.6423,
    houseDistricts: [103],
    senateDistricts: [37],
    historyParagraphs: [
      'Suttons Bay is a small village on Grand Traverse Bay — the leelanau-peninsula wine country\'s largest incorporated municipality, home to the annual Leland Wine and Food Festival.',
      'The Catholic and evangelical Protestant churches in the Leelanau Peninsula hold the historic pro-life teaching. Northwest Michigan\'s political culture is trending purple but receptive to arguments made on their merits.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Suttons Bay.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Suttons Bay?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Suttons Bay. If your Suttons Bay-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Suttons Bay?',
        a: 'Suttons Bay is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Suttons Bay?',
        a: 'Sign the Michigan abolition petition, contact your Suttons Bay state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Newberry (Luce County) ------------------------------
  {
    slug: 'newberry',
    name: 'Newberry',
    region: 'Luce County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 46.3438,
    longitude: -85.515,
    houseDistricts: [108],
    senateDistricts: [38],
    historyParagraphs: [
      'Newberry is the seat of Luce County — the "Moose Capital of Michigan," a small Upper Peninsula village whose economy depends on tourism, trapping, and hunting.',
      'The Catholic and Baptist churches in Newberry hold the historic teaching against abortion. The UP\'s independent political culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Newberry.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Newberry?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Newberry. If your Newberry-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Newberry?',
        a: 'Newberry is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Newberry?',
        a: 'Sign the Michigan abolition petition, contact your Newberry state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- St. Ignace (Mackinac County) ------------------------------
  {
    slug: 'st-ignace',
    name: 'St. Ignace',
    region: 'Mackinac County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 45.9985,
    longitude: -84.6978,
    houseDistricts: [107],
    senateDistricts: [37],
    historyParagraphs: [
      'St. Ignace is the seat of Mackinac County — the small city at the northern end of the Mackinac Bridge, gateway to Mackinac Island. Home to the historic Father Marquette Mission and the Museum of Ojibwa Culture.',
      'St. Ignace\'s Catholic heritage runs to the 1671 Marquette mission. That teaching against abortion has been consistent for 350+ years. The abolitionist argument extends it into civil law.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside St. Ignace.',
    faqs: [
      {
        q: 'Are there abolitionist churches in St. Ignace?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside St. Ignace. If your St. Ignace-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in St. Ignace?',
        a: 'St. Ignace is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in St. Ignace?',
        a: 'Sign the Michigan abolition petition, contact your St. Ignace state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Manistee (Manistee County) ------------------------------
  {
    slug: 'manistee',
    name: 'Manistee',
    region: 'Manistee County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 44.2635,
    longitude: -86.1825,
    houseDistricts: [102],
    senateDistricts: [32],
    historyParagraphs: [
      'Manistee is the seat of Manistee County — a Lake Michigan port city named after the Ojibwe word for "spirit of the woods." Home to the Ramsdell Theatre (an 1903 architectural landmark) and the Little River Casino.',
      'Northwest Michigan\'s Catholic, Reformed, and evangelical Protestant churches hold the historic teaching against abortion. Manistee\'s small-city civic culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Manistee.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Manistee?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Manistee. If your Manistee-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Manistee?',
        a: 'Manistee is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Manistee?',
        a: 'Sign the Michigan abolition petition, contact your Manistee state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Menominee (Menominee County) ------------------------------
  {
    slug: 'menominee',
    name: 'Menominee',
    region: 'Menominee County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 45.1343,
    longitude: -87.6215,
    houseDistricts: [108],
    senateDistricts: [38],
    historyParagraphs: [
      'Menominee is the seat of Menominee County on the Wisconsin border — a small Upper Peninsula city where the Menominee River meets Lake Michigan/Green Bay. Named for the Menominee tribe.',
      'The Catholic and Lutheran churches in Menominee hold the historic pro-life teaching. The southernmost UP\'s political culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Menominee.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Menominee?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Menominee. If your Menominee-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Menominee?',
        a: 'Menominee is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Menominee?',
        a: 'Sign the Michigan abolition petition, contact your Menominee state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Lake City (Missaukee County) ------------------------------
  {
    slug: 'lake-city',
    name: 'Lake City',
    region: 'Missaukee County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 44.3767,
    longitude: -85.0946,
    houseDistricts: [105],
    senateDistricts: [36],
    historyParagraphs: [
      'Lake City is the seat of Missaukee County — a small northern Michigan village on Lake Missaukee, home to the annual Fourth of July celebration and greenwood-tourist economy.',
      'The Catholic and evangelical churches in Lake City hold the historic pro-life teaching. Northern Michigan\'s rural political culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Lake City.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Lake City?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Lake City. If your Lake City-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Lake City?',
        a: 'Lake City is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Lake City?',
        a: 'Sign the Michigan abolition petition, contact your Lake City state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Greenville (Montcalm County) ------------------------------
  {
    slug: 'greenville',
    name: 'Greenville',
    region: 'Montcalm County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 43.1793,
    longitude: -85.2497,
    houseDistricts: [91],
    senateDistricts: [33],
    historyParagraphs: [
      'Greenville is the largest city in Montcalm County — historically a manufacturing hub (Electrolux, then Federal-Mogul), now a smaller diversified economy with a strong Danish-American heritage.',
      'Greenville\'s Reformed, Catholic, and Lutheran churches hold the historic pro-life teaching. Montcalm County\'s Republican-leaning political culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Greenville.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Greenville?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Greenville. If your Greenville-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Greenville?',
        a: 'Greenville is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Greenville?',
        a: 'Sign the Michigan abolition petition, contact your Greenville state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Atlanta (Montmorency County) ------------------------------
  {
    slug: 'atlanta',
    name: 'Atlanta',
    region: 'Montmorency County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 44.9924,
    longitude: -84.148,
    houseDistricts: [106],
    senateDistricts: [36],
    historyParagraphs: [
      'Atlanta is the seat of Montmorency County — a tiny northern Michigan village on M-32, home to the annual Elk Festival (Michigan\'s elk herd concentrates here).',
      'The Catholic and Lutheran churches in Atlanta hold the historic pro-life teaching. Northern Michigan\'s rural political culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Atlanta.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Atlanta?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Atlanta. If your Atlanta-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Atlanta?',
        a: 'Atlanta is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Atlanta?',
        a: 'Sign the Michigan abolition petition, contact your Atlanta state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Fremont (Newaygo County) ------------------------------
  {
    slug: 'fremont',
    name: 'Fremont',
    region: 'Newaygo County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 43.4652,
    longitude: -85.9626,
    houseDistricts: [101],
    senateDistricts: [33],
    historyParagraphs: [
      'Fremont is the largest city in Newaygo County — best known as the home of Gerber Products, the baby-food giant founded here in 1927. Its civic identity is inseparable from the Gerber legacy and its ongoing food-manufacturing employment.',
      'Fremont\'s Reformed, Catholic, and evangelical Protestant churches hold the historic pro-life teaching. West-central Michigan\'s political culture is Republican-leaning and receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Fremont.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Fremont?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Fremont. If your Fremont-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Fremont?',
        a: 'Fremont is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Fremont?',
        a: 'Sign the Michigan abolition petition, contact your Fremont state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Hart (Oceana County) ------------------------------
  {
    slug: 'hart',
    name: 'Hart',
    region: 'Oceana County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 43.7068,
    longitude: -86.3142,
    houseDistricts: [102],
    senateDistricts: [32],
    historyParagraphs: [
      'Hart is the seat of Oceana County — a small Lake Michigan-shore city, home to the annual Oceana County Fair and one of the state\'s most productive asparagus-growing regions (nearby Shelby is the "Asparagus Capital of the World").',
      'The Catholic and Reformed churches in Hart hold the historic pro-life teaching. West-Michigan Reformed theology is unambiguous on the personhood of the preborn.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Hart.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Hart?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Hart. If your Hart-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Hart?',
        a: 'Hart is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Hart?',
        a: 'Sign the Michigan abolition petition, contact your Hart state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- West Branch (Ogemaw County) ------------------------------
  {
    slug: 'west-branch',
    name: 'West Branch',
    region: 'Ogemaw County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 44.279,
    longitude: -84.2286,
    houseDistricts: [99],
    senateDistricts: [36],
    historyParagraphs: [
      'West Branch is the seat of Ogemaw County — a small northern-Michigan city on the Rifle River, home to the West Branch Rose Festival and a strong hunting-and-fishing tourism trade.',
      'The Catholic and evangelical Protestant churches in West Branch hold the historic pro-life teaching. Northern Michigan\'s rural political culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside West Branch.',
    faqs: [
      {
        q: 'Are there abolitionist churches in West Branch?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside West Branch. If your West Branch-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in West Branch?',
        a: 'West Branch is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in West Branch?',
        a: 'Sign the Michigan abolition petition, contact your West Branch state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Ontonagon (Ontonagon County) ------------------------------
  {
    slug: 'ontonagon',
    name: 'Ontonagon',
    region: 'Ontonagon County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 46.8275,
    longitude: -89.3485,
    houseDistricts: [110],
    senateDistricts: [38],
    historyParagraphs: [
      'Ontonagon is the seat of Ontonagon County — a small Upper Peninsula village at the mouth of the Ontonagon River on Lake Superior. Home of the historic Ontonagon Boulder (a 3,700-pound piece of native copper now at the Smithsonian).',
      'The Catholic and Finnish-Lutheran churches in Ontonagon hold the historic teaching against abortion. The western UP\'s independent political culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Ontonagon.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Ontonagon?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Ontonagon. If your Ontonagon-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Ontonagon?',
        a: 'Ontonagon is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Ontonagon?',
        a: 'Sign the Michigan abolition petition, contact your Ontonagon state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Reed City (Osceola County) ------------------------------
  {
    slug: 'reed-city',
    name: 'Reed City',
    region: 'Osceola County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 43.8868,
    longitude: -85.513,
    houseDistricts: [100],
    senateDistricts: [34],
    historyParagraphs: [
      'Reed City is a small central-Michigan city in Osceola County — the historic railroad-junction town at the crossroads of US-131 and US-10, home to the Old Rugged Cross Historical Museum (birthplace of the famous hymn).',
      'The Catholic and Baptist churches in Reed City hold the historic pro-life teaching. Central Michigan\'s rural political culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Reed City.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Reed City?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Reed City. If your Reed City-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Reed City?',
        a: 'Reed City is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Reed City?',
        a: 'Sign the Michigan abolition petition, contact your Reed City state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Mio (Oscoda County) ------------------------------
  {
    slug: 'mio',
    name: 'Mio',
    region: 'Oscoda County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 44.6665,
    longitude: -84.1353,
    houseDistricts: [105],
    senateDistricts: [36],
    historyParagraphs: [
      'Mio is the seat of Oscoda County — a small unincorporated village on the AuSable River, home to Kirtland\'s Warbler habitat (one of the world\'s most endangered songbirds) and a strong outdoor-recreation economy.',
      'The Catholic and Baptist churches in Mio hold the historic pro-life teaching. Northern Michigan\'s rural civic culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Mio.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Mio?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Mio. If your Mio-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Mio?',
        a: 'Mio is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Mio?',
        a: 'Sign the Michigan abolition petition, contact your Mio state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Gaylord (Otsego County) ------------------------------
  {
    slug: 'gaylord',
    name: 'Gaylord',
    region: 'Otsego County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 45.0125,
    longitude: -84.6723,
    houseDistricts: [105],
    senateDistricts: [36],
    historyParagraphs: [
      'Gaylord is the seat of Otsego County — the "Alpine Village" of northern Michigan (its downtown deliberately styled after Alpine architecture), home to a strong ski-and-golf tourism economy.',
      'The Catholic and evangelical Protestant churches in Gaylord hold the historic pro-life teaching. Northern Michigan\'s political culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Gaylord.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Gaylord?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Gaylord. If your Gaylord-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Gaylord?',
        a: 'Gaylord is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Gaylord?',
        a: 'Sign the Michigan abolition petition, contact your Gaylord state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Rogers City (Presque Isle County) ------------------------------
  {
    slug: 'rogers-city',
    name: 'Rogers City',
    region: 'Presque Isle County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 45.4123,
    longitude: -83.8355,
    houseDistricts: [106],
    senateDistricts: [36],
    historyParagraphs: [
      'Rogers City is the seat of Presque Isle County on Lake Huron — home to the world\'s largest limestone quarry (Calcite Quarry) and the annual Nautical City Festival.',
      'The Catholic and Lutheran churches in Rogers City hold the historic pro-life teaching. Northeast Michigan\'s independent political culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Rogers City.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Rogers City?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Rogers City. If your Rogers City-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Rogers City?',
        a: 'Rogers City is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Rogers City?',
        a: 'Sign the Michigan abolition petition, contact your Rogers City state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Houghton Lake (Roscommon County) ------------------------------
  {
    slug: 'houghton-lake',
    name: 'Houghton Lake',
    region: 'Roscommon County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 44.3413,
    longitude: -84.7422,
    houseDistricts: [105],
    senateDistricts: [36],
    historyParagraphs: [
      'Houghton Lake is the largest community in Roscommon County — an unincorporated village on Michigan\'s largest inland lake, home to the annual Tip-Up Town winter festival and a strong summer-cottage tourism economy.',
      'The Catholic and evangelical churches serving Houghton Lake hold the historic pro-life teaching. Roscommon County\'s rural political culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Houghton Lake.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Houghton Lake?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Houghton Lake. If your Houghton Lake-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Houghton Lake?',
        a: 'Houghton Lake is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Houghton Lake?',
        a: 'Sign the Michigan abolition petition, contact your Houghton Lake state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Sandusky (Sanilac County) ------------------------------
  {
    slug: 'sandusky',
    name: 'Sandusky',
    region: 'Sanilac County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 43.4055,
    longitude: -82.8409,
    houseDistricts: [98],
    senateDistricts: [25],
    historyParagraphs: [
      'Sandusky is the seat of Sanilac County — a small Thumb-region city, home to the annual Sanilac County Fair and a strong agricultural / wind-energy economy.',
      'The Catholic and Lutheran churches in Sandusky hold the historic pro-life teaching. The Thumb\'s independent political culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Sandusky.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Sandusky?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Sandusky. If your Sandusky-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Sandusky?',
        a: 'Sandusky is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Sandusky?',
        a: 'Sign the Michigan abolition petition, contact your Sandusky state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Manistique (Schoolcraft County) ------------------------------
  {
    slug: 'manistique',
    name: 'Manistique',
    region: 'Schoolcraft County',
    populationLabel: 'county-seat community',
    population: 3000,
    latitude: 46.0062,
    longitude: -86.2555,
    houseDistricts: [108],
    senateDistricts: [38],
    historyParagraphs: [
      'Manistique is the seat of Schoolcraft County — a small Upper Peninsula city on Lake Michigan, home of the Siphon Bridge (an engineering curiosity where the river runs above the bridge deck).',
      'The Catholic and Finnish-Lutheran churches in Manistique hold the historic pro-life teaching. The UP\'s independent political culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Manistique.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Manistique?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Manistique. If your Manistique-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Manistique?',
        a: 'Manistique is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Manistique?',
        a: 'Sign the Michigan abolition petition, contact your Manistique state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Byron Center ----------------------------
  {
    slug: 'byron-center',
    name: 'Byron Center',
    region: 'Kent County',
    populationLabel: '~4,000 residents',
    population: 4000,
    latitude: 42.8016,
    longitude: -85.7136,
    houseDistricts: [79],
    senateDistricts: [20],
    historyParagraphs: [
      'Byron Center is a small unincorporated community in southern Kent County — a growing bedroom community south of Grand Rapids and Wyoming, home to the Byron Center Public Schools and a strong Dutch-Reformed civic tradition (Byron Center Christian School anchors the confessional-education network).',
      'Byron Center\'s Reformed churches (CRC, RCA, Netherlands Reformed) all teach the personhood of the preborn from conception. The abolitionist argument is the civil-law extension of that theology — one of the most theologically-natural audiences in Michigan for this case.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Byron Center.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Byron Center?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Byron Center. If your Byron Center-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Byron Center?',
        a: 'Byron Center is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Byron Center?',
        a: 'Sign the Michigan abolition petition, contact your Byron Center state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Merrill ---------------------------------
  {
    slug: 'merrill',
    name: 'Merrill',
    region: 'Saginaw County',
    populationLabel: '~1,000 residents',
    population: 1000,
    latitude: 43.3939,
    longitude: -84.3308,
    houseDistricts: [93],
    senateDistricts: [34],
    historyParagraphs: [
      'Merrill is a small village in Saginaw County — a farming community in the rural mid-Michigan corridor between Saginaw and Ithaca.',
      'The Catholic and evangelical churches in Merrill hold the pro-life teaching. Rural mid-Michigan\'s political culture is Republican-leaning and open to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Merrill.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Merrill?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Merrill. If your Merrill-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Merrill?',
        a: 'Merrill is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Merrill?',
        a: 'Sign the Michigan abolition petition, contact your Merrill state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Standish --------------------------------
  {
    slug: 'standish',
    name: 'Standish',
    region: 'Arenac County',
    populationLabel: '~1,000 residents',
    population: 1500,
    latitude: 43.9847,
    longitude: -83.9558,
    houseDistricts: [99],
    senateDistricts: [36],
    historyParagraphs: [
      'Standish is the seat of Arenac County — a small Northern Michigan city on the M-13 / I-75 corridor, home of the Standish Prison (Michigan\'s largest men\'s prison) and a rural civic identity.',
      'The Catholic and evangelical churches in Standish hold the historic pro-life teaching. Northeast Michigan\'s rural political culture is receptive to the abolitionist case.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Standish.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Standish?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Standish. If your Standish-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Standish?',
        a: 'Standish is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Standish?',
        a: 'Sign the Michigan abolition petition, contact your Standish state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },
  // -------- Benton Harbor ------------------------------
  {
    slug: 'benton-harbor',
    name: 'Benton Harbor',
    region: 'Berrien County',
    populationLabel: '~9,000 residents',
    population: 9000,
    latitude: 42.1086,
    longitude: -86.4234,
    houseDistricts: [38],
    senateDistricts: [20],
    historyParagraphs: [
      "Benton Harbor sits on the Lake Michigan shore across the St. Joseph River from its twin city, St. Joseph. Historically the industrial engine of southwest Michigan — Whirlpool Corporation was founded here in 1911, and Benton Harbor was the majority employer through the mid-20th century. The city's demographics are a study in the racial-economic geography of America: Benton Harbor is 85% Black, one of the most Black-majority cities in Michigan; St. Joseph, just across the river, is 89% white. The Whirlpool jobs moved out; Benton Harbor bore the collapse.",
      "That racial-economic history is the pastoral context for the abolitionist argument here. Abortion facilities in America disproportionately locate in and serve majority-Black communities; the Black church tradition — Baptist, AME, COGIC — has long held that this pattern is a civil-rights concern. The abolitionist framing that abortion is homicide and Black preborn lives are equally protected under the law extends the historic Black-Baptist opposition to abortion into civil-code terms.",
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Benton Harbor city limits. The closest provider is Planned Parenthood in Kalamazoo (see the nearby-cities strip below).',
    faqs: [
      {
        q: 'Are there abolitionist churches in Benton Harbor?',
        a: "We're not yet aware of any publicly-abolitionist churches inside Benton Harbor city limits. Benton Harbor has a strong historic Black-Baptist / AME / COGIC network — if your Benton Harbor church has taken a public stand for abolition, reach out.",
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Benton Harbor?',
        a: 'Benton Harbor is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Benton Harbor?',
        a: 'Sign the Michigan abolition petition, contact your Benton Harbor state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },
  // -------- Milford ----------------------------------------
  {
    slug: 'milford',
    name: 'Milford',
    region: 'Oakland County',
    populationLabel: '~6,000 residents',
    population: 6000,
    latitude: 42.5758,
    longitude: -83.5924,
    houseDistricts: [51],
    senateDistricts: [23],
    historyParagraphs: [
      "Milford is a wealthy small city in western Oakland County — home to the historic Milford Independence Fest, GM's Milford Proving Ground (the largest automotive testing facility in the world), and a strong small-town civic culture.",
      "The Catholic and evangelical Protestant churches in Milford hold the traditional pro-life teaching. Milford's demographic character — family, wealthy, Republican-leaning — is receptive to the abolitionist argument.",
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Milford.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Milford?',
        a: "We're not yet aware of any publicly-abolitionist churches inside Milford. If your Milford-area church has adopted an abolition resolution, reach out.",
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Milford?',
        a: 'Milford is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Milford?',
        a: 'Sign the Michigan abolition petition, contact your Milford state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },
];

export function getCityBySlug(slug: string): CityConfig | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export function getAllCitySlugs(): string[] {
  return CITIES.map((c) => c.slug);
}

/**
 * Great-circle distance in miles between two lat/lng points. Used by
 * the "nearby cities" strip.
 */
function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3959; // earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Nearest N cities to the given one, sorted by distance ascending.
 * We deliberately don't cap by radius — with a small covered set,
 * "everywhere in MI" is a better next-click than dead space. Once
 * the dataset grows past ~30 cities we can add a distance cap.
 */
export function getNearbyCities(fromSlug: string, limit = 5): Array<CityConfig & { distanceMiles: number }> {
  const from = getCityBySlug(fromSlug);
  if (!from) return [];
  return CITIES.filter((c) => c.slug !== fromSlug)
    .map((c) => ({ ...c, distanceMiles: haversineMiles(from.latitude, from.longitude, c.latitude, c.longitude) }))
    .sort((a, b) => a.distanceMiles - b.distanceMiles)
    .slice(0, limit);
}
