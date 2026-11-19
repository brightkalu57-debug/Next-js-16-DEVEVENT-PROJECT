import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Event } from '@/database/event.model';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    await connectToDatabase();

    const normalizedSlug = slug.trim().toLowerCase();

    const requestedEvent = await Event.findOne({ slug: normalizedSlug });

    if (!requestedEvent) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event: requestedEvent }, { status: 200 });
  } catch (error) {
    console.error('Error fetching event', error);
    return NextResponse.json(
      { message: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}
