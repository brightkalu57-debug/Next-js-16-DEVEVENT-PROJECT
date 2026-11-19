import mongoose from 'mongoose';
import { Booking } from '@/database/booking.model';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: 'Request body must be valid JSON' },
      { status: 400 }
    );
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('eventId' in body) ||
    !('email' in body) ||
    typeof body.eventId !== 'string' ||
    typeof body.email !== 'string'
  ) {
    return Response.json(
      { error: 'eventId and email are required' },
      { status: 400 }
    );
  }

  if (!/^[a-f\d]{24}$/i.test(body.eventId)) {
    return Response.json(
      { error: 'eventId must be a valid ID' },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const booking = await Booking.create({
      eventId: new mongoose.Types.ObjectId(body.eventId),
      email: body.email,
    });

    return Response.json(
      {
        id: booking.id,
        eventId: booking.eventId.toString(),
        email: booking.email,
        createdAt: booking.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof mongoose.Error.ValidationError ||
      (error instanceof Error &&
        error.message ===
          'Cannot create booking: the referenced event does not exist')
    ) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    ) {
      return Response.json(
        { error: 'A booking already exists for this event and email' },
        { status: 409 }
      );
    }

    console.error('Failed to create booking:', error);
    return Response.json(
      { error: 'Unable to create booking' },
      { status: 500 }
    );
  }
}
