import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer',
};

export default function DisclaimerPage() {
  return (
    <section>
      <h1>Disclaimer</h1>
      <p>Route placeholder. This page is specified in docs/features/21-legal-pages.md (FE-21).</p>
    </section>
  );
}
