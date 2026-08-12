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
