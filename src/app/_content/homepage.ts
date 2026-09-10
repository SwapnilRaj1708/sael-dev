import iconAgriWaste from '@/assets/images/business/icon-agri-waste.png';
import iconCellManufacturing from '@/assets/images/business/icon-solar-cell.png';
import iconModuleManufacturing from '@/assets/images/business/icon-solar-module.png';
import iconSolarGeneration from '@/assets/images/business/icon-solar-energy.png';
import aboutCutout from '@/assets/images/aboutSael/sardar-kid-cropped.png';
import aboutPhoto from '@/assets/images/aboutSael/burning-crop.png';
import heroImageMobile1 from '@/assets/images/hero/hero-image-mobile-1.jpg';
import heroImageMobile2 from '@/assets/images/hero/hero-image-mobile-2.jpg';
import heroImageMobile3 from '@/assets/images/hero/hero-image-mobile-3.jpg';
import heroImageMobile4 from '@/assets/images/hero/hero-image-mobile-4.jpg';
import heroImage1 from '@/assets/images/hero/hero-copy-2-1.png';
import heroImage2 from '@/assets/images/hero/hero-copy-2-2.png';
import heroImage3 from '@/assets/images/hero/hero-copy-2-3.png';
import heroImage4 from '@/assets/images/hero/hero-copy-2-4.png';
import saelIcon1 from '@/assets/images/hero/cropped-sael-icon-1.png';
import saelIcon2 from '@/assets/images/hero/cropped-sael-icon-2.png';
import saelIcon3 from '@/assets/images/hero/cropped-sael-icon-3.png';
import saelIcon4 from '@/assets/images/hero/cropped-sael-icon-4.png';
import solBhadra from '@/assets/images/solutions/sol-bhadra.jpg';
import solKishangarh from '@/assets/images/solutions/sol-kishangarh.jpg';
import solMizoram from '@/assets/images/solutions/sol-mizoram.jpg';
import solPatiala from '@/assets/images/solutions/sol-patiala.jpg';
import goalEthos from '@/assets/images/goals/India-orange.jpg';
import goalMission from '@/assets/images/goals/green.jpg';
import goalVision from '@/assets/images/goals/panel-closeup.jpg';
import endeavourGirl from '@/assets/images/endeavour/endeavour-girl.png';
import endeavourPanel from '@/assets/images/endeavour/solar-panel.png';
import dottedMap from '@/assets/images/dotted-map.svg';
// import dottedMap from '@/assets/images/map.svg';
import markEthos from '@/assets/images/ethos-icon.svg';
import markMission from '@/assets/images/mission-icon.svg';
import markVision from '@/assets/images/vision-icon.svg';
import type { EndeavourSplitProps } from '@/components/sections/endeavour-split';
import type { GoalsGridProps } from '@/components/sections/goals-grid';
import type { HeroSlide } from '@/components/sections/hero-carousel';
import type { IntroSplitProps } from '@/components/sections/intro-split';
import type { PresenceSite } from '@/components/sections/presence-map';
import type { SolutionsCarouselProps } from '@/components/sections/solutions-carousel';
import { TODO_CONTENT } from '@/lib/config/site';

/**
 * The homepage's static content.
 *
 * Static, not dynamic: this is marketing copy that changes with a design
 * review and a deploy, so it lives in typed TypeScript rather than behind the
 * content repository. The homepage's *dynamic* surfaces — the capacity
 * figures and the news items — come from `getContentRepository()` instead.
 * docs/content-model.md §1.
 *
 * Section components never import this file. The page reads it and passes it
 * down, which is what keeps every section reusable on the pages that follow.
 * /CLAUDE.md §5.
 */

/**
 * The hero's four slides, rebuilt to `SAEL Home v2`.
 *
 * The six placement coordinates each slide used to carry are gone with the
 * design that needed them: v2 has one composition and the content column sits
 * in the same place on every slide. What is per-slide now is the photograph,
 * the mark, the headline, the run of words inside it that takes a gradient,
 * and the ramp its progress segment fills with.
 *
 * The four highlights are the design's own. Each is an exact substring of the
 * headline above it — `<HeroHeadline>` matches on words, and a highlight that
 * does not match renders flat rather than breaking the headline.
 *
 * The progress bar no longer takes a ramp per slide: it fills once across the
 * whole cycle from one gradient. See `<HeroProgress>`.
 *
 * Still outstanding, and each renders through `<MediaFrame>`'s pending state
 * until it lands (docs/asset-inventory.md §9):
 *
 *  - the four art-directed **portrait crops** for below `lg`. Until they
 *    arrive the landscape master stands in — see the note in hero-backdrop.tsx.
 *  - `alt` text for every photograph
 */
export const heroSlides: HeroSlide[] = [
  {
    id: 'solar-modules',
    image: {
      desktop: heroImage1,
      mobile: heroImageMobile1,
      // Describes the scene, not the brand. docs/design-guidelines.md §6.
      alt: TODO_CONTENT,
    },
    symbol: { image: saelIcon1, pending: 'icons/symbol-cell-manufacturing' },
    headline: 'A leading manufacturer for Bifacial TOPCon solar modules',
    highlight: 'Bifacial TOPCon solar modules',
    highlightClassName: 'bg-(image:--gradient-hero-word-1)',
  },
  {
    id: 'energy-generation',
    image: {
      desktop: heroImage2,
      mobile: heroImageMobile2,
      alt: TODO_CONTENT,
    },
    symbol: { image: saelIcon2, pending: 'icons/symbol-module-manufacturing' },
    headline: 'Generating clean energy by investing in advanced technology and systems',
    highlight: 'clean energy',
    highlightClassName: 'bg-(image:--gradient-hero-word-2)',
  },
  {
    id: 'clean-energy-vision',
    image: { desktop: heroImage3, mobile: heroImageMobile3, alt: TODO_CONTENT },
    symbol: { image: saelIcon3, pending: 'icons/symbol-solar-generation' },
    headline: 'A vision to building the capacity for India’s clean energy needs',
    highlight: 'clean energy',
    highlightClassName: 'bg-(image:--gradient-hero-word-3)',
  },
  {
    id: 'agri-waste',
    image: { desktop: heroImage4, mobile: heroImageMobile4, alt: TODO_CONTENT },
    symbol: { image: saelIcon4, pending: 'icons/symbol-agri-waste' },
    headline: 'Converting ~2 million tonnes of paddy waste into clean energy',
    highlight: 'clean energy',
    highlightClassName: 'bg-(image:--gradient-hero-word-4)',
  },
];

/**
 * "About SAEL" — section 2.
 *
 * Copy transcribed from `SAEL - New Website.pdf`, the client's own design,
 * rather than from the Designer prototype. The two differ for this section and
 * the client asked for the PDF; see the note on `<IntroSplit>`.
 *
 * The body is the PDF's verbatim, with its line-break hyphen in
 * "decar-bonization" closed up and its apostrophes normalised to the typographic
 * form used everywhere else on the site. Nothing else is altered.
 */
export const aboutSael: Omit<IntroSplitProps, 'snap'> = {
  eyebrow: 'About SAEL',
  title: 'Endeavoring to make a sustainable impact',
  body:
    'At SAEL, we strive to provide decarbonization solutions to facilitate ' +
    'India’s adoption of clean and affordable energy projects. Our commitment ' +
    'lies in delivering environmentally conscious energy solutions. As one of ' +
    'India’s leading renewable energy companies, we are dedicated to enhancing ' +
    'the energy landscape nationwide.',
  media: {
    image: aboutPhoto,
    // Two alts where there was one, because there are two images where there
    // was one: the sentence that described the composite — "A young boy in a
    // turban, against a field of burning crop stubble" — split at its comma,
    // each half now describing the layer it belongs to. Nothing new is
    // asserted. Both describe the artwork rather than the section, and both
    // are still copy that wants a review.
    alt: 'A field of burning crop stubble',
    cutout: aboutCutout,
    cutoutAlt: 'A young boy in a turban',
  },
};

/**
 * "Business Portfolio" — section 3.
 *
 * The **static** half of each card: mark, name, copy and destination. The
 * capacity figure and its qualifier are dynamic and arrive from
 * `getCapacityStats()`; the page joins the two on `id`.
 * docs/content-model.md §1.
 *
 * `upcoming` is the only per-row adjustment — see the note beside it. There
 * was a second, `iconScale`, which scaled one mark against the other three;
 * the agri-waste nudge it existed for was withdrawn on 2026-08-22 and the
 * prop itself on 2026-08-26, when the mark stopped being drawn in a box.
 *
 * The descriptions are the Designer prototype's, verbatim, as
 * docs/features/04 §4 requires. The client's PDF sets Lorem ipsum in these
 * four slots, so it is not a source for them — and inventing marketing copy
 * for a company that publishes financial results is exactly what /CLAUDE.md §3
 * forbids. Where the two sources disagree on *layout* the PDF wins; where the
 * PDF simply has no content, the prototype does.
 */
export const businessTiles = [
  {
    id: 'solar-generation',
    icon: iconSolarGeneration,
    title: 'Solar Energy Generation',
    description:
      'SAEL develops and operates large-scale solar power plants, generating clean, ' +
      'affordable energy across India and advancing the nation’s renewable transition.',
    href: '/solar-energy/',
    ctaLabel: 'Know more about solar energy generation',
    figureClassName: 'text-figure-solar-bright',
    ruleClassName: 'bg-figure-solar-bright',
    titleGradientClassName: '[--ledger-title-gradient:var(--gradient-ledger-solar)]',
  },
  {
    id: 'cell-manufacturing',
    icon: iconCellManufacturing,
    title: 'Solar Cell Manufacturing',
    // The design marks this business as upcoming, and the footnote on the
    // capacity figure explains what the asterisk means.
    titleMarker: '*',
    description:
      'Our facilities manufacture high-efficiency solar cells using advanced bifacial ' +
      'TOPCon technology, delivering superior output and reliability.',
    href: '/solar-cell-manufacturing/',
    ctaLabel: 'Know more about solar cell manufacturing',
    figureClassName: 'text-figure-cell-bright',
    ruleClassName: 'bg-figure-cell-bright',
    titleGradientClassName: '[--ledger-title-gradient:var(--gradient-ledger-cell)]',
    // The one business that is not yet operational, so it takes its own
    // ground in the ledger. The client's call on 2026-08-20.
    upcoming: true,
  },
  {
    id: 'module-manufacturing',
    icon: iconModuleManufacturing,
    title: 'Solar Module Manufacturing',
    description:
      'We produce bifacial solar modules engineered for performance, durability and ' +
      'long-term reliability across diverse operating environments.',
    href: '/module-manufacturing/',
    ctaLabel: 'Know more about solar module manufacturing',
    figureClassName: 'text-figure-module-bright',
    ruleClassName: 'bg-figure-module-bright',
    titleGradientClassName: '[--ledger-title-gradient:var(--gradient-ledger-module)]',
  },
  {
    id: 'agri-waste',
    icon: iconAgriWaste,
    title: 'Agri Waste to Energy',
    description:
      'We convert agricultural residue into clean energy, reducing stubble burning and ' +
      'emissions while creating value for farming communities.',
    href: '/waste-to-energy/',
    ctaLabel: 'Know more about agri waste to energy',
    figureClassName: 'text-figure-agri-bright',
    ruleClassName: 'bg-figure-agri-bright',
    titleGradientClassName: '[--ledger-title-gradient:var(--gradient-ledger-agri)]',
    // The leaves carried a +12% nudge against the other three marks until
    // 2026-08-22. All four are drawn at one width now, each at its own
    // height — see the mark in sections/business-tiles.
  },
];

/**
 * "SAEL Pan India Green Footprint" — section 4.
 *
 * **Rebuilt from `SAEL-Numbers and data.pdf` page 2 on 2026-08-27**, which the
 * client supplied as this section's data template. It replaces six *site*
 * pins — Bhadra, Greater Noida, Kishangarh, Jalore, Mizoram, Kurnool — with
 * the eleven **states** the client's own map labels, each carrying between one
 * and three figures. Kurnool's `{{TODO: content}}` goes with them; it was the
 * one pin the handover never corroborated.
 *
 * ---------------------------------------------------------------------------
 * **The figures are the PDF's. Which legend each belongs to is derived, and
 * wants the client's confirmation.**
 *
 * The PDF marks every figure with an icon and decodes the four in a legend
 * strip under the map. Those icons do not survive at the resolution the file
 * gives us, so the assignment below was worked out from the totals the *same
 * document* prints on page 1, which is a stronger check than reading a 12px
 * glyph:
 *
 *  - **Agri waste-to-energy — exact.** 89.4 (Rajasthan) + 60.5 (Punjab) + 15
 *    (Haryana) = **164.9 MW**, page 1's figure to the decimal. Three values,
 *    one total, no slack: this is the assignment that fixes the other two.
 *  - **In-house module assembly — rounds.** 3400 (Rajasthan) + 225 (Punjab) +
 *    5000 (Uttar Pradesh) = 8625 MW → page 1's **8.6 GW**.
 *  - **Solar cell — named.** Page 1 puts the 5 GW cell capacity at *Jewar,
 *    Uttar Pradesh*, and Uttar Pradesh is the only state carrying a second
 *    5 GW here.
 *  - Everything left over is Solar IPP, which is also every single-figure
 *    state.
 *
 * **One thing does not reconcile, and it is the client's to answer, not ours.**
 * The Solar IPP figures sum to **9090 MW**, where page 1 of the same PDF says
 * **8.3 GWp** and `getCapacityStats()` returns 8299 MWp. No single value
 * accounts for the 791 MW gap, so it is not one misread icon — the map and the
 * headline look like different as-of dates. Both are reproduced as published
 * rather than reconciled here. /CLAUDE.md §3.
 *
 * Within a state the figures keep the order the PDF's own callout prints them
 * in. Uttar Pradesh's two are both "5 GW", so their order carries nothing.
 * ---------------------------------------------------------------------------
 *
 * Coordinates are points in the artwork's own 311.33 × 337.45 viewBox —
 * `src/assets/images/dotted-map.svg`, supplied by the client on 2026-08-21.
 *
 * **They are fitted, not measured.** The six site pins that preceded these
 * were themselves carried across from a previous 620 × 660 geometry rather
 * than measured (see sections/presence-map/dots.ts). Rather than start a
 * second, unrelated guess, a lon→x / lat→y linear fit was taken *from those
 * six* and the eleven state centroids pushed through it. The artwork turns out
 * to be a plain equirectangular projection and the fit is tight — five of the
 * six residuals are under one viewBox unit, the worst is 2.7, which is 0.9% of
 * the width. So these pins are no worse placed than the ones they replace,
 * which is not the same as saying either is right: **the map still wants an
 * eye before it ships.**
 *
 * `href` is absent throughout, so the design's "Visit Location" link does not
 * render. The destinations have not been supplied.
 */
export const presenceSites: PresenceSite[] = [
  {
    id: 'punjab',
    name: 'Punjab',
    x: 83.4,
    y: 60.4,
    figures: [
      { metric: 'solar-ipp', value: '1061 MW' },
      { metric: 'agri-waste', value: '60.5 MW' },
      { metric: 'module-assembly', value: '225 MW' },
    ],
  },
  {
    id: 'haryana',
    name: 'Haryana',
    x: 76,
    y: 76.5,
    figures: [
      { metric: 'solar-ipp', value: '285 MW' },
      { metric: 'agri-waste', value: '15 MW' },
    ],
  },
  {
    id: 'delhi',
    name: 'Delhi',
    x: 91.4,
    y: 84.6,
    figures: [{ metric: 'solar-ipp', value: '1 MW' }],
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    x: 121.4,
    y: 116.4,
    figures: [
      { metric: 'solar-ipp', value: '196 MW' },
      { metric: 'module-assembly', value: '5 GW' },
      { metric: 'solar-cell', value: '5 GW' },
    ],
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    x: 45.4,
    y: 124.4,
    figures: [
      { metric: 'solar-ipp', value: '298 MW' },
      { metric: 'agri-waste', value: '89.4 MW' },
      { metric: 'module-assembly', value: '3400 MW' },
    ],
  },
  {
    id: 'assam',
    name: 'Assam',
    x: 265.2,
    y: 124.4,
    figures: [{ metric: 'solar-ipp', value: '1 MW' }],
  },
  {
    id: 'mizoram',
    name: 'Mizoram',
    x: 257.6,
    y: 164.5,
    figures: [{ metric: 'solar-ipp', value: '21 MW' }],
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    x: 30.4,
    y: 172.4,
    figures: [{ metric: 'solar-ipp', value: '2406 MW' }],
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    x: 60.4,
    y: 204.4,
    figures: [{ metric: 'solar-ipp', value: '408 MW' }],
  },
  {
    id: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    x: 106.4,
    y: 252,
    figures: [{ metric: 'solar-ipp', value: '3165 MW' }],
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    x: 68.4,
    y: 244,
    figures: [{ metric: 'solar-ipp', value: '1248 MW' }],
  },
];

/**
 * The counts beside the map, exactly as the PDF sets them.
 *
 * Static for now, though they are arguably the same kind of value as the
 * capacity figures — a number the business owns that changes without a design
 * review. Worth a `getFootprintSummary()` on the repository when FE-05 builds
 * the contract out; it is not worth a method of its own today.
 */
export const presenceSummary = {
  // Neither of the first two is from the PDF. The heading was added at the
  // client's request on 2026-08-05 so the section has one of its own; the
  // label on 2026-08-26, so it opens the way every other section does — the
  // design's own screen has no label here. The footprint title below is the
  // PDF's.
  eyebrow: 'Portfolio',
  heading: 'Our Current Power Portfolio',
  map: { image: dottedMap },
  title: ['SAEL Pan India', 'Green Footprint'] as [string, string],
  primaryStat: '11 States',
  secondaryStat: '60 Projects Sites',
};

/**
 * "Solutions" — section 5.
 *
 * Copy and card order are the client's PDF verbatim, including the plaque
 * lines: Patiala's is "Solar Plant" with no figure on it, where Mizoram's
 * carries "21 MW". That asymmetry is the design's, not an omission — Patiala's
 * capacity has not been supplied, and adding one would be inventing a number
 * for a company that publishes results. /CLAUDE.md §3.
 *
 * The PDF shows three cards across with a fourth alongside; the fourth is
 * Bhadra, corroborated by both the AI reference and the map's own site list.
 *
 * `alt` describes each photograph rather than repeating the plant's name and
 * capacity — the plaque is already text, and a screen reader reads it. These
 * are written from the images themselves and assert nothing about the business
 * that is not visible in the frame, but they are still copy and want a review.
 */
export const solutions: Omit<SolutionsCarouselProps, 'snap'> = {
  eyebrow: 'Solutions',
  title: 'Embracing Green Energy for a Sustainable World',
  lead:
    'With a plant first approach, we are making a sustainable impact by ' +
    'propelling green energy solutions.',
  slides: [
    {
      id: 'patiala',
      image: solPatiala,
      alt: 'Aerial view of long rows of solar panels raised over a canal, lined with trees',
      place: 'Patiala',
      descriptor: 'Solar Plant',
    },
    {
      id: 'mizoram',
      image: solMizoram,
      alt: 'Aerial view of solar panels stepped across forested hills at sunrise',
      place: 'Mizoram',
      descriptor: '21 MW Solar Plant',
    },
    {
      id: 'kishangarh',
      image: solKishangarh,
      alt: 'Aerial view of a manufacturing plant at dusk beside a highway, hills on the horizon',
      place: 'Kishangarh',
      descriptor: 'Solar Module Manufacturing Plant',
    },
    {
      id: 'bhadra',
      image: solBhadra,
      alt: 'Aerial view of a lit power plant at night, its chimney stack rising over scrubland',
      place: 'Bhadra',
      descriptor: 'Biomass Plant',
    },
  ],
};

/**
 * "Our Endeavour" — section 6.
 *
 * The three paragraphs are the client's PDF verbatim, with its line-break
 * hyphen in "unwaver-ing" closed up and its apostrophes normalised to the
 * typographic form used everywhere else on the site. Nothing else is altered.
 *
 * No title: the design's "OUR ENDEAVOUR" is the eyebrow and there is no
 * heading under it. See the note on `<EndeavourSplit>`.
 */
export const ourEndeavour: Omit<EndeavourSplitProps, 'snap'> = {
  eyebrow: 'Our Endeavour',
  body: [
    'At SAEL, we are continuously endeavouring to facilitate India’s adoption of clean ' +
      'and affordable energy projects. As one of India’s leading renewable energy ' +
      'companies, we are dedicated to enhancing the energy landscape nationwide.',
    'We are committed to environmentally sustainable and economically viable energy ' +
      'solutions. We are involved in developing and implementing renewable energy ' +
      'technologies, energy efficiency solutions, and possibly energy access initiatives ' +
      'for underserved communities.',
    'We acknowledge the pivotal role of energy access in enhancing the well-being and ' +
      'satisfaction of both our customers and the communities we serve. Our unwavering ' +
      'commitment is to improve access to sustainable and clean energy.',
  ],
  media: {
    image: endeavourPanel,
    // Two alts where there was one, the same split the About artwork took on
    // 2026-09-01: the sentence that described the composite — "A young girl in
    // a white top, against solar panels lit in red and purple" — divided
    // between the layers it was describing. The colour is dropped from the
    // panel's half because it is no longer in the photograph; it is
    // --gradient-endeavour-panel, applied over it. Still copy, still wants a
    // review.
    alt: 'A close view of solar panels',
    cutout: endeavourGirl,
    cutoutAlt: 'A young girl in a white top',
  },
};

/**
 * "Our Goals" — section 7.
 *
 * The client's design skips `features/04` §9, the SDG marquee, so this follows
 * "Our Endeavour" directly. Confirmed by the client on 2026-08-05: the SDG
 * section is not to be built for now.
 *
 * Copy is the PDF's verbatim, with its line-break hyphen in "renew-able"
 * closed up. Both the PDF and the Designer prototype carry the same three
 * paragraphs, so there is no source conflict here.
 *
 * **The marks are the client's own now.** They were `lucide-react` stand-ins
 * while the artwork was outstanding; the three SVGs arrived on 2026-08-21 and
 * are here. They are drawn in near-black for use on paper and the card inverts
 * them to white — see the note at the call site in sections/goals-grid.
 */
export const ourGoals: Omit<GoalsGridProps, 'snap'> = {
  title: 'Our Goals',
  goals: [
    {
      id: 'mission',
      title: 'Mission',
      body:
        'SAEL is committed to reshaping the global energy panorama through scalable and ' +
        'sustainable solutions. We harness cutting-edge technologies and industry best ' +
        'practices to provide dependable and eco-friendly energy solutions, fostering the ' +
        'widespread adoption of renewable energy across diverse markets.',
      image: goalMission,
      icon: markMission,
    },
    {
      id: 'vision',
      title: 'Vision',
      body:
        'At SAEL, our vision is to spearhead the shift towards a sustainable energy future, ' +
        'where renewable sources drive economies and enhance lives. We envision a future ' +
        'where sustainable energy solutions seamlessly integrate into global infrastructure.',
      image: goalVision,
      icon: markVision,
    },
    {
      id: 'ethos',
      title: 'Ethos',
      body:
        'SAEL exemplifies an unwavering dedication to sustainable energy solutions, fueled ' +
        'by innovation, integrity, and holistic community empowerment. Our principles embody ' +
        'a culture of excellence, inclusivity, and accountability, fostering resonance with ' +
        'our global communities and partners.',
      image: goalEthos,
      icon: markEthos,
    },
  ],
};
