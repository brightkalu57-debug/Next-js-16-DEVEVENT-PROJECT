import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import type { IEvent } from '@/database/event.model';
import Booking from './booking';
import { getSimilarEventsBySlug } from '@/lib/event.acton';

type PageProps = {
  params: Promise<{ slug: string }>;
};
type EventDetails = {
  property: string;
  value: string;
  imgsrc: string;
  imgalt: string;
};

async function EventContent({ params }: PageProps) {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_BASE_URL is not configured');
  }

  const response = await fetch(`${baseUrl}/api/event/${slug}`, {
    next: { revalidate: 60 },
  });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch event: ${response.status}`);
  }

  const { event }: { event: IEvent } = await response.json();

  const similarEvents = await getSimilarEventsBySlug(slug);

  return (
    <main className="p-0">
      <section id="event">
        <div className="details">
          <div className="content">
            <div className="mb-4">
              <h1>{event.title}</h1>
              <p className="mt-4 max-w-200 text-sm text-gray-300">
                {event.description}
              </p>
            </div>
            <img
              className="banner"
              src={event.image}
              alt={event.title}
              width={800}
              height={800}
            />
            <div className="mt-12">
              <h4 className="text-[22px] font-bold">Overview</h4>
              <p className="max-w-200 mt-2 text-sm text-gray-300">
                {event.overview}
              </p>
            </div>
            <div className="mt-12">
              <h4 className="text-[22px] font-bold">Event Details</h4>
              {(
                [
                  {
                    property: 'Date',
                    value: event.date,
                    imgsrc: 'calendar',
                    imgalt: 'Date',
                  },
                  {
                    property: 'Time',
                    value: event.time,
                    imgsrc: 'clock',
                    imgalt: 'time',
                  },
                  {
                    property: 'Venue',
                    value: event.venue,
                    imgsrc: 'pin',
                    imgalt: 'location',
                  },
                  {
                    property: 'Mode',
                    value: event.mode,
                    imgsrc: 'mode',
                    imgalt: 'mode',
                  },
                  {
                    property: 'Audience',
                    value: event.audience,
                    imgsrc: 'audience',
                    imgalt: 'audience',
                  },
                ] satisfies EventDetails[]
              ).map(({ property, value, imgsrc, imgalt }) => (
                <div key={property} className="mt-2 flex items-center gap-2">
                  <img
                    src={`/icons/${imgsrc}.svg`}
                    alt={imgalt}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-semibold">{property}:</span>
                  <span className="text-sm text-gray-300">{value}</span>
                </div>
              ))}
            </div>
            <section className="mt-12">
              <h4 className="text-[22px] font-bold">Agenda</h4>
              <ul className="mt-2 list-inside list-disc p-0">
                {event.agenda.map((item, index) => (
                  <li
                    className="max-w-200 mt-2 text-sm text-gray-300"
                    key={`${index}-${item}`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section className="mt-12">
              <h4 className="text-[22px] font-bold">About the Organizer</h4>
              <p className="max-w-200 mt-2 text-sm text-gray-300">
                {event.organizer}
              </p>
            </section>
            <section className="flex gap-1.5 mt-4 flex-wrap">
              {event.tags.map((tag, index) => (
                <button className="pill" key={`${tag}-${index}`}>
                  {tag}
                </button>
              ))}
            </section>
            <section className="gap-1.5 mt-4">
              <h4 className="text-[22px] font-bold">Similar Events</h4>
              <ul className="event grid grid-cols-3 gap-3">
                {similarEvents.length > 0 &&
                  similarEvents.map((event) => (
                    <li key={event.slug} className="list-none mt-2">
                      <Link href={`/event/${event.slug}`}>
                        <img src={event.image} alt={event.title} />
                        <div className="flex items-center gap-2 mt-4">
                          <img
                            src="../icons/pin.svg"
                            alt="Location"
                            className="h-4 w-4"
                          />
                          <p className="font-thin text-sm">{event.location}</p>
                        </div>
                        <h4 className="mt-1 text-base font-semibold">
                          {event.title}
                        </h4>
                        <div className="mt-3 flex items-center gap-3 max-md:mb-5 mb-6">
                          <div className="flex items-center gap-2 border-r border-solid pr-[10px] m-0">
                            <img
                              src="../icons/calendar.svg"
                              alt="Date"
                              className="h-4 w-4"
                            />
                            <p className="text-xs font-thin">{event.date}</p>
                          </div>
                          <div className="flex items-center gap-2 pl-[10px] m-0">
                            <img
                              src="../icons/clock.svg"
                              alt="Time"
                              className="h-4 w-4"
                            />
                            <p className="text-xs font-thin">{event.time}</p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          </div>
          <aside className="booking">
            <div className="signup-card">
              <Booking />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<p>Loading event...</p>}>
      <EventContent params={params} />
    </Suspense>
  );
}
