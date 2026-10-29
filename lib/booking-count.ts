import { connection } from 'next/server';

import { Booking } from '@/database';
import { connectToDatabase } from '@/lib/mongodb';

export async function getBookingCount(eventId: string): Promise<number> {
  await connection();
  await connectToDatabase();
  return Booking.countDocuments({ eventId });
}
