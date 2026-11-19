'use server';
import { Booking } from '@/database';
import { connectToDatabase } from './mongodb';

type BookingResult =
  | { success: true }
  | { success: false; error: string };

const bookingEvents = async ({
  slug,
  eventId,
  email,
}: {
  eventId: string;
  email: string;
  slug: string;
}): Promise<BookingResult> => {
  try {
    await connectToDatabase();

    await Booking.create({ eventId, email, slug });
    return { success: true };
  } catch (e) {
    if (
      typeof e === 'object' &&
      e !== null &&
      'code' in e &&
      e.code === 11000
    ) {
      return {
        success: false,
        error: 'This email has already booked this event.',
      };
    }

    console.error('create booking failed', e);
    return {
      success: false,
      error: 'Unable to create booking. Please try again.',
    };
  }
};

export default bookingEvents;
