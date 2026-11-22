import FeaturedEvents from '../components/FeaturedEvents';

export default function EventsPage() {
  return (
      <Suspense fallback={<p style={{ color: '#a1a1aa' }}>Loading upcoming events...</p>}>
        <FeaturedEvents title="All Events" />;
      </Suspense>
    )
}
