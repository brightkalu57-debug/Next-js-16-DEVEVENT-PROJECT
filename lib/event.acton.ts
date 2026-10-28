import { cacheLife, cacheTag } from 'next/cache';

import { connectToDatabase } from './mongodb';
import { Event } from '@/database/event.model';

export const getSimilarEventsBySlug = async (slug: string) => {
  'use cache';

  cacheLife({ stale: 60, revalidate: 60, expire: 300 });
  cacheTag(`similar-events-${slug}`);

  await connectToDatabase();
  const event = await Event.findOne({ slug }).select('tags').lean();
  if (!event) return [];

  const similarEvents = await Event.find({
    _id: { $ne: event._id },
    tags: { $in: event.tags },
  })
    .select('-_id')
    .lean();

  return similarEvents;
};
