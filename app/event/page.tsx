import FeaturedEvents from '../components/FeaturedEvents';
import { Suspense } from 'react';

export default function EventsPage() {
  return (
      <Suspense fallback={<p style={{ color: '#a1a1aa' }}>Loading upcoming events...</p>}>
        <FeaturedEvents title="All Events" />;
      </Suspense>
    )
}
