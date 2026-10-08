import { ArrowRight } from 'lucide-react';
import { esgReport } from '@/app/_content/our-core-beliefs';
import { Button } from '@/components/ui/button';

/**
 * The ESG Report pill — a link to the Sustainability Reports page under
 * Corporate Governance, in the same tab.
 *
 * Our Core Beliefs draws it under its last belief, and Our Key ESG Metrics
 * under "Reporting Framework" (the client's request of 2026-10-07). One
 * component, so the two pages cannot link different places. Where it goes,
 * and why, is on `esgReport` in `_content/our-core-beliefs.ts`.
 *
 * `ArrowRight`, not the `ArrowUpRight` it took while it opened a PDF in a
 * new tab: it is a page on this site now.
 *
 * The full width on a phone, where the pill is the easier target; its own
 * width from `sm`.
 */
export function EsgReportLink() {
  return (
    <Button href={esgReport.href} variant="pill" className="w-full sm:w-fit">
      {esgReport.label}
      <ArrowRight className="size-5 shrink-0" aria-hidden="true" focusable="false" />
    </Button>
  );
}
