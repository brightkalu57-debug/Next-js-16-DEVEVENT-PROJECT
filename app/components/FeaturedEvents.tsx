import type { IEvent } from '@/database/event.model';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

type FeaturedEventsProps = {
  title?: string;
  limit?: number;
};

const FeaturedEvents = async ({ title, limit }: FeaturedEventsProps) => {
  if (!BASE_URL) {
    throw new Error('NEXT_PUBLIC_BASE_URL is not configured');
  }

  const response = await fetch(`${BASE_URL}/api/event`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.status}`);
  }

  const { events }: { events: IEvent[] } = await response.json();
  const displayedEvents = limit === undefined ? events : events.slice(0, limit);

  return (
    <section>
      <h3 className="text-2xl font-bold mt-20">{title}</h3>
      {displayedEvents.length > 0 ? (
        <ul className="events mt-10">
          {displayedEvents.map((event) => (
            <li key={event.slug} className="list-none">
              <Link href={`/event/${event.slug}`} className="flex flex-col">
                <img src={event.image} alt={event.title} className="poster" />
                <div className="flex items-center gap-2 mt-4">
                  <img src="/icons/pin.svg" alt="" className="h-4 w-4" />
                  <p className="font-thin text-sm">{event.location}</p>
                </div>
                <h4 className="mt-3 text-base font-semibold">{event.title}</h4>
                <div className="mt-3 flex items-center max-md:mb-5 mb-6">
                  <div className="flex items-center gap-2 border-r border-solid pr-[10px] m-0">
                    <img src="/icons/calendar.svg" alt="" className="h-4 w-4" />
                    <p className="text-xs font-thin">{event.date}</p>
                  </div>
                  <div className="flex items-center gap-2 pl-[10px] m-0">
                    <img src="/icons/clock.svg" alt="" className="h-4 w-4" />
                    <p className="text-xs font-thin">{event.time}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10">No events found.</p>
      )}
    </section>
  );
};

export default FeaturedEvents;
