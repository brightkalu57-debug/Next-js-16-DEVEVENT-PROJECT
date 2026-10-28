import type { IEvent } from '@/database/event.model';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const FeaturedEvents = async () => {
  const response = await fetch(`${BASE_URL}/api/event`, {
    next: { revalidate: 60 },
  });

  const { events } = await response.json();
  return (
    <section>
      <h3 className="text-2xl font-bold mt-20">Featured Events</h3>
      <ul className="mt-10 grid grid-cols-3 gap-8 max-md:flex max-md:flex-col max-md:gap-2 block">
        {events &&
          events.length > 0 &&
          events.map((event: IEvent) => (
            <li key={event.slug} className="list-none">
              <Link href={`/event/${event.slug}`} className="flex flex-col">
                <img src={event.image} alt={event.title} className="poster" />
                <div className="flex items-center gap-2 mt-4">
                  <img src="icons/pin.svg" alt="Location" className="h-4 w-4" />
                  <p className="font-thin text-sm">{event.location}</p>
                </div>
                <h4 className="mt-3 text-base font-semibold">{event.title}</h4>
                <div className="mt-3 flex items-center gap-3 max-md:mb-5 mb-6">
                  <div className="flex items-center gap-2 border-r border-solid pr-[10px] m-0">
                    <img
                      src="icons/calendar.svg"
                      alt="Date"
                      className="h-4 w-4"
                    />
                    <p className="text-xs font-thin">{event.date}</p>
                  </div>
                  <div className="flex items-center gap-2 pl-[10px] m-0">
                    <img src="icons/clock.svg" alt="Time" className="h-4 w-4" />
                    <p className="text-xs font-thin">{event.time}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
      </ul>
    </section>
  );
};

export default FeaturedEvents;
