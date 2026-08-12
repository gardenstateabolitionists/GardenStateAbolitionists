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
        a: 'None in this city. There is one in the whole state, in Glassboro, listed by Abolitionists Rising. We read all 106 New Jersey congregations in the directory we work from and found no others. If your church has taken a public position, tell us and we will verify it and list it.',
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

  'old-bridge': {
    historyParagraphs: [
      'Old Bridge is a large township in the east of Middlesex County, grown from 66,892 residents in 2020 to about 70,500 in 2024 — one of the faster-growing municipalities in the state.',
      'Middlesex County counted 1,827 Black residents in the 1800 federal census and 1,564 of them were enslaved: more than five in six. New Jersey passed its Gradual Abolition Act four years later and freed none of them. The act applied only to children born afterwards, and only once they reached 21 if they were women or 25 if they were men. In 1846 a second act said to abolish slavery renamed those still held as "apprentices" bound to their present owners. Eighteen people were still held in this state in 1860.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Old Bridge Township.',
    abortionLandscapeOutro:
      'Old Bridge is in Legislative District 12. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Old Bridge in the New Jersey Legislature?',
        a: 'Old Bridge is in Legislative District 12, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey publishes no count at any geography and does not report to the CDC. Guttmacher estimates about 61,200 abortions provided by clinicians in the state in 2025.',
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. No bill of abolition and no equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
    ],
  },

  middletown: {
    historyParagraphs: [
      'Middletown is the largest municipality in Monmouth County, spread along the Navesink and the bayshore in the north of the county.',
      'Monmouth was one of the three counties — with Bergen and Somerset — where slaveholding in New Jersey was densest from 1737 until 1800. That is not a footnote to this township\'s history; it is the arrangement under which much of it was settled and farmed. New Jersey was the last northern state to free its slaves and did it by stages: no living person freed in 1804, the remaining enslaved renamed "apprentices" in 1846, eighteen still held in 1860, and a legislature that voted the Thirteenth Amendment down in March 1865 before ratifying it the following January, after it was already law.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Middletown Township. The nearest recorded one is in Shrewsbury, to the south.',
    abortionLandscapeOutro:
      'Middletown is in Legislative District 13. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Middletown in the New Jersey Legislature?',
        a: 'Middletown is in Legislative District 13, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Where is the nearest abortion facility?',
        a: 'The nearest in our directory is the Planned Parenthood centre in Shrewsbury. All the facilities we know of in the state are mapped on our abortion facilities page.',
        links: [{ phrase: 'abortion facilities page', href: '/abortion-mills' }],
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

  'union-city': {
    historyParagraphs: [
      'Union City is among the most densely populated municipalities in the United States: roughly 66,900 people living on 1.29 square miles of land, about 52,000 to the square mile. Nowhere in New Jersey are more lives packed more closely together.',
      'None of this was Hudson County until 22 February 1840. Before that it was Bergen — the county that held more enslaved people than any other in New Jersey, 2,825 of them in the 1800 census, 18.6% of everyone living there. The state then took until 1865 to finish letting go, and only after the Legislature had voted the Thirteenth Amendment down once. The 1804 act freed nobody living; the 1846 act renamed the remaining enslaved as "apprentices" bound to their owners.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Union City.',
    abortionLandscapeOutro:
      'Union City is in Legislative District 33, which it shares with North Bergen and West New York. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Union City in the New Jersey Legislature?',
        a: 'Union City is in Legislative District 33, shared with North Bergen and West New York. The district elects one senator and two assembly members; all three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Is Union City the same as Union Township?',
        a: 'No. Union City is in Hudson County, in Legislative District 33. Union Township is in Union County, in District 20, and has an abortion facility. They are different municipalities about twelve miles apart.',
        links: [{ phrase: 'Union Township', href: '/cities/union' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey does not report the figure and publishes no count of its own. Guttmacher estimates about 61,200 in 2025.',
      },
    ],
  },

  gloucester: {
    historyParagraphs: [
      'Gloucester Township is in Camden County — not, despite the name, in Gloucester County. It is one of the larger municipalities in South Jersey, with about 67,000 residents.',
      'Camden County holds Lawnside, the only African-American community ever incorporated as a municipality in New Jersey. It began as Snow Hill, a settlement of free and self-freed Black families, and was a station on the Underground Railroad; the Reverend Peter Mott built a house there in 1845 and used it to shelter people escaping slavery. It still stands. What those families were escaping, this state was still practising — New Jersey freed nobody living in 1804, renamed the remaining enslaved "apprentices" in 1846, and still held eighteen people in 1860.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Gloucester Township. The nearest are in Cherry Hill and Camden.',
    abortionLandscapeOutro:
      'Gloucester Township is in Legislative District 4, which it shares with Washington Township. Its three legislators are below.',
    faqs: [
      {
        q: 'Is Gloucester Township in Gloucester County?',
        a: 'No. Gloucester Township is in Camden County, in Legislative District 4. Gloucester County is next door and contains a separate Washington Township, among others. New Jersey reuses place names heavily.',
      },
      {
        q: 'Who represents Gloucester Township in the New Jersey Legislature?',
        a: 'Gloucester Township is in Legislative District 4, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. Neither a bill of abolition nor an equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
    ],
  },

  union: {
    historyParagraphs: [
      'Union Township is in Union County — and is not Union City, which is in Hudson County twelve miles north. It has about 63,000 residents and grew nearly 6% between 2020 and 2024, among the fastest of New Jersey\'s fifty largest municipalities.',
      'Union County is one of the state\'s youngest, set off from Essex County on 19 March 1857 — four years before the Civil War, and while people in New Jersey were still held as "apprentices for life" under the 1846 act. Essex had counted 1,521 enslaved residents in the 1800 census out of 1,719 Black residents. This township was inside that county for the whole of the slaveholding era.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates in Union Township, an independent clinic on Stuyvesant Avenue:',
    abortionLandscapeOutro:
      'Union Township is in Legislative District 20, the same district as Elizabeth. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Is this Union City?',
        a: 'No. Union Township is in Union County, in Legislative District 20. Union City is a separate municipality in Hudson County, in District 33, about twelve miles north.',
        links: [{ phrase: 'Union City', href: '/cities/union-city' }],
      },
      {
        q: 'Who represents Union Township in the New Jersey Legislature?',
        a: 'Union Township is in Legislative District 20, which it shares with Elizabeth. The district elects one senator and two assembly members; all three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey publishes no count and does not report to the CDC. Guttmacher estimates about 61,200 abortions provided by clinicians in the state in 2025.',
      },
    ],
  },

  piscataway: {
    historyParagraphs: [
      'Piscataway is a township of about 63,000 in Middlesex County, on the Raritan across from New Brunswick.',
      'The 1800 census counted 1,827 Black residents of Middlesex County. Of them, 1,564 were enslaved — more than five in six. The Gradual Abolition Act of 1804 freed none of them; it reached only children born afterwards, and only after twenty-one or twenty-five years of unpaid service. The 1846 act that was supposed to finish the work renamed those still held as "apprentices" bound to their present owners. This is what it looks like when a legislature writes a law to be passed rather than to work.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Piscataway Township. The nearest is in Franklin Township, across the river.',
    abortionLandscapeOutro:
      'Piscataway is in Legislative District 17, which it shares with New Brunswick and Franklin Township. Its three legislators are below.',
    faqs: [
      {
        q: 'Who represents Piscataway in the New Jersey Legislature?',
        a: 'Piscataway is in Legislative District 17, which it shares with New Brunswick and Franklin Township. The district elects one senator and two assembly members; all three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Where is the nearest abortion facility?',
        a: 'The nearest in our directory is the Planned Parenthood Franklin Township Center, addressed to Somerset, across the Raritan in Somerset County.',
        links: [{ phrase: 'Franklin Township', href: '/cities/franklin' }],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'The immediate and total end of abortion, criminalised as homicide, with no exceptions, from fertilisation.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'criminalised as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  vineland: {
    historyParagraphs: [
      'Vineland is the largest municipality in Cumberland County by population and one of the largest in New Jersey by land area, covering the south of the state well away from its cities.',
      'Cumberland County holds Springtown, near Greenwich — one of a handful of South Jersey settlements where people who had freed themselves from slavery settled and were sheltered by their neighbours, alongside Marshalltown in Salem County, Snow Hill in Camden County and Timbuctoo in Burlington. They were sheltering people from a state that had not finished the job: New Jersey freed nobody living in 1804, renamed the enslaved "apprentices" in 1846, still held eighteen people in 1860, and voted the Thirteenth Amendment down in March 1865.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Vineland.',
    abortionLandscapeOutro:
      'Vineland is in Legislative District 1, at the southern end of the state. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Vineland in the New Jersey Legislature?',
        a: 'Vineland is in Legislative District 1, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'What is the Underground Railroad history in Cumberland County?',
        a: 'Springtown, near Greenwich, was one of several South Jersey settlements where people escaping slavery were sheltered and settled — with Marshalltown in Salem County, Snow Hill (now Lawnside) in Camden County, and Timbuctoo in Burlington County.',
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. No bill of abolition and no equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
    ],
  },

  irvington: {
    historyParagraphs: [
      'Irvington is a township of about 62,000 on 2.91 square miles in Essex County, bordering Newark — roughly 21,000 people to the square mile, one of the densest municipalities in the state.',
      'Essex County counted 1,719 Black residents in the 1800 federal census, and 1,521 of them were enslaved — nearly nine in ten. New Jersey then spent sixty years declining to finish what it started. The 1804 act freed nobody living. The 1846 act renamed the remaining enslaved as "apprentices" bound to their present owners. Eighteen people were still held in 1860, and the Legislature in Trenton voted against the Thirteenth Amendment in March 1865.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Irvington. The nearest are in Newark and East Orange, both bordering.',
    abortionLandscapeOutro:
      'Irvington is in Legislative District 28, which it shares with part of Newark. Its three legislators are below.',
    faqs: [
      {
        q: 'Who represents Irvington in the New Jersey Legislature?',
        a: 'Irvington is in Legislative District 28, shared with part of Newark. The district elects one senator and two assembly members; all three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey does not report it and publishes no count at any geography. Guttmacher estimates about 61,200 in 2025.',
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'The immediate and total end of abortion, criminalised as homicide, with no exceptions, from the moment of fertilisation.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
        ],
      },
    ],
  },

  'north-bergen': {
    historyParagraphs: [
      'North Bergen is a township of about 62,000 on the Hudson County palisades. Its name is the older fact about it: this was Bergen County.',
      'Hudson County was not created until 22 February 1840. Before that every one of these towns was in Bergen — the county that held more enslaved people than anywhere else in New Jersey, 2,825 of them in the 1800 census, 18.6% of its entire population. Slavery here was the ordinary arrangement of Dutch farm households, not a distant southern institution. The county line moved in 1840; the history did not.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside North Bergen.',
    abortionLandscapeOutro:
      'North Bergen is in Legislative District 33 with Union City and West New York. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents North Bergen in the New Jersey Legislature?',
        a: 'North Bergen is in Legislative District 33, shared with Union City and West New York. The district elects one senator and two assembly members; all three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Is North Bergen in Bergen County?',
        a: 'No — it is in Hudson County, and has been since Hudson was created out of Bergen County in 1840. The name records what it used to be.',
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. Neither a bill of abolition nor an equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
    ],
  },

  jackson: {
    historyParagraphs: [
      'Jackson is a large, mostly wooded township in the north-west of Ocean County, with about 61,000 residents spread across it.',
      'Ocean County was set off from Monmouth County in February 1850 — ten years before the last federal census to count enslaved people in New Jersey. Monmouth was one of the three counties, with Bergen and Somerset, where slaveholding in this state was densest from 1737 until 1800, and Jackson sat inside it for all of that. The state\'s abolition, when it came, came by degrees: nobody living freed in 1804, the remaining enslaved renamed "apprentices" in 1846, eighteen still held in 1860.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Jackson Township.',
    abortionLandscapeOutro:
      'Jackson is in Legislative District 12. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Jackson in the New Jersey Legislature?',
        a: 'Jackson is in Legislative District 12, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey publishes no count at any geography and does not report to the CDC. Guttmacher estimates about 61,200 in 2025.',
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

  hoboken: {
    historyParagraphs: [
      'Hoboken is a square mile and a quarter of Hudson County facing Manhattan across the river, with about 59,000 people living on it — roughly 47,000 to the square mile, third densest of New Jersey\'s fifty largest municipalities.',
      'It was Bergen County until 1840, and Bergen held more enslaved people than any other county in New Jersey: 2,825 in the 1800 census, 18.6% of its population. New Jersey was the last northern state to free its slaves. It freed nobody living in 1804, binding children born afterwards until 21 or 25; renamed the remaining enslaved as "apprentices" in 1846; still held eighteen people in 1860; and voted the Thirteenth Amendment down in Trenton in March 1865, ratifying it only in January 1866 after it was already law.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Hoboken.',
    abortionLandscapeOutro:
      'Hoboken is in Legislative District 32, which it shares with part of Jersey City. Its three legislators are below.',
    faqs: [
      {
        q: 'Who represents Hoboken in the New Jersey Legislature?',
        a: 'Hoboken is in Legislative District 32, shared with part of Jersey City. The district elects one senator and two assembly members; all three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Are there abolitionist churches in Hoboken?',
        a: 'None in Hoboken. There is one in the state, in Glassboro, listed by Abolitionists Rising. We read all 106 New Jersey congregations in the directory we work from and found no others. If yours has taken a public position, tell us.',
        links: [{ phrase: 'tell us', href: '/contact' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey does not report the figure. Guttmacher estimates about 61,200 abortions provided by clinicians in the state in 2025.',
      },
    ],
  },

  'new-brunswick': {
    historyParagraphs: [
      'New Brunswick sits on the Raritan in Middlesex County, a city of about 57,000 and the county seat.',
      'Middlesex was among the heaviest slaveholding counties in New Jersey. The 1800 census counted 1,827 Black residents here and 1,564 of them enslaved — more than five in six. Four years later the state passed the act that was supposed to end it and freed nobody: the 1804 law reached only children born after that July, and only after they had served twenty-one or twenty-five years. In 1846 the remaining enslaved were renamed "apprentices" bound to their present owners. Eighteen people were still held in New Jersey in 1860.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside New Brunswick. The nearest is the Planned Parenthood Franklin Township Center, across the river in Somerset County.',
    abortionLandscapeOutro:
      'New Brunswick is in Legislative District 17 with Piscataway and Franklin Township. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents New Brunswick in the New Jersey Legislature?',
        a: 'New Brunswick is in Legislative District 17, which it shares with Piscataway and Franklin Township. The district elects one senator and two assembly members; all three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Where is the nearest abortion facility?',
        a: 'The Planned Parenthood Franklin Township Center, addressed to Somerset, across the Raritan in Somerset County.',
        links: [{ phrase: 'Franklin Township', href: '/cities/franklin' }],
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. No bill of abolition and no equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
    ],
  },

  'perth-amboy': {
    historyParagraphs: [
      'Perth Amboy is a port city of about 57,000 at the mouth of the Raritan, at the eastern edge of Middlesex County.',
      'The county around it held 1,564 people in slavery in 1800, out of 1,827 Black residents — more than five in six. New Jersey was the last northern state to free its slaves and chose to do it gradually: the 1804 act freed no one then living, the 1846 act renamed those still held as "apprentices" bound to their owners, eighteen remained enslaved in 1860, and the Legislature voted the Thirteenth Amendment down in March 1865. Each of those steps was defended in its day as the achievable one.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates in Perth Amboy, a Planned Parenthood centre on Market Street:',
    abortionLandscapeOutro:
      'Perth Amboy is in Legislative District 19 with Woodbridge and Sayreville. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Perth Amboy in the New Jersey Legislature?',
        a: 'Perth Amboy is in Legislative District 19, which it shares with Woodbridge and Sayreville. The district elects one senator and two assembly members; all three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey publishes no count at any geography and is one of four jurisdictions that declines to report to the CDC. Guttmacher estimates about 61,200 in 2025.',
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'The immediate and total end of abortion, criminalised as homicide, with no exceptions, from the moment of fertilisation.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
        ],
      },
    ],
  },

  'parsippany-troy-hills': {
    historyParagraphs: [
      'Parsippany-Troy Hills is the largest municipality in Morris County, about 57,000 people in the hills west of Newark.',
      'Morris County was formed in 1739 — more than sixty years before New Jersey passed its first abolition act, and more than a century before the state stopped holding people. That arithmetic is the point. Slavery in New Jersey was not a brief early episode the counties outgrew; it was the arrangement in place for most of the time these counties have existed. The 1804 act freed nobody living, the 1846 act renamed the enslaved as "apprentices" to their owners, and eighteen people were still held in 1860.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Parsippany-Troy Hills. The nearest recorded facilities are the two in Morristown, a few miles south.',
    abortionLandscapeOutro:
      'Parsippany-Troy Hills is in Legislative District 26. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Parsippany-Troy Hills in the New Jersey Legislature?',
        a: 'Parsippany-Troy Hills is in Legislative District 26, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Where is the nearest abortion facility?',
        a: 'Two are recorded in Morristown, the Morris County seat a few miles south. Both are mapped on our abortion facilities page.',
        links: [{ phrase: 'abortion facilities page', href: '/abortion-mills' }],
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. Neither a bill of abolition nor an equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
    ],
  },

  plainfield: {
    historyParagraphs: [
      'Plainfield is a city of about 57,000 in the west of Union County, on the Somerset border.',
      'Union County is one of New Jersey\'s youngest, set off from Essex on 19 March 1857 — four years before the Civil War, and while people in this state were still held as "apprentices for life" under the 1846 act. Essex had counted 1,521 enslaved residents in 1800 out of 1,719 Black residents. Plainfield was inside that county for the whole of the slaveholding era, and inside a state that would vote against the Thirteenth Amendment in March 1865 before ratifying it the following January, after it was already law.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Plainfield.',
    abortionLandscapeOutro:
      'Plainfield is in Legislative District 22. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Plainfield in the New Jersey Legislature?',
        a: 'Plainfield is in Legislative District 22, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey does not report the figure and publishes no count at any geography. Guttmacher estimates about 61,200 in 2025.',
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'The immediate and total end of abortion, criminalised as homicide, with no exceptions, from fertilisation.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'criminalised as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  bloomfield: {
    historyParagraphs: [
      'Bloomfield is a township of about 55,000 in Essex County, between Newark and Montclair.',
      'Essex counted 1,719 Black residents in the 1800 federal census and 1,521 of them were enslaved — nearly nine in ten. The county that became the commercial centre of New Jersey built that position while holding people as property, and the state took another six decades to stop. The 1804 act freed nobody living. The 1846 act renamed those still held as "apprentices" bound to their present owners. Eighteen people remained enslaved in 1860.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Bloomfield. Two are recorded in neighbouring Montclair.',
    abortionLandscapeOutro:
      'Bloomfield is in Legislative District 34, which it shares with East Orange. Its three legislators are below.',
    faqs: [
      {
        q: 'Who represents Bloomfield in the New Jersey Legislature?',
        a: 'Bloomfield is in Legislative District 34, shared with East Orange. The district elects one senator and two assembly members; all three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Where is the nearest abortion facility?',
        a: 'Two are recorded in Montclair, which borders Bloomfield to the west. Both are mapped on our abortion facilities page.',
        links: [{ phrase: 'abortion facilities page', href: '/abortion-mills' }],
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. No bill of abolition and no equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
    ],
  },

  howell: {
    historyParagraphs: [
      'Howell is a large township in the south of Monmouth County, about 54,000 people across sixty square miles.',
      'Monmouth was one of the three counties — with Bergen and Somerset — where slaveholding in New Jersey was densest from 1737 until 1800. New Jersey was the last northern state to free its slaves, and the manner of it is what this organisation exists to argue about: the 1804 act freed no living person and bound children born afterwards until 21 or 25; the 1846 act renamed those still held as "apprentices" to their present owners; eighteen people were still held in 1860; and the Legislature voted the Thirteenth Amendment down in March 1865.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Howell Township. The nearest recorded one is in Shrewsbury.',
    abortionLandscapeOutro:
      'Howell is in Legislative District 30, which it shares with Lakewood. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Howell in the New Jersey Legislature?',
        a: 'Howell is in Legislative District 30, which it shares with Lakewood. The district elects one senator and two assembly members; all three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey publishes no count at any geography and does not report to the CDC. Guttmacher estimates about 61,200 in 2025.',
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

  wayne: {
    historyParagraphs: [
      'Wayne is a township of about 54,000 in the north-west of Passaic County, along the Pompton and Passaic rivers.',
      'Passaic County was created on 7 February 1837 out of parts of Bergen and Essex — in the 1800 census, the first and sixth counties in New Jersey by enslaved population. Bergen held 2,825 people, 18.6% of everyone living there; Essex held 1,521. This ground was inside those counties while that was true, in a state that would take until 1865 to finish letting go, and would vote against the Thirteenth Amendment before doing so.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Wayne Township. The nearest recorded one is the Planned Parenthood centre in Paterson.',
    abortionLandscapeOutro:
      'Wayne is in Legislative District 40. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Wayne in the New Jersey Legislature?',
        a: 'Wayne is in Legislative District 40, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Where is the nearest abortion facility?',
        a: 'The Planned Parenthood centre on Broadway in Paterson, the county seat. Every facility we know of in the state is mapped on our abortion facilities page.',
        links: [{ phrase: 'abortion facilities page', href: '/abortion-mills' }],
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. Neither a bill of abolition nor an equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
    ],
  },

  'west-new-york': {
    historyParagraphs: [
      'West New York is the most densely populated municipality of New Jersey\'s fifty largest: about 53,000 people living on 0.99 square miles, roughly 53,000 to the square mile. It is a town in Hudson County, not a part of New York.',
      'It was Bergen County until 1840 — the county that held more enslaved people than any other in New Jersey, 2,825 of them in the 1800 census, 18.6% of its whole population. The state freed nobody living in 1804, renamed the remaining enslaved as "apprentices" bound to their owners in 1846, still counted eighteen people held in 1860, and voted down the Thirteenth Amendment in March 1865 before ratifying it in January 1866, after it had already become law without them.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside West New York.',
    abortionLandscapeOutro:
      'West New York is in Legislative District 33 with Union City and North Bergen. Its three legislators are below.',
    faqs: [
      {
        q: 'Is West New York in New York?',
        a: 'No. West New York is a town in Hudson County, New Jersey, in Legislative District 33. It faces Manhattan across the Hudson, which is where the name comes from.',
      },
      {
        q: 'Who represents West New York in the New Jersey Legislature?',
        a: 'West New York is in Legislative District 33, shared with Union City and North Bergen. The district elects one senator and two assembly members; all three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey does not report the figure and publishes no count of its own. Guttmacher estimates about 61,200 in 2025.',
      },
    ],
  },

  'east-brunswick': {
    historyParagraphs: [
      'East Brunswick is a township of about 51,000 in the centre of Middlesex County.',
      'The 1800 census counted 1,564 enslaved people in this county out of 1,827 Black residents — more than five in six. New Jersey\'s Gradual Abolition Act came four years later and freed none of them; it reached only children born afterwards, and only after twenty-one or twenty-five years of service to the person who owned their mother. The 1846 act that was said to finish the work renamed those still held as "apprentices". Eighteen people were still held in this state in 1860.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside East Brunswick Township.',
    abortionLandscapeOutro:
      'East Brunswick is in Legislative District 18, which it shares with Edison. Its three legislators are below.',
    faqs: [
      {
        q: 'Who represents East Brunswick in the New Jersey Legislature?',
        a: 'East Brunswick is in Legislative District 18, which it shares with Edison. The district elects one senator and two assembly members; all three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey publishes no count at any geography and does not report to the CDC. Guttmacher estimates about 61,200 in 2025.',
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

  monroe: {
    historyParagraphs: [
      'Monroe Township is in Middlesex County — one of two municipalities of that name in New Jersey, the other being in Gloucester County. This is the Middlesex one, about 50,000 people in the south of the county.',
      'Middlesex held 1,564 people in slavery in 1800, out of 1,827 Black residents. New Jersey was the last northern state to free its slaves and did it in stages that were each defended as realistic: nobody living freed in 1804, the remaining enslaved renamed "apprentices" bound to their owners in 1846, eighteen still held in 1860, and a legislature that rejected the Thirteenth Amendment in March 1865.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Monroe Township, Middlesex County.',
    abortionLandscapeOutro:
      'Monroe Township is in Legislative District 14, the same district as Hamilton Township in Mercer County. Its three legislators are below.',
    faqs: [
      {
        q: 'Which Monroe Township is this?',
        a: 'The one in Middlesex County, in Legislative District 14. There is another Monroe Township in Gloucester County. New Jersey reuses municipality names across counties, which is why this site locates everything by coordinates rather than by name.',
      },
      {
        q: 'Who represents Monroe Township in the New Jersey Legislature?',
        a: 'Monroe Township, Middlesex County is in Legislative District 14, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. No bill of abolition and no equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
    ],
  },

  washington: {
    historyParagraphs: [
      'Washington Township is in Gloucester County, in the south of the state. If you searched for the abortion facility in "Washington, NJ", it is not here — that one is in Washington Borough, Warren County, sixty miles north and in a different legislative district. New Jersey has several Washington Townships. This is the Gloucester County one, with about 50,000 residents.',
      'Gloucester County dates to 1686 and once stretched across the south of New Jersey; Atlantic was cut from it in 1837 and Camden in 1844. This is South Jersey Quaker country, where the argument that no Christian could hold a human being as property was made generations before the state acted on it — and where free and self-freed Black families built settlements at Springtown, Marshalltown, Snow Hill and Timbuctoo, sheltering people escaping a state that had not yet finished abolishing slavery itself.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Washington Township, Gloucester County. The nearest are in Camden and Cherry Hill.',
    abortionLandscapeOutro:
      'Washington Township is in Legislative District 4, which it shares with Gloucester Township. Its three legislators are below.',
    faqs: [
      {
        q: 'Is the "Washington, NJ" abortion facility in this township?',
        a: 'No. That facility is in Washington Borough, Warren County, in Legislative District 23 — about sixty miles north of here. Washington Township in Gloucester County is a different municipality entirely.',
        links: [{ phrase: 'That facility', href: '/abortion-mills' }],
      },
      {
        q: 'Who represents Washington Township in the New Jersey Legislature?',
        a: 'Washington Township, Gloucester County is in Legislative District 4, which it shares with Gloucester Township. The district elects one senator and two assembly members; all three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey publishes no count and does not report to the CDC. Guttmacher estimates about 61,200 in 2025.',
      },
    ],
  },

  'west-orange': {
    historyParagraphs: [
      'West Orange is a township of about 49,000 in Essex County, climbing the First and Second Watchung ridges west of Newark.',
      'Essex County counted 1,719 Black residents in the 1800 federal census, and 1,521 of them were enslaved — nearly nine in ten. New Jersey then spent sixty years declining to finish what it had begun: the 1804 act freed nobody living, the 1846 act renamed the remaining enslaved as "apprentices" bound to their present owners, eighteen were still held in 1860, and the Legislature voted against the Thirteenth Amendment in March 1865 before ratifying it in January 1866 — after it was already the law of the land.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside West Orange. The nearest are in Montclair and East Orange.',
    abortionLandscapeOutro:
      'West Orange is in Legislative District 27, which it shares with Clifton. Its three legislators are below.',
    faqs: [
      {
        q: 'Who represents West Orange in the New Jersey Legislature?',
        a: 'West Orange is in Legislative District 27, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Where is the nearest abortion facility?',
        a: 'Two are recorded in Montclair and one in East Orange, all within a few miles. They are mapped on our abortion facilities page.',
        links: [{ phrase: 'abortion facilities page', href: '/abortion-mills' }],
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

  evesham: {
    historyParagraphs: [
      'Evesham is a township of about 49,000 in Burlington County, in the suburbs east of Camden. Its principal community is Marlton.',
      'Burlington County holds Timbuctoo. In 1826 four Black men — believed to have escaped slavery in Maryland — bought land from a Quaker businessman in what is now Westampton Township. The settlement they founded grew past 125 residents and built a school, a church and a cemetery, and on the Rancocas within reach of the Delaware it became an established stop on the Underground Railroad. This county is also where the Quaker John Woolman spent his life arguing that no Christian could hold a human being as property — an argument New Jersey did not finish acting on until 1865.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Evesham Township. The nearest recorded ones are in Cherry Hill and Delran.',
    abortionLandscapeOutro:
      'Evesham is in Legislative District 8 — the one district in New Jersey where no sitting member has a recorded vote on the Freedom of Reproductive Choice Act, because none of the three was serving in January 2022. Their contact details are below.',
    faqs: [
      {
        q: 'Who represents Evesham in the New Jersey Legislature?',
        a: 'Evesham is in Legislative District 8, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'What is Timbuctoo?',
        a: 'A settlement founded in 1826 in what is now Westampton Township, Burlington County, by four Black men believed to have escaped slavery in Maryland. It grew past 125 residents, built a school and a church, and was an established stop on the Underground Railroad.',
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. Neither a bill of abolition nor an equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
    ],
  },

  'egg-harbor': {
    historyParagraphs: [
      'Egg Harbor Township is in Atlantic County, west of Atlantic City, with about 49,000 residents.',
      'Atlantic County was created on 7 February 1837 out of the southern half of Gloucester County — the South Jersey Quaker country where free and self-freed Black families built settlements at Springtown, Marshalltown, Snow Hill and Timbuctoo, and where the Underground Railroad ran toward the Delaware. They were sheltering people from a state that was still, at that date, holding some of its own residents: New Jersey freed nobody living in 1804, renamed the enslaved "apprentices" in 1846, and still counted eighteen people held in 1860.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Egg Harbor Township. The nearest recorded one is the Planned Parenthood centre in Absecon.',
    abortionLandscapeOutro:
      'Egg Harbor Township is in Legislative District 2. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Egg Harbor Township in the New Jersey Legislature?',
        a: 'Egg Harbor Township is in Legislative District 2, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Where is the nearest abortion facility?',
        a: 'The Planned Parenthood centre in Absecon, a few miles east. It is mapped on our abortion facilities page.',
        links: [{ phrase: 'abortion facilities page', href: '/abortion-mills' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey publishes no count at any geography and does not report to the CDC. Guttmacher estimates about 61,200 in 2025.',
      },
    ],
  },

  'south-brunswick': {
    historyParagraphs: [
      'South Brunswick is a township of about 48,000 in the south of Middlesex County, on the Mercer border.',
      'Middlesex counted 1,827 Black residents in the 1800 census and 1,564 of them were enslaved — more than five in six. New Jersey passed its Gradual Abolition Act four years later and freed none of them: it reached only children born afterwards, and only after twenty-one or twenty-five years. In 1846 a second act said to abolish slavery renamed those still held as "apprentices" bound to their present owners. That is the pattern this organisation exists to refuse — a law written so that it can pass, rather than so that it works.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside South Brunswick Township.',
    abortionLandscapeOutro:
      'South Brunswick is in Legislative District 16, which it shares with Hillsborough. Its three legislators are below.',
    faqs: [
      {
        q: 'Who represents South Brunswick in the New Jersey Legislature?',
        a: 'South Brunswick is in Legislative District 16, which it shares with Hillsborough. The district elects one senator and two assembly members; all three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey does not report the figure and publishes no count of its own. Guttmacher estimates about 61,200 in 2025.',
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'The immediate and total end of abortion, criminalised as homicide, with no exceptions, from fertilisation.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'criminalised as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  'mount-laurel': {
    historyParagraphs: [
      'Mount Laurel is a township of about 47,000 in Burlington County, and among the faster-growing of New Jersey\'s fifty largest — up nearly 6% between 2020 and 2024.',
      'Burlington County is where the Quaker John Woolman spent his life arguing that no Christian could hold a human being as property, and where Timbuctoo was founded in 1826 by four Black men believed to have escaped slavery in Maryland. That settlement grew past 125 residents, built a school and a church, and became an established stop on the Underground Railroad. The state around it was in no hurry: New Jersey freed nobody living in 1804, renamed the enslaved "apprentices" in 1846, still held eighteen people in 1860, and voted the Thirteenth Amendment down in March 1865.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Mount Laurel Township. The nearest recorded ones are in Delran and Cherry Hill.',
    abortionLandscapeOutro:
      'Mount Laurel is in Legislative District 7. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Mount Laurel in the New Jersey Legislature?',
        a: 'Mount Laurel is in Legislative District 7, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Who was John Woolman?',
        a: 'A Quaker of Mount Holly, in this county, who spent his life arguing that no Christian could hold a human being as property — decades before New Jersey passed its first abolition act, and more than a century before the state stopped holding people.',
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. No bill of abolition and no equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
    ],
  },

  sayreville: {
    historyParagraphs: [
      'Sayreville is a borough of about 47,000 in Middlesex County, at the mouth of the Raritan opposite Perth Amboy.',
      'Middlesex held 1,564 people in slavery in 1800, out of 1,827 Black residents — more than five in six. New Jersey was the last northern state to free its slaves. The 1804 act freed no one then living. The 1846 act renamed those still held as "apprentices" bound to their present owners. Eighteen people remained enslaved here in 1860, and in March 1865 the Legislature voted against the amendment abolishing slavery, ratifying it only the following January, after it had already become law without them.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Sayreville. The nearest is the Planned Parenthood centre in Perth Amboy, across the river.',
    abortionLandscapeOutro:
      'Sayreville is in Legislative District 19 with Perth Amboy and Woodbridge. Its three legislators are below.',
    faqs: [
      {
        q: 'Who represents Sayreville in the New Jersey Legislature?',
        a: 'Sayreville is in Legislative District 19, which it shares with Perth Amboy and Woodbridge. The district elects one senator and two assembly members; all three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Where is the nearest abortion facility?',
        a: 'The Planned Parenthood centre on Market Street in Perth Amboy, across the Raritan.',
        links: [{ phrase: 'Perth Amboy', href: '/cities/perth-amboy' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey publishes no count at any geography. Guttmacher estimates about 61,200 in 2025.',
      },
    ],
  },

  bridgewater: {
    historyParagraphs: [
      'Bridgewater is a township of about 47,000 in Somerset County, along the Raritan in the centre of the state.',
      'Somerset held more enslaved people than any New Jersey county except Bergen. The 1800 census counted 1,863 enslaved residents here — 14.5% of everyone living in the county — and from 1737 until 1800 the densest slaveholding in the state was consistently in Bergen, Monmouth and Somerset. New Jersey then took until 1865 to finish letting go, and only after its Legislature had voted the Thirteenth Amendment down once and been replaced at an election.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Bridgewater Township. The nearest is the Planned Parenthood Franklin Township Center, addressed to Somerset.',
    abortionLandscapeOutro:
      'Bridgewater is in Legislative District 23. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Bridgewater in the New Jersey Legislature?',
        a: 'Bridgewater is in Legislative District 23, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Was there slavery in Somerset County?',
        a: 'Somerset held 1,863 enslaved people in the 1800 census — 14.5% of its population, second only to Bergen County. From 1737 to 1800 the densest slaveholding in New Jersey was in Bergen, Monmouth and Somerset.',
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. Neither a bill of abolition nor an equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
    ],
  },

  hackensack: {
    historyParagraphs: [
      'Hackensack is the county seat of Bergen County, a city of about 47,000 on the river of the same name.',
      'Bergen held more enslaved people than any other county in New Jersey. The 1800 federal census counted 2,825 enslaved residents here — 18.6% of everyone living in the county, nearly one person in five. Slavery in Bergen was not a southern institution observed from a distance; it was the ordinary arrangement of the Dutch farm households that built this county, and Hackensack was its seat throughout. New Jersey then freed nobody living in 1804, renamed the remaining enslaved as "apprentices" in 1846, and still held eighteen people in 1860.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates in Hackensack, a Planned Parenthood health centre on Main Street:',
    abortionLandscapeOutro:
      'Hackensack is in Legislative District 37, which it shares with Englewood. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Hackensack in the New Jersey Legislature?',
        a: 'Hackensack is in Legislative District 37, which it shares with Englewood. The district elects one senator and two assembly members; all three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Was there slavery in Bergen County?',
        a: 'More than anywhere else in New Jersey. The 1800 census counted 2,825 enslaved people in Bergen County — 18.6% of its entire population. Hudson County, created out of Bergen in 1840, and Passaic, created from Bergen and Essex in 1837, were both part of it at the time.',
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey does not report the figure and publishes no count of its own at any geography. Guttmacher estimates about 61,200 abortions provided by clinicians in the state in 2025.',
      },
    ],
  },

  manchester: {
    historyParagraphs: [
      'Manchester is a large township in the west of Ocean County, about 46,000 people spread across more than eighty square miles of the Pine Barrens.',
      'Ocean County was set off from Monmouth in February 1850 — one of the three counties, with Bergen and Somerset, where slaveholding in New Jersey was densest from 1737 until 1800. This ground was inside Monmouth for all of that period. New Jersey was the last northern state to free its slaves and did it by degrees, each defended as the realistic step: nobody living freed in 1804, the remaining enslaved renamed "apprentices" in 1846, eighteen still held in 1860, and the Thirteenth Amendment voted down in Trenton in March 1865.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Manchester Township.',
    abortionLandscapeOutro:
      'Manchester is in Legislative District 9. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Manchester in the New Jersey Legislature?',
        a: 'Manchester is in Legislative District 9, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey publishes no count at any geography and is one of four jurisdictions that declines to report abortion data to the CDC. Guttmacher estimates about 61,200 in 2025.',
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

  hillsborough: {
    historyParagraphs: [
      'Hillsborough is a township of about 45,000 in the south of Somerset County, the fiftieth largest municipality in New Jersey and one of the faster-growing.',
      'Somerset was second only to Bergen among New Jersey counties by enslaved population: 1,863 people held in the 1800 census, 14.5% of everyone living here. From 1737 until 1800 the densest slaveholding in the state was consistently in Bergen, Monmouth and Somerset. What followed was not emancipation but a schedule — the 1804 act freeing nobody then living, the 1846 act renaming the remaining enslaved as "apprentices" bound to their owners, eighteen people still held in 1860, and a legislature that rejected the Thirteenth Amendment before accepting it.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Hillsborough Township. The nearest is the Planned Parenthood Franklin Township Center, addressed to Somerset.',
    abortionLandscapeOutro:
      'Hillsborough is in Legislative District 16, which it shares with South Brunswick. Its three legislators are below.',
    faqs: [
      {
        q: 'Who represents Hillsborough in the New Jersey Legislature?',
        a: 'Hillsborough is in Legislative District 16, which it shares with South Brunswick. The district elects one senator and two assembly members; all three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Where is the nearest abortion facility?',
        a: 'The Planned Parenthood Franklin Township Center, in the north of this county, addressed to Somerset.',
        links: [{ phrase: 'Franklin Township', href: '/cities/franklin' }],
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. Neither a bill of abolition nor an equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
    ],
  },

  glassboro: {
    historyParagraphs: [
      'Glassboro is a borough of about 24,000 in Gloucester County, home to Rowan University, and the only municipality in New Jersey with a church listed as abolitionist. Abolitionists Rising names one congregation in this state on its New Jersey page, and it is here. That is not a compliment to Glassboro so much as a comment on the other 563 municipalities.',
      'Gloucester County dates to 1686 and once stretched across the south of the state; Atlantic was cut from it in 1837 and Camden in 1844. This is South Jersey Quaker country, where the argument that no Christian could hold a human being as property was pressed generations before New Jersey acted on it. When the state finally moved, it moved by halves: the 1804 act freed no living person, the 1846 act renamed the remaining enslaved as "apprentices" bound to their owners, eighteen people were still held in 1860, and the Legislature voted the Thirteenth Amendment down in March 1865.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Glassboro.',
    abortionLandscapeOutro:
      'Glassboro is in Legislative District 3, in the south-west of the state. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Is there an abolitionist church in Glassboro?',
        a: 'Yes — one, and it is the only church listed as abolitionist anywhere in New Jersey. Abolitionists Rising, the movement\'s own national organisation, names it on its New Jersey page. It appears further down this page. We are careful about how we put it: we could not confirm that position from the church\'s own published words, so we pass on the listing and its source rather than vouching for it ourselves.',
      },
      {
        q: 'Who represents Glassboro in the New Jersey Legislature?',
        a: 'Glassboro is in Legislative District 3, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey publishes no count at any geography and does not report to the CDC. Guttmacher estimates about 61,200 abortions provided by clinicians in the state in 2025.',
      },
    ],
  },

  'fair-lawn': {
    historyParagraphs: [
      'Fair Lawn is a borough of about 36,000 in Bergen County, on the Passaic River.',
      'Bergen held more enslaved people than any other county in New Jersey. The 1800 federal census counted 2,825 enslaved residents here — 18.6% of everyone living in the county, nearly one person in five. This was not a southern institution observed from a distance; it was the ordinary arrangement of the Dutch farm households that settled this county. Hudson County was carved out of Bergen in 1840 and Passaic in 1837, both taking that history with them.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Fair Lawn. The nearest are in Paterson and Hackensack.',
    abortionLandscapeOutro:
      'Fair Lawn is in Legislative District 38. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Fair Lawn in the New Jersey Legislature?',
        a: 'Fair Lawn is in Legislative District 38, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Was there slavery in Bergen County?',
        a: 'More than anywhere else in New Jersey. The 1800 census counted 2,825 enslaved people in Bergen County, 18.6% of its population.',
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. Neither a bill of abolition nor an equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
    ],
  },

  freehold: {
    historyParagraphs: [
      'Freehold Township is in the centre of Monmouth County, around the borough of the same name that serves as the county seat.',
      'Monmouth was one of the three counties — with Bergen and Somerset — where slaveholding in New Jersey was densest from 1737 until 1800. Ocean County was later cut from it. New Jersey was the last northern state to free its slaves, and the manner of it is the argument: the 1804 act freed no living person and bound children born afterwards until 21 or 25; the 1846 act renamed those still held as "apprentices" to their present owners; eighteen people were still held in 1860; and the Legislature voted down the Thirteenth Amendment in March 1865 before ratifying it in January 1866, after it was already law.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Freehold Township. The nearest recorded one is in Shrewsbury.',
    abortionLandscapeOutro:
      'Freehold Township is in Legislative District 11, which also contains the Shrewsbury facility. Its three legislators are below.',
    faqs: [
      {
        q: 'Who represents Freehold Township in the New Jersey Legislature?',
        a: 'Freehold Township is in Legislative District 11, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Is Freehold Township the same as Freehold Borough?',
        a: 'No. Freehold Borough is a separate, smaller municipality surrounded by Freehold Township. Both are in Monmouth County. This page covers the township.',
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey does not report the figure and publishes no count of its own. Guttmacher estimates about 61,200 in 2025.',
      },
    ],
  },

  westfield: {
    historyParagraphs: [
      'Westfield is a town of about 32,000 in Union County, west of Elizabeth.',
      'Union County is one of New Jersey\'s youngest, set off from Essex on 19 March 1857 — four years before the Civil War, and while people in this state were still held as "apprentices for life" under the 1846 act. Essex had counted 1,521 enslaved residents in the 1800 census out of 1,719 Black residents, nearly nine in ten. Westfield was inside that county for the whole of the slaveholding era.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Westfield. The nearest are in Union Township and Elizabeth.',
    abortionLandscapeOutro:
      'Westfield is in Legislative District 21. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Westfield in the New Jersey Legislature?',
        a: 'Westfield is in Legislative District 21, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Where is the nearest abortion facility?',
        a: 'The nearest in our directory are in Union Township and Elizabeth, both a few miles east.',
        links: [{ phrase: 'Union Township', href: '/cities/union' }],
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

  'mount-olive': {
    historyParagraphs: [
      'Mount Olive is a township of about 29,000 in the west of Morris County.',
      'Morris County was formed in 1739 — more than sixty years before New Jersey passed its first abolition act, and more than a century before the state stopped holding people. That arithmetic is the point: slavery here was not a brief early episode the county outgrew, but the arrangement in place for most of the time the county has existed. The 1804 act freed nobody living, the 1846 act renamed the enslaved as "apprentices" bound to their owners, and eighteen people were still held in New Jersey in 1860.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Mount Olive Township. The nearest recorded ones are the two in Morristown.',
    abortionLandscapeOutro:
      'Mount Olive is in Legislative District 24, which it shares with Vernon Township in Sussex County. Its three legislators are below.',
    faqs: [
      {
        q: 'Who represents Mount Olive in the New Jersey Legislature?',
        a: 'Mount Olive is in Legislative District 24, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Where is the nearest abortion facility?',
        a: 'Two are recorded in Morristown, the Morris County seat. Both are mapped on our abortion facilities page.',
        links: [{ phrase: 'abortion facilities page', href: '/abortion-mills' }],
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. No bill of abolition and no equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
    ],
  },

  rockaway: {
    historyParagraphs: [
      'Rockaway Township covers a large, hilly stretch of northern Morris County, with about 27,000 residents.',
      'Morris County dates to 1739, which means it existed as a county for sixty-five years before New Jersey passed any abolition act at all, and for well over a century before the last person held in this state was freed. The 1804 Gradual Abolition Act reached only children born afterwards, and only after twenty-one or twenty-five years of service. The 1846 act that was supposed to finish it renamed those still held as "apprentices" bound to their present owners.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Rockaway Township. The nearest recorded ones are in Morristown.',
    abortionLandscapeOutro:
      'Rockaway Township is in Legislative District 25. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Rockaway Township in the New Jersey Legislature?',
        a: 'Rockaway Township is in Legislative District 25, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Is Rockaway Township the same as Rockaway Borough?',
        a: 'No. Rockaway Borough is a separate, much smaller municipality within the township\'s bounds. Both are in Morris County. This page covers the township.',
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey publishes no count at any geography and does not report to the CDC. Guttmacher estimates about 61,200 in 2025.',
      },
    ],
  },

  mahwah: {
    historyParagraphs: [
      'Mahwah is the northernmost township in Bergen County, on the New York line, with about 26,000 residents.',
      'Bergen held more enslaved people than any other county in New Jersey — 2,825 in the 1800 census, 18.6% of everyone living here. Slavery in Bergen was the ordinary arrangement of Dutch farm households, and it persisted: New Jersey freed nobody living in 1804, renamed the remaining enslaved as "apprentices" bound to their owners in 1846, still counted eighteen people held in 1860, and voted the Thirteenth Amendment down in March 1865 before ratifying it the following January, after it was already the law.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Mahwah. The nearest recorded ones are in Hackensack and Englewood.',
    abortionLandscapeOutro:
      'Mahwah is in Legislative District 39. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who represents Mahwah in the New Jersey Legislature?',
        a: 'Mahwah is in Legislative District 39, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Was there slavery in Bergen County?',
        a: 'More than in any other New Jersey county. The 1800 census counted 2,825 enslaved people in Bergen, 18.6% of its population.',
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

  raritan: {
    historyParagraphs: [
      'Raritan Township is the largest municipality in Hunterdon County, wrapped around the borough of Flemington in the centre of the county. Note the name: this is not Raritan Borough, which is in Somerset County, nor Raritan Bay.',
      'Quaker settlements in this county formed one end of a chain of Underground Railroad stations running from Quakertown, here in Hunterdon, north to the Drowned Lands of Sussex. New Jersey\'s geography made it matter — it lay between Philadelphia and New York, the two busiest centres of the railroad, and directly across the water from Delaware and Maryland. Hunterdon is one of the older counties, dating to 1714, and it held Trenton until Mercer was created out of it in 1838.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory sits inside Raritan Township itself, but one operates in Flemington, the borough it surrounds:',
    abortionLandscapeOutro:
      'Raritan Township is in Legislative District 16, which it shares with Hillsborough and South Brunswick. Its three legislators are below.',
    faqs: [
      {
        q: 'Which Raritan is this?',
        a: 'Raritan Township in Hunterdon County, which surrounds Flemington. It is not Raritan Borough, a separate municipality in Somerset County, and not Raritan Bay.',
      },
      {
        q: 'Who represents Raritan Township in the New Jersey Legislature?',
        a: 'Raritan Township, Hunterdon County is in Legislative District 16, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Where is the nearest abortion facility?',
        a: 'The Planned Parenthood centre in Flemington, the borough this township surrounds.',
        links: [{ phrase: 'abortion facilities page', href: '/abortion-mills' }],
      },
    ],
  },

  vernon: {
    historyParagraphs: [
      'Vernon is a large township in the north-east corner of Sussex County, on the New York border, with about 23,000 residents.',
      'The chain of Quaker Underground Railroad stations that began at Quakertown in Hunterdon ran north to the Drowned Lands of Sussex County — about as far from the Delaware crossings as a person could travel and still be in New Jersey. Sussex was formed out of Morris in 1753 and gave up its western half to create Warren County in 1824. All of it lay inside a state that would not finish abolishing slavery until 1865, and whose Legislature voted against the Thirteenth Amendment before accepting it.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Vernon Township. The nearest recorded one is the Planned Parenthood centre in Newton, the Sussex County seat.',
    abortionLandscapeOutro:
      'Vernon is in Legislative District 24, which it shares with Mount Olive in Morris County. Its three legislators are below.',
    faqs: [
      {
        q: 'Who represents Vernon in the New Jersey Legislature?',
        a: 'Vernon is in Legislative District 24, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Where is the nearest abortion facility?',
        a: 'The Planned Parenthood centre in Newton, the Sussex County seat. It is mapped on our abortion facilities page.',
        links: [{ phrase: 'abortion facilities page', href: '/abortion-mills' }],
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. Neither a bill of abolition nor an equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
      },
    ],
  },

  lower: {
    historyParagraphs: [
      'Lower Township is the largest municipality in Cape May County, at the very southern tip of New Jersey where the Delaware Bay meets the Atlantic.',
      'Between 1849 and 1852 Harriet Tubman spent her summers in Cape May working as a cook and domestic in the hotels, and used the wages to pay for her returns to Maryland. Her friend Franklin Sanborn recorded it: "She returned to the states, and as usual earned money by working in hotels and families as a cook. From Cape May, in the fall of 1852, she went back once more to Maryland, and brought away nine more fugitives." This county was also a landing point — the first foothold in a free state for people who crossed the Delaware Bay at night in small boats, guided by a signal of two lanterns answered from the shore.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Lower Township. The nearest recorded one is in Absecon, in Atlantic County.',
    abortionLandscapeOutro:
      'Lower Township is in Legislative District 1, which it shares with Vineland. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'What is Harriet Tubman\'s connection to Cape May?',
        a: 'She worked summers in Cape May hotels between 1849 and 1852 as a cook and domestic, and used the money to fund her rescue missions back to Maryland. From Cape May in the autumn of 1852 she returned to Maryland and brought away nine more people.',
      },
      {
        q: 'Who represents Lower Township in the New Jersey Legislature?',
        a: 'Lower Township is in Legislative District 1, which it shares with Vineland. The district elects one senator and two assembly members; all three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'How many abortions happen in New Jersey?',
        a: 'New Jersey publishes no count at any geography and does not report to the CDC. Guttmacher estimates about 61,200 in 2025.',
      },
    ],
  },

  phillipsburg: {
    historyParagraphs: [
      'Phillipsburg is a town of about 15,000 on the Delaware in Warren County, facing Easton, Pennsylvania across the river.',
      'People escaping slavery usually entered New Jersey by crossing the Delaware at night in a small boat, guided by a signal of two lanterns — yellow above blue — answered from the shore when it was safe to land. This town sits on that crossing. The Springtown Inn, built around 1825 on the road running from Easton through Phillipsburg toward Somerville and Trenton, is held by strong local tradition to have served as a safe house; the constant traffic of an inn would have made good cover. That is tradition rather than documented record, and we offer it as such.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Phillipsburg. One does operate elsewhere in Warren County — the Planned Parenthood centre in Washington Borough, which is often mistaken for Washington Township in Gloucester County, sixty miles south.',
    abortionLandscapeOutro:
      'Phillipsburg is in Legislative District 23, the same district as the Washington Borough facility. Its three legislators are below.',
    faqs: [
      {
        q: 'Where is the "Washington, NJ" abortion facility?',
        a: 'In Washington Borough, Warren County — this county, in Legislative District 23. It is frequently confused with Washington Township in Gloucester County, which is a different municipality about sixty miles to the south.',
        links: [{ phrase: 'Washington Township', href: '/cities/washington' }],
      },
      {
        q: 'Who represents Phillipsburg in the New Jersey Legislature?',
        a: 'Phillipsburg is in Legislative District 23, which elects one senator and two assembly members. All three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Was Phillipsburg on the Underground Railroad?',
        a: 'It sits on a Delaware crossing that people escaping slavery used, and the nearby Springtown Inn is held by strong local tradition to have been a safe house. That tradition is not the same as documented record, and we do not present it as one.',
      },
    ],
  },

  pennsville: {
    historyParagraphs: [
      'Pennsville is the largest municipality in Salem County, on the Delaware in the far south-west of the state.',
      'Salem is where Abigail Goodwin lived. A birthright Quaker whose father and uncle freed the people they held during the Revolution, she made the house she shared with her sister at 47 Market Street an Underground Railroad station by 1838, and counted William Still and Harriet Tubman among her friends. She was also put out of the Orthodox Quaker Meeting in Salem — for joining the radical Friends who demanded the total abolition of slavery rather than its gradual reduction. She was expelled from her own church for refusing to be an incrementalist. In 2008 the Goodwin Sisters House became the first site in New Jersey accepted into the National Park Service\'s Network to Freedom.',
    ],
    abortionLandscapeIntro:
      'No abortion facility in our directory operates inside Pennsville Township, or anywhere in Salem County.',
    abortionLandscapeOutro:
      'Pennsville is in Legislative District 3, which it shares with Glassboro. Its three legislators and their recorded FRCA votes are below.',
    faqs: [
      {
        q: 'Who was Abigail Goodwin?',
        a: 'A Quaker abolitionist of Salem (1793–1867) whose home at 47 Market Street was an Underground Railroad station from 1838, and who was ejected from her Orthodox Quaker Meeting for joining the radical Friends demanding the total abolition of slavery rather than its gradual reduction. The Goodwin Sisters House was the first New Jersey site accepted into the National Park Service Network to Freedom, in 2008.',
      },
      {
        q: 'Who represents Pennsville in the New Jersey Legislature?',
        a: 'Pennsville is in Legislative District 3, which it shares with Glassboro. The district elects one senator and two assembly members; all three are listed on this page.',
        links: [{ phrase: 'listed on this page', href: '/legislators' }],
      },
      {
        q: 'Is there a bill to abolish abortion in New Jersey?',
        a: 'No. Neither a bill of abolition nor an equal-protection bill has been introduced in the New Jersey Legislature.',
        links: [{ phrase: 'bill of abolition', href: '/abolition-bills' }],
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
