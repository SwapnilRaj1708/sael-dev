import goal03 from '@/assets/images/sdg/goal-03.png';
import goal05 from '@/assets/images/sdg/goal-05.png';
import goal07 from '@/assets/images/sdg/goal-07.png';
import goal08 from '@/assets/images/sdg/goal-08.png';
import goal09 from '@/assets/images/sdg/goal-09.png';
import goal10 from '@/assets/images/sdg/goal-10.png';
import goal11 from '@/assets/images/sdg/goal-11.png';
import goal12 from '@/assets/images/sdg/goal-12.png';
import goal13 from '@/assets/images/sdg/goal-13.png';
import goal15 from '@/assets/images/sdg/goal-15.png';
import type { EsgHeroProps } from '@/components/sections/esg-hero';
import type { ProseSplitProps } from '@/components/sections/prose-split';
import type { SdgGridProps } from '@/components/sections/sdg-grid';
import type { StakeholderMapProps } from '@/components/sections/stakeholder-map';
import { TODO_CONTENT } from '@/lib/config/site';

/**
 * Our Key ESG Metrics' static content (FE-13).
 *
 * ## The copy
 *
 * The design's, `Our Key ESG Metrics v2.dc.html` (Claude Design project
 * `6afc516d-…`, 2026-10-06), which its handoff records as the live page's
 * word for word, line breaks collapsed — including "Stakeholder's Map",
 * "Investors/ Lenders", "Govt./ Regulatory Bodies" and the curly apostrophe
 * in "SAEL’s". **No metrics, figures or group labels are added**: the live
 * page has none, and neither does the design. The only numbers are the SDG
 * numbers, which are the live page's.
 *
 * **One addition, and it is not SAEL's to write:** the UN's disclaimer and
 * two links under the SDG icons. The UN's guidelines for using the icons
 * ask for them on the same page; the live page does not carry them.
 *
 * ## The SDG icons
 *
 * The UN's official colour icons, downloaded from un.org on 2026-10-06
 * ("17 SDG Icons (WEB)", `E-Goal-NN-1024x1024.png`) and committed under
 * `src/assets/images/sdg/` — not the live page's copies, which are not
 * confirmed to be current (goal 10's icon was redrawn in 2018), and not
 * hotlinked. See `<SdgGrid>` for what the guidelines allow on top of them,
 * which is nothing.
 *
 * Each links to its goal's section on the SDG page (`#sdg-N`), the live
 * page's own links, written with the trailing slash the route carries.
 */

export const esgMetricsMeta = {
  /** The live page's own `<title>`, verbatim. */
  title: 'Our Key ESG Metrics - SAEL',
  /**
   * The live page ships `<meta name="description" content="">`. Nothing to
   * transcribe; `buildMetadata()` drops the marker rather than emitting it.
   */
  description: TODO_CONTENT,
} as const;

export const esgMetricsHero: Omit<EsgHeroProps, 'snap'> = {
  eyebrow: 'Sustainability',
  title: 'Our Key ESG Metrics',
  intro:
    'SAEL dutifully focuses on ESG (Environmental, Social, and Governance) metrics, prioritizing sustainability.',
};

/** A goal's section on the SDG page. */
const sdgHref = (n: number): string => `/sustainable-development-goals/#sdg-${String(n)}`;

export const sdgCommitments: Omit<SdgGridProps, 'snap'> = {
  eyebrow: 'Sustainable Development Goals',
  title: 'Our Commitment to The UN SDGs',
  // The live page's ten, in numeric order, named as it names them.
  goals: [
    { number: 3, title: 'Good Health & Well-Being', href: sdgHref(3), icon: goal03 },
    { number: 5, title: 'Gender Equality', href: sdgHref(5), icon: goal05 },
    { number: 7, title: 'Affordable & Clean Energy', href: sdgHref(7), icon: goal07 },
    { number: 8, title: 'Decent Work & Economic Growth', href: sdgHref(8), icon: goal08 },
    {
      number: 9,
      title: 'Industry, Innovation, & Infrastructure',
      href: sdgHref(9),
      icon: goal09,
    },
    { number: 10, title: 'Reduced Inequality', href: sdgHref(10), icon: goal10 },
    { number: 11, title: 'Sustainable Cities & Communities', href: sdgHref(11), icon: goal11 },
    {
      number: 12,
      title: 'Responsible Consumption & Production',
      href: sdgHref(12),
      icon: goal12,
    },
    { number: 13, title: 'Climate Action', href: sdgHref(13), icon: goal13 },
    { number: 15, title: 'Life On Land', href: sdgHref(15), icon: goal15 },
  ],
  // The UN's wording, verbatim, and its two links. See the note above.
  notice: {
    text: 'The content of this publication has not been approved by the United Nations and does not reflect the views of the United Nations or its officials or Member States.',
    links: [
      {
        label: 'UN Sustainable Development Goals',
        href: 'https://www.un.org/sustainabledevelopment',
      },
      {
        label: 'SDG logo & icon usage guidelines (PDF)',
        href: 'https://www.un.org/sustainabledevelopment/wp-content/uploads/2023/09/E_SDG_Guidelines_Sep20238.pdf',
      },
    ],
  },
};

export const reportingFramework: Omit<ProseSplitProps, 'snap'> = {
  eyebrow: 'ESG Reporting',
  title: 'Reporting Framework',
  body: [
    'We rely on several widely accepted ESG reporting methodologies to inform us of our approach to sharing SAEL’s sustainability progress and key performance indicators (KPIs). This helps us ensure the framework we use is aligned with industry standards, allowing us to inform our stakeholders of our ESG efforts in a streamlined manner.',
  ],
  copyBeside: true,
};

export const stakeholders: Omit<StakeholderMapProps, 'snap'> = {
  eyebrow: "Stakeholder's Map",
  title: 'Our Key Stakeholders',
  // The live page's two groups, in its order: the six it draws in blue,
  // then the two in green.
  outer: [
    'Media/NGOs',
    'Customers',
    'Investors/ Lenders',
    'Vendors/ Suppliers',
    'Govt./ Regulatory Bodies',
    'Local Communities',
  ],
  inner: ['Employees', 'Contractual Workforce'],
};
