# New Jersey abortion statistics — sources and caveats

Backing for the homepage counter row (`statistics` in `lib/content.ts`).
**Every figure here should be confirmed with the client before launch**, and
refreshed when Guttmacher publishes the next annual release.

## Published figures

| Counter | Value | Year | Source |
|---|---|---|---|
| Abortions in New Jersey | 59,830 | 2024 | Guttmacher Institute, 2024 abortion provision estimates |
| Every single day | 163 | 2024 | Derived: 59,830 ÷ 366, rounded down |
| Abortion rate per 1,000 women 15–44 | 32.9 | 2024 | Guttmacher (national rate same year: 15.5) |
| Share of pregnancies ending in abortion | 37% | 2024 | Guttmacher |

The 2024 count **includes out-of-state patients** who travelled to New Jersey,
and **excludes** New Jersey residents who obtained abortions elsewhere. It
covers clinician-provided abortions plus medication abortion via telehealth and
online-only providers.

## Guttmacher series for New Jersey

| Year | Abortions |
|---|---|
| 2005 | 61,150 |
| 2008 | 54,160 |
| 2011 | 46,990 |
| 2014 | 44,460 |
| 2017 | 48,110 |
| 2020 | 48,830 |
| 2023 | 59,690 |
| 2024 | 59,830 |

Note the gap: the Abortion Provider Census ran every three years through 2020;
annual figures resume in 2023. **2021 and 2022 have no Guttmacher figure.**

## Two things that were deliberately NOT published

**No cumulative "total since 1973".** New Jersey does not report abortion data
to the CDC — confirmed in *Abortion Surveillance — United States, 2022*, which
records New Jersey as not providing data for the reporting period. As a result
two incompatible series exist: state/CDC-derived compilations put recent years
around 22,000–24,000 annually, while Guttmacher's estimates for the same years
are roughly double that (~48,000). A cumulative total since 1973 would swing by
well over a million depending on which series is used, so no single number is
defensible. It was dropped rather than estimated.

**No "since the Freedom of Reproductive Choice Act" total.** The FRCA was signed
January 2022, and 2021–2022 are exactly the years with no Guttmacher figure, so
the total for that window cannot be computed without inventing two years of
data.

If the client wants either counter restored, it needs a stated methodology
published alongside it — not a round number.

## Context worth knowing

New Jersey's abortion rate (32.9) is more than double the national rate (15.5),
among the highest of any state. That gap is better supported by the available
data than any cumulative figure, which is why the counter row leads with it.

## Sources

- [Guttmacher Institute — full-year US abortion data for 2024](https://www.guttmacher.org/news-release/2025/guttmacher-institute-releases-full-year-us-abortion-data-2024)
- [Guttmacher Institute — stability in the number of abortions, 2023 to 2024](https://www.guttmacher.org/report/stability-number-abortions-2023-2024-us-states-without-total-bans-masks-major-shifts-access)
- [Guttmacher Institute — New Jersey abortion policies](https://states.guttmacher.org/policies/new-jersey/abortion-policies)
- [Historical abortion statistics, New Jersey — Johnston's Archive](https://www.johnstonsarchive.net/policy/abortion/usa/ab-usa-NJ.html) (state-reported series; note the conflict described above)
- CDC, *Abortion Surveillance — United States, 2022* (New Jersey recorded as not reporting)
