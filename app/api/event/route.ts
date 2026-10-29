import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

import { connectToDatabase } from '@/lib/mongodb';
import { Event } from '@/database/event.model';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    let eventData: Record<string, FormDataEntryValue | string[]>;

    try {
      eventData = Object.fromEntries(formData.entries());
    } catch (e) {
      return NextResponse.json(
        { message: 'Invalid event data format' },
        { status: 400 }
      );
    }

    const fileEntry = formData.get('image');
    if (!(fileEntry instanceof File) || fileEntry.size === 0) {
      return NextResponse.json(
        { message: 'A valid image file is required' },
        { status: 400 }
      );
    }

    const maxImageSize = 5 * 1024 * 1024;
    if (fileEntry.size > maxImageSize) {
      return NextResponse.json(
        { message: 'Image must be 5 MB or smaller' },
        { status: 400 }
      );
    }

    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedImageTypes.includes(fileEntry.type)) {
      return NextResponse.json(
        { message: 'Image must be JPEG, PNG, or WebP' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const arrayBuffer = await fileEntry.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: 'image', folder: 'DevEvents' },
          (error, results) => {
            if (error) return reject(error);

            resolve(results);
          }
        )
        .end(buffer);
    });

    eventData.image = (uploadResult as { secure_url: string }).secure_url;

    const createdEvent = await Event.create(eventData);
    return NextResponse.json(
      {
        message: 'Event created successfully',
        event: createdEvent,
      },
      { status: 201 }
    );
  } catch (e) {
    console.error('Error creating event', e);
    return NextResponse.json(
      {
        message: 'Event creation failed',
        error: e instanceof Error ? e.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    await connectToDatabase();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json({ events }, { status: 200 });
  } catch (e) {
    console.error('Error fetching events', e);
    return NextResponse.json(
      {
        message: 'Failed to fetch events',
        error: e instanceof Error ? e.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
