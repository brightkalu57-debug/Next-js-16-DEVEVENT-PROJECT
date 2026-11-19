import mongoose, { Model, Schema, Types } from 'mongoose';
import { Event } from './event.model';

export interface Booking {
  eventId: Types.ObjectId;
  slug: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<Booking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        message: 'Booking email must be a valid email address',
      },
    },
  },
  { timestamps: true }
);

bookingSchema.index({ eventId: 1, email: 1 }, { unique: true });

// Check the reference before saving so bookings cannot point to missing events.
bookingSchema.pre('validate', async function () {
  const eventExists = await Event.exists({ _id: this.eventId });
  if (!eventExists) {
    throw new Error(
      'Cannot create booking: the referenced event does not exist'
    );
  }
});

export const Booking: Model<Booking> =
  mongoose.models.Booking ?? mongoose.model<Booking>('Booking', bookingSchema);
