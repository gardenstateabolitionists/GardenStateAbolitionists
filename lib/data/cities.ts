import citiesData from '@/data/nj-cities.json';

/**
 * City landing pages.
 *
 * The facts — population, county, centroid, legislative districts, which
 * facilities sit inside the municipality — are generated into
 * `data/nj-cities.json` and must not be hand-edited. The *writing* lives here,
 * keyed by slug, because a page with templated prose is worth nothing to a
 * reader and nothing to search.
 *
 * A city ships only when it has authored content. `CITIES` is the intersection
 * of the generated facts and the `CONTENT` map below, so adding a city is a
 * matter of writing its entry — and a half-finished one simply does not appear
 * rather than publishing a thin page.
 *
 * Two things differ structurally from the Michigan original this was forked
 * from, and both are load-bearing:
 *
 * 1. `districts` is ONE list, not separate house and senate sets. New Jersey
 *    elects one senator and two assembly members from each of the same 40
 *    districts. This was verified rather than assumed: the state's upper and
 *    lower district polygons differ in area by 0.000000%.
 *
 * 2. Facilities are matched by GEOCODED municipality, never by the mailing
 *    city on the address. New Jersey addresses routinely name a place that is
 *    not the municipality — "Somerset" is a neighbourhood of Franklin
 *    Township, "Hamilton Square" of Hamilton Township — and names repeat
 *    across counties. The "Washington, NJ" facility is in Washington BOROUGH,
 *    Warren County; Washington TOWNSHIP, Gloucester County is a different
 *    place sixty miles south. Matching on name put a clinic on the wrong
 *    city's page.
 */

export interface CityFaq {
  q: string;
  /** Plain text — this is rendered into FAQPage JSON-LD and must not contain HTML. */
  a: string;
  /** Phrases in `a` to turn into links when rendered. `a` itself stays plain for the schema. */
  links?: Array<{ phrase: string; href: string }>;
}

/** The generated half. Mirrors one entry in data/nj-cities.json. */
interface CityFacts {
  slug: string;
  name: string;
  kind: string;
  /** "Hamilton Township" — bare "Hamilton" is ambiguous between Mercer and Atlantic counties. */
  formalName: string;
  county: string;
  population: number;
  populationLabel: string;
  latitude: number;
  longitude: number;
  districts: number[];
  facilityIds: string[];
}

/** The authored half. */
interface CityContent {
  /** Two or more paragraphs written for this city specifically. */
  historyParagraphs: string[];
  /** Framing above the facility list. Omitted where the municipality has none. */
  abortionLandscapeIntro: string;
  abortionLandscapeOutro?: string;
  faqs: CityFaq[];
}

export type CityConfig = CityFacts & CityContent;

const FACTS: CityFacts[] = (citiesData as { cities: CityFacts[] }).cities;

/**
 * Written per city. See the module comment: a slug missing from here does not
 * render, by design.
 *
 * Every historical claim traces to `data/nj-abolition-history.json`, which
 * carries the source for each. Nothing here asserts local colour that has not
 * been checked — a page that is thin but true is worth more to this client than
 * one padded with civic trivia.
 */
const CONTENT: Record<string, CityContent> = {
  newark: {
    historyParagraphs: [
      'Newark is the largest city in New Jersey, and it grew up in a county that held people as property. The 1800 federal census counted 1,719 Black residents of Essex County, of whom 1,521 were enslaved — nearly nine in ten. The commercial centre this city became was built while that was the ordinary arrangement of local life.',
      'New Jersey did not refuse to end slavery. It ended it gradually. The 1804 act freed nobody living: it provided only that children born to enslaved mothers after that July would go free — women at 21, men at 25 — so a child born in Newark in the summer of 1804 still owed a quarter century of unpaid work before the law would let them go. In 1846 the state passed another act said to abolish slavery, which in fact renamed the enslaved "apprentices" bound to their present owners. Eighteen people were still held in New Jersey in 1860. That is what gradual abolition looks like from the inside, and it is why an abolition bill has to end the thing outright.',
    ],
    abortionLandscapeIntro:
      'Two abortion facilities operate inside Newark city limits, both run by Planned Parenthood — one in the Ironbound and one on Mulberry Street downtown:',
    abortionLandscapeOutro:
      'Newark is large enough to be split across two legislative districts, one of only two municipalities in the state that are. The senators and assembly members below represent this city in Trenton, and their recorded votes on the Freedom of Reproductive Choice Act are shown as cast.',
    faqs: [
      {
        q: 'Is there an abolitionist group in Newark?',
        a: 'Garden State Abolitionists covers Newark along with the rest of New Jersey. There is no separate Newark-only group. Contact us if you would like to help start local work here.',
        links: [{ phrase: 'Contact us', href: '/contact' }],
      },
      {
        q: 'Who represents Newark in the New Jersey Legislature?',
        a: 'Newark is split between Legislative Districts 28 and 29. New Jersey elects one senator and two assembly members from each district, so the city is represented by six people in total. They are listed on this page with their contact details and their recorded vote on the Freedom of Reproductive Choice Act.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'Nobody can tell you exactly, because New Jersey does not report the number. Abortion reporting to the CDC is voluntary and New Jersey is one of four jurisdictions that declines, and the state Department of Health publishes no count of its own at any level. The best available independent estimate is the Guttmacher Institute\'s: about 61,200 abortions provided by clinicians in New Jersey in 2025.',
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition means the immediate and total end of abortion, criminalised as homicide, with no exceptions, from the moment of fertilisation. That is different from the mainstream pro-life position, which accepts exceptions and pursues abortion\'s reduction by degrees. See What we believe for the case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate and total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalised as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  trenton: {
    historyParagraphs: [
      'Trenton is where New Jersey decides things, which makes its record the state\'s record. It was this legislature that passed the 1804 Gradual Abolition Act freeing no living person; this legislature that in 1846 converted the remaining enslaved into "apprentices" bound to their owners for life; and this legislature that on 16 March 1865 voted down the Thirteenth Amendment to the United States Constitution. The amendment abolishing slavery became law without New Jersey on 6 December that year. The state ratified it on 23 January 1866 — seven weeks after it was already binding, and only once an election had replaced the men who voted no.',
      'That is not a distant embarrassment. It is the same building, and it is the reason this site exists in the form it does. The 1860 census still recorded an enslaved person living in Lawrence Township, in this county, fifty-six years after New Jersey began abolishing slavery. Every one of those delays was defended at the time as the realistic step — the most that could pass, the achievable advance. Gradualism is not abolition arriving slowly. It is a law that names a class of human beings whose protection can wait.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates in Trenton, a Planned Parenthood health centre on East State Street — the same street as the State House:',
    abortionLandscapeOutro:
      'The Freedom of Reproductive Choice Act was passed in this city in January 2022. The legislators below represent Trenton itself, and how each of them voted is recorded here as cast.',
    faqs: [
      {
        q: 'Who represents Trenton in the New Jersey Legislature?',
        a: 'Trenton sits in Legislative District 15, which elects one senator and two assembly members. All three are listed on this page with contact details and their recorded vote on the Freedom of Reproductive Choice Act.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'What is the Freedom of Reproductive Choice Act?',
        a: 'It is the 2022 New Jersey law, S49 and A6260, that wrote a statutory right to abortion into state law with no limit by gestational age. It is the statute any bill of abolition in New Jersey would have to repeal by name — a new prohibition sitting alongside it would simply be void.',
        links: [
          { phrase: 'bill of abolition', href: '/abolition-bills' },
          { phrase: 'repeal by name', href: '/abolition-bills/components' },
        ],
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. No bill of abolition and no equal-protection bill has been introduced in the New Jersey Legislature. This is the standard to hold one to when it is, and the standard to hold a legislator to in the meantime.',
        links: [{ phrase: 'the standard', href: '/abolition-bills/components' }],
      },
      {
        q: 'How can I get involved in Trenton?',
        a: 'Sign the petition, contact the three legislators who represent this city, and share this page with your church. If your congregation would consider taking a public position, reach out and we will send you what we have.',
        links: [
          { phrase: 'Sign the petition', href: '/the-petition' },
          { phrase: 'reach out', href: '/contact' },
        ],
      },
    ],
  },

  'jersey-city': {
    historyParagraphs: [
      'Jersey City is the second largest city in New Jersey and, with Newark, one of only two municipalities big enough to be split across more than one legislative district. It sits in Hudson County, across the water from Manhattan, and has spent its whole history as a place people arrive in.',
      'The state those arrivals joined was the last in the North to free its slaves. New Jersey chose gradual abolition in 1804 — freeing no one then living, and binding children born afterward until 21 or 25. In 1846 it passed a second act said to end slavery, which renamed the remaining enslaved as "apprentices" bound to their owners. Eighteen people were still held here in 1860, and the legislature voted the Thirteenth Amendment down in March 1865. Every step was defended as the achievable one. That is the argument this organisation exists to refuse when it is made again.',
    ],
    abortionLandscapeIntro:
      'No abortion facility is recorded inside Jersey City limits in our directory. That is a statement about our list, not a claim that none exists — if you know of one operating here, tell us and we will verify and add it. The nearest recorded facilities are in Newark and East Orange:',
    abortionLandscapeOutro:
      'Jersey City is split between Legislative Districts 31 and 32, so six people represent it in Trenton. Their recorded votes on the Freedom of Reproductive Choice Act are shown below.',
    faqs: [
      {
        q: 'Who represents Jersey City in the New Jersey Legislature?',
        a: 'Jersey City is split between Legislative Districts 31 and 32. New Jersey elects one senator and two assembly members per district, so six people represent the city in total. All are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Are there abolitionist churches in Jersey City?',
        a: 'None that we know of. We read every New Jersey congregation in the church directory we work from — 106 of them — and found one publicly abolitionist church in the whole state, and it is not in this city. If your church has taken a public position, tell us and we will list it.',
        links: [{ phrase: 'tell us', href: '/contact' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey does not report the figure. It is one of four jurisdictions that declines to report abortion data to the CDC, and its Department of Health publishes no count at any geography. The Guttmacher Institute estimates about 61,200 abortions provided by clinicians in New Jersey in 2025.',
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition means the immediate and total end of abortion, criminalised as homicide, with no exceptions, from the moment of fertilisation — as distinct from reducing abortion by degrees while accepting exceptions.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
        ],
      },
    ],
  },

  camden: {
    historyParagraphs: [
      'Camden County holds the only African-American community ever incorporated as a municipality in New Jersey. Snow Hill — later Free Haven, now Lawnside — was settled by free and self-freed Black families a few miles from this city, and it was a station on the Underground Railroad. The Reverend Peter Mott built his house there in 1845 and used it to shelter people escaping slavery. It still stands, the oldest house in Lawnside, and is now a museum of the railroad it served.',
      'What those families were escaping, New Jersey was still practising. This state was the last in the North to free its slaves: gradual abolition in 1804 that freed no living person, a second act in 1846 that renamed the enslaved "apprentices" bound to their owners, eighteen people still held in 1860, and a legislature that voted down the Thirteenth Amendment in March 1865. The people sheltering at the Mott house were fleeing the logic of gradualism as much as any single owner — the argument that some human beings\' freedom is a thing to be phased in.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates in Camden, a Planned Parenthood centre on Broadway:',
    abortionLandscapeOutro:
      'Camden sits in Legislative District 5. Its senator and two assembly members are below, with their recorded votes on the Freedom of Reproductive Choice Act.',
    faqs: [
      {
        q: 'Who represents Camden in the New Jersey Legislature?',
        a: 'Camden is in Legislative District 5, which elects one senator and two assembly members. All three are listed on this page with their contact details and recorded FRCA vote.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'What is the Underground Railroad connection near Camden?',
        a: 'Lawnside, a few miles from Camden, is the only African-American community ever incorporated as a municipality in New Jersey. It began as Snow Hill, a settlement of free and self-freed Black families, and was a station on the Underground Railroad. The Peter Mott House, built in 1845 and used to shelter people escaping slavery, is now a museum.',
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. No bill of abolition and no equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
      {
        q: 'How can I get involved in Camden?',
        a: 'Sign the petition, contact the three legislators who represent this city, and share this page with your church.',
        links: [
          { phrase: 'Sign the petition', href: '/the-petition' },
          { phrase: 'contact', href: '/contact' },
        ],
      },
    ],
  },

  paterson: {
    historyParagraphs: [
      'Paterson is New Jersey\'s third largest city and sits in Passaic County, in the north of a state that took sixty years to stop holding people as property. It is a working city, and has been since it was founded as one.',
      'New Jersey was the last northern state to free its slaves, and it did it by degrees. The 1804 Gradual Abolition Act freed no one then alive — it provided that children born to enslaved mothers afterwards would go free at 21 if they were women and 25 if they were men. In 1846 a second act said to abolish slavery converted those still held into "apprentices" bound to their present owners. Eighteen people remained enslaved in this state in 1860, and in March 1865 the legislature voted against the Thirteenth Amendment. Each delay had its defenders, and each was called realism.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates in Paterson, a Planned Parenthood centre on Broadway:',
    abortionLandscapeOutro:
      'Paterson sits entirely within Legislative District 35. Its senator and two assembly members are listed below with their recorded votes on the Freedom of Reproductive Choice Act.',
    faqs: [
      {
        q: 'Who represents Paterson in the New Jersey Legislature?',
        a: 'Paterson is in Legislative District 35, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Are there abolitionist churches in Paterson?',
        a: 'None that we know of. The church directory we work from holds no Paterson congregation that has taken a public abolitionist position. If yours has, tell us and we will list it.',
        links: [{ phrase: 'tell us', href: '/contact' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey does not report it. The state is one of four jurisdictions that declines to report abortion data to the CDC, and publishes no count of its own. Guttmacher estimates about 61,200 abortions provided by clinicians in New Jersey in 2025.',
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'The immediate and total end of abortion, criminalised as homicide, with no exceptions, from fertilisation.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
        ],
      },
    ],
  },

  lakewood: {
    historyParagraphs: [
      'Lakewood is the fourth largest municipality in New Jersey and one of the fastest growing: the Census Bureau put it at 135,123 in 2020 and 141,985 in 2024, a rise of about 5% in four years. It is a township where religious conviction visibly orders public life, which is worth saying plainly on a page like this — the case against abortion made here is a religious case, made in public, and it does not pretend otherwise.',
      'Ocean County did not exist for most of the period that matters to this argument. It was set off from Monmouth County in February 1850, ten years before the last federal census to count enslaved people in New Jersey. From 1737 until 1800 the densest slaveholding in the state was in Bergen, Monmouth and Somerset — and Lakewood was in Monmouth through all of it. New Jersey was the last northern state to free its slaves, and it did so by degrees: nobody living was freed in 1804, the remaining enslaved were renamed "apprentices" in 1846, eighteen were still held in 1860, and the legislature voted down the Thirteenth Amendment in March 1865.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Lakewood Township. That is a fact about a list, not a guarantee — if you know of one here, tell us and we will verify it and add it.',
    abortionLandscapeOutro:
      'Lakewood sits in Legislative District 30. Its senator and two assembly members are below, with their recorded votes on the Freedom of Reproductive Choice Act.',
    faqs: [
      {
        q: 'Who represents Lakewood in the New Jersey Legislature?',
        a: 'Lakewood is in Legislative District 30, which elects one senator and two assembly members. All three are listed on this page with contact details and their recorded FRCA vote.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. Neither a bill of abolition nor an equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'The state does not report it, and publishes no count at any geography. Guttmacher estimates about 61,200 abortions provided by clinicians in New Jersey in 2025.',
      },
    ],
  },

  edison: {
    historyParagraphs: [
      'Edison is the sixth largest municipality in New Jersey and sits in Middlesex County, in the middle of the state.',
      'The 1800 federal census counted 1,827 Black residents of Middlesex County. Of those, 1,564 were enslaved — more than five in six. Being Black and being free were not the same thing in this county, and the law New Jersey passed four years later did not make them so. The 1804 Gradual Abolition Act freed nobody then living; it provided only that children born to enslaved mothers afterwards would go free at 21 if they were women and 25 if they were men. In 1846 the state passed a second act said to abolish slavery, which renamed those still held as "apprentices" bound to their present owners. Eighteen people were still held in New Jersey in 1860.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Edison Township. If you know of one, tell us and we will verify and add it.',
    abortionLandscapeOutro:
      'Edison is in Legislative District 18. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Edison in the New Jersey Legislature?',
        a: 'Edison is in Legislative District 18, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'The immediate and total end of abortion, criminalised as homicide, with no exceptions, from the moment of fertilisation.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
        ],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey does not report it. It is one of four jurisdictions that declines to report abortion data to the CDC. Guttmacher estimates about 61,200 in 2025.',
      },
    ],
  },

  woodbridge: {
    historyParagraphs: [
      'Woodbridge is the seventh largest municipality in New Jersey, a township of nearly forty distinct neighbourhoods in the north of Middlesex County.',
      'Middlesex was among the heaviest slaveholding counties in the state. In 1800 it counted 1,827 Black residents, 1,564 of them enslaved. New Jersey then took sixty years to let go: gradual abolition in 1804 that freed no living person, a second act in 1846 that renamed the enslaved as "apprentices" bound for life to their owners, eighteen people still held in 1860, and a legislature that rejected the Thirteenth Amendment in March 1865 before ratifying it in January 1866 — after it was already law. Every one of those delays was argued for as the realistic step.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Woodbridge Township. The nearest recorded facility is in Perth Amboy, which borders it.',
    abortionLandscapeOutro:
      'Woodbridge is in Legislative District 19, the same district as Perth Amboy and Sayreville. Its three legislators are below.',
    faqs: [
      {
        q: 'Who represents Woodbridge in the New Jersey Legislature?',
        a: 'Woodbridge is in Legislative District 19, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Where is the nearest abortion facility?',
        a: 'The nearest one in our directory is the Planned Parenthood centre in Perth Amboy, the municipality directly south. Every facility we know of in the state is mapped on our abortion facilities page.',
        links: [{ phrase: 'abortion facilities page', href: '/abortion-mills' }],
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. No bill of abolition and no equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
    ],
  },

  'toms-river': {
    historyParagraphs: [
      'Toms River is the county seat of Ocean County and its largest municipality, on the shore in the centre of the county.',
      'Ocean County was created out of Monmouth County in February 1850. That matters for a page about abolition, because Monmouth was one of the three counties — with Bergen and Somerset — where slaveholding in New Jersey was densest from 1737 until 1800. This shore was inside that county for the whole of the period. New Jersey was the last northern state to free its slaves and did it by stages: no living person freed in 1804, the remaining enslaved renamed "apprentices" in 1846, eighteen still held in 1860.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Toms River Township.',
    abortionLandscapeOutro:
      'Toms River is in Legislative District 10, which it shares with Brick. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Toms River in the New Jersey Legislature?',
        a: 'Toms River is in Legislative District 10, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey publishes no count, at any geography, and does not report to the CDC. Guttmacher estimates about 61,200 abortions provided by clinicians in the state in 2025.',
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'The immediate and total end of abortion, criminalised as homicide, with no exceptions, from fertilisation — not its reduction by degrees.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'reduction by degrees', href: '/what-we-believe/immediate-not-gradual' },
        ],
      },
    ],
  },

  hamilton: {
    historyParagraphs: [
      'Hamilton Township sits in Mercer County, next to Trenton and the State House. Note the name: there is another Hamilton Township in Atlantic County, and the abortion facility here is addressed to "Hamilton Square", a neighbourhood rather than a municipality. New Jersey is full of that kind of thing, and it is why every facility on this site is located by coordinates rather than by the city printed on its mail.',
      'Mercer County was created in 1838, taking Trenton from Hunterdon. Twenty-two years later the 1860 federal census still recorded an enslaved person living in Lawrence Township, in this county — fifty-six years after New Jersey passed the act that was supposed to end slavery. The 1804 act freed no one living. The 1846 act that followed did not free the rest; it renamed them "apprentices" bound to their present owners. That is what a law looks like when it is written to be passed rather than to work.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates in Hamilton Township — a Planned Parenthood health centre on Route 33, addressed to Hamilton Square:',
    abortionLandscapeOutro:
      'Hamilton is in Legislative District 14. Its senator and two assembly members are below with their recorded votes on the Freedom of Reproductive Choice Act, which was passed a few miles away in Trenton.',
    faqs: [
      {
        q: 'Who represents Hamilton Township in the New Jersey Legislature?',
        a: 'Hamilton Township, Mercer County is in Legislative District 14, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Is the Hamilton Health Center in Hamilton or Hamilton Square?',
        a: 'Both, in a sense. Hamilton Square is a neighbourhood inside Hamilton Township, not a municipality of its own. The facility is in Hamilton Township, Mercer County, in Legislative District 14.',
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. Neither a bill of abolition nor an equal-protection bill has been introduced, including by the legislators who sit a few miles from here.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
    ],
  },

  clifton: {
    historyParagraphs: [
      'Clifton is the eleventh largest municipality in New Jersey, in the south of Passaic County between Paterson and Newark.',
      'Passaic County was created on 7 February 1837 out of parts of Bergen and Essex — which were, in the 1800 census, the first and sixth counties in the state by enslaved population. Bergen held 2,825 people, 18.6% of everyone living there; Essex held 1,521. This ground was inside those counties while that was true. New Jersey then spent sixty years declining to finish what it had started: gradual abolition in 1804, a renaming in 1846, eighteen people still held in 1860, and a vote against the Thirteenth Amendment in March 1865.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Clifton. The nearest are in Paterson to the north and Montclair to the south.',
    abortionLandscapeOutro:
      'Clifton is in Legislative District 27. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Clifton in the New Jersey Legislature?',
        a: 'Clifton is in Legislative District 27, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Where is the nearest abortion facility?',
        a: 'The nearest facilities in our directory are the Planned Parenthood centre in Paterson and two in Montclair. All of them are mapped on our abortion facilities page.',
        links: [{ phrase: 'abortion facilities page', href: '/abortion-mills' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey does not say. It publishes no count and does not report to the CDC. Guttmacher estimates about 61,200 in 2025.',
      },
    ],
  },

  'cherry-hill': {
    historyParagraphs: [
      'Cherry Hill is the largest municipality in Camden County and, on the Census Bureau\'s estimates, the fastest growing of New Jersey\'s fifty largest — from 74,543 residents in 2020 to 78,988 in 2024.',
      'Camden County holds Lawnside, the only African-American community ever incorporated as a municipality in this state. It began as Snow Hill, a settlement of free and self-freed Black families, and it was a station on the Underground Railroad; the Reverend Peter Mott built a house there in 1845 and used it to shelter people escaping slavery. What they were escaping, New Jersey was still practising. This was the last northern state to free its slaves — no living person freed in 1804, the remaining enslaved renamed "apprentices" in 1846, eighteen still held in 1860.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates in Cherry Hill — an independent clinic on Kings Highway North, not part of the Planned Parenthood network:',
    abortionLandscapeOutro:
      'Cherry Hill is in Legislative District 6. Its senator and two assembly members are below with their recorded FRCA votes.',
    faqs: [
      {
        q: 'Who represents Cherry Hill in the New Jersey Legislature?',
        a: 'Cherry Hill is in Legislative District 6, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'What is the Underground Railroad connection nearby?',
        a: 'Lawnside, in the same county, is the only African-American community ever incorporated as a municipality in New Jersey and was a station on the Underground Railroad. The Peter Mott House, built there in 1845 and used to shelter people escaping slavery, is now a museum.',
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. No bill of abolition and no equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
    ],
  },

  brick: {
    historyParagraphs: [
      'Brick Township is on the northern edge of Ocean County, between the Metedeconk River and the shore.',
      'Ocean County was carved out of Monmouth in February 1850 — and Monmouth was one of the three counties, with Bergen and Somerset, where slaveholding in New Jersey was densest from 1737 to 1800. This township was inside Monmouth for all of that. New Jersey was the last northern state to free its slaves, and the manner of it is the point: the 1804 act freed nobody living, the 1846 act renamed those still held as "apprentices" bound to their owners, eighteen people remained enslaved in 1860, and the legislature voted the Thirteenth Amendment down in March 1865 before ratifying it in January 1866, after it was already binding.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Brick Township.',
    abortionLandscapeOutro:
      'Brick shares Legislative District 10 with Toms River. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Brick in the New Jersey Legislature?',
        a: 'Brick is in Legislative District 10, which it shares with Toms River. The district elects one senator and two assembly members; all three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey publishes no count at any geography and does not report to the CDC. Guttmacher estimates about 61,200 abortions provided by clinicians in the state in 2025.',
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'The immediate and total end of abortion, criminalised as homicide, with no exceptions, from fertilisation.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
        ],
      },
    ],
  },

  bayonne: {
    historyParagraphs: [
      'Bayonne occupies the peninsula between Newark Bay and the Kill van Kull, at the southern end of Hudson County.',
      'Hudson County did not exist until 22 February 1840. Before that this was Bergen County — and Bergen held more enslaved people than anywhere else in New Jersey. The 1800 census counted 2,825 enslaved residents there, 18.6% of the entire population of the county. Slavery in this corner of the state was not a distant southern institution; it was the ordinary arrangement of the Dutch farm households that preceded the city. The county line moved in 1840. The history did not.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Bayonne.',
    abortionLandscapeOutro:
      'Bayonne is in Legislative District 31, which it shares with part of Jersey City. Its three legislators are below.',
    faqs: [
      {
        q: 'Who represents Bayonne in the New Jersey Legislature?',
        a: 'Bayonne is in Legislative District 31, shared with part of Jersey City. The district elects one senator and two assembly members; all three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Was there slavery in Hudson County?',
        a: 'Hudson County was created from Bergen County in 1840. Bergen held more enslaved people than any other county in New Jersey — 2,825 in the 1800 census, 18.6% of its population. Everything now in Hudson County was inside Bergen while that was true.',
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. Neither a bill of abolition nor an equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
    ],
  },

  'east-orange': {
    historyParagraphs: [
      'East Orange is a city of about 72,000 in Essex County, bordering Newark to the west.',
      'Essex County counted 1,719 Black residents in the 1800 federal census. Of them, 1,521 were enslaved — nearly nine in ten. The county that became the commercial centre of New Jersey built that position while holding people as property, and the state took another six decades to stop: no living person freed by the 1804 act, the remaining enslaved renamed "apprentices" by the 1846 act, eighteen still held in 1860, and the Thirteenth Amendment voted down in Trenton in March 1865.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates in East Orange, a Planned Parenthood health centre on Dr. Martin Luther King Boulevard:',
    abortionLandscapeOutro:
      'East Orange is in Legislative District 34, which it shares with Bloomfield. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents East Orange in the New Jersey Legislature?',
        a: 'East Orange is in Legislative District 34, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey does not report the figure and publishes no count of its own. Guttmacher estimates about 61,200 abortions provided by clinicians in the state in 2025.',
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'The immediate and total end of abortion, criminalised as homicide, with no exceptions, from the moment of fertilisation.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'criminalised as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  passaic: {
    historyParagraphs: [
      'Passaic is a dense, working city of about 71,000 on the river that gave it and its county their name.',
      'Passaic County was created on 7 February 1837 from parts of Bergen and Essex — in 1800, the first and sixth counties in New Jersey by enslaved population. Bergen held 2,825 people, Essex 1,521. New Jersey was the last northern state to free its slaves and it chose to do so gradually: the 1804 act freed no one then living, binding children born afterwards until 21 or 25; the 1846 act renamed those still held as "apprentices" to their present owners; eighteen people were still held in 1860. Gradualism was not abolition arriving slowly. It was a law that named the people whose freedom could wait.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Passaic city. The nearest is the Planned Parenthood centre in Paterson.',
    abortionLandscapeOutro:
      'Passaic is in Legislative District 36. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Passaic in the New Jersey Legislature?',
        a: 'Passaic city is in Legislative District 36, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Is Passaic the same as Passaic County?',
        a: 'No. Passaic is a city inside Passaic County, which also contains Paterson, Clifton and Wayne. The county was created in 1837 from parts of Bergen and Essex.',
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. No bill of abolition and no equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
    ],
  },

  franklin: {
    historyParagraphs: [
      'Franklin Township sits in Somerset County, and its largest neighbourhood is called Somerset — which is why the Planned Parenthood facility here is addressed to "Somerset, NJ" while carrying the name "Franklin Township Center". There are four Franklin Townships in New Jersey. This is the one in Somerset County.',
      'Somerset held more enslaved people than any county in the state except Bergen. The 1800 census counted 1,863 enslaved residents here — 14.5% of everyone living in the county. From 1737 until 1800 the densest slaveholding in New Jersey was consistently in Bergen, Monmouth and Somerset. The state then took until 1865 to finish letting go, and only after the Legislature had voted the Thirteenth Amendment down once.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates in Franklin Township — the Planned Parenthood Franklin Township Center on Route 27, addressed to Somerset:',
    abortionLandscapeOutro:
      'Franklin Township is in Legislative District 17, which it shares with New Brunswick and Piscataway. Its three legislators are below.',
    faqs: [
      {
        q: 'Is the Somerset facility in Somerset or Franklin Township?',
        a: 'Franklin Township. "Somerset" is a neighbourhood inside Franklin Township, Somerset County — not a municipality. The facility itself is named the Franklin Township Center, which is the more accurate of its two names.',
      },
      {
        q: 'Who represents Franklin Township in the New Jersey Legislature?',
        a: 'Franklin Township, Somerset County is in Legislative District 17, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Which Franklin Township is this?',
        a: 'The one in Somerset County. New Jersey has four municipalities named Franklin Township — in Somerset, Gloucester, Hunterdon and Warren counties. Only this one is covered here.',
      },
    ],
  },

  elizabeth: {
    historyParagraphs: [
      'Elizabeth is the county seat of Union County and the fifth largest city in New Jersey — a port city, and a place of arrival for as long as there has been a state here.',
      'That state was the North\'s slowest to abolish slavery. New Jersey freed no living person in 1804; it provided only that children born to enslaved mothers thereafter would be free at 21 or 25, which is to say after a working lifetime had already been taken. The 1846 act said to finish the job renamed the remaining enslaved as "apprentices" bound to their owners. Eighteen were still held in 1860. The legislature rejected the Thirteenth Amendment in March 1865 and ratified it in January 1866, after the amendment was already law. An abolition bill is written the way it is because of records like this one.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates in Elizabeth, a Planned Parenthood health centre on Elizabeth Avenue:',
    abortionLandscapeOutro:
      'Elizabeth sits in Legislative District 20. Its senator and two assembly members are below, with their recorded FRCA votes.',
    faqs: [
      {
        q: 'Who represents Elizabeth in the New Jersey Legislature?',
        a: 'Elizabeth is in Legislative District 20, which elects one senator and two assembly members. All three are listed on this page with contact details and recorded FRCA vote.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. Neither a bill of abolition nor an equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'The state does not say. New Jersey is one of four jurisdictions that declines to report abortion data to the CDC and publishes no count of its own. Guttmacher estimates about 61,200 in 2025.',
      },
      {
        q: 'How can I get involved in Elizabeth?',
        a: 'Sign the petition, contact your three legislators, and share this page with your church.',
        links: [
          { phrase: 'Sign the petition', href: '/the-petition' },
          { phrase: 'contact', href: '/contact' },
        ],
      },
    ],
  },
};

export const CITIES: CityConfig[] = FACTS.filter((f) => CONTENT[f.slug]).map((f) => ({
  ...f,
  ...CONTENT[f.slug],
}));

/** Every city in the dataset, written or not — for coverage reporting, not for routing. */
export const ALL_CITY_FACTS: CityFacts[] = FACTS;

export function getCityBySlug(slug: string): CityConfig | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export function getAllCitySlugs(): string[] {
  return CITIES.map((c) => c.slug);
}

/** Great-circle distance in miles, for the "nearby cities" strip. */
function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3959;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Nearest N cities, closest first.
 *
 * No distance cap. New Jersey is small enough that the fifth-nearest covered
 * city is still a plausible next click — unlike Michigan, where the same
 * function could otherwise offer a city four hours away.
 */
export function getNearbyCities(
  fromSlug: string,
  limit = 5,
): Array<CityConfig & { distanceMiles: number }> {
  const from = getCityBySlug(fromSlug);
  if (!from) return [];
  return CITIES.filter((c) => c.slug !== fromSlug)
    .map((c) => ({
      ...c,
      distanceMiles: haversineMiles(from.latitude, from.longitude, c.latitude, c.longitude),
    }))
    .sort((a, b) => a.distanceMiles - b.distanceMiles)
    .slice(0, limit);
}

/** Districts rendered as "District 28 and 29" / "District 35". */
export function districtLabel(districts: number[]): string {
  if (districts.length === 1) return `District ${districts[0]}`;
  const last = districts[districts.length - 1];
  return `Districts ${districts.slice(0, -1).join(', ')} and ${last}`;
}
