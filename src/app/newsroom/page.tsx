import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Newsroom',
};

export default function NewsroomPage() {
  return (
    <section>
      <h1>Newsroom</h1>
      <p>Route placeholder. This page is specified in docs/features/18-newsroom.md (FE-18).</p>
    </section>
  );
}
