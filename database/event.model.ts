import mongoose, { Model, Schema } from 'mongoose';

export interface IEvent {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export function normalizeArray(value: unknown): string[] {
  const entries =
    typeof value === 'string'
      ? [value]
      : Array.isArray(value)
        ? value.filter((item): item is string => typeof item === 'string')
        : [];

  return entries
    .flatMap((item) => item.split(/\r?\n/))
    .map((item) => item.trim())
    .filter(Boolean);
}

function createSlug(title: string): string {
  // Convert titles into URL-safe slugs for stable event links.
  return title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeDate(value: string): string {
  const input = value.trim();
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
  let date: Date;

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

    if (
      date.getUTCFullYear() !== Number(year) ||
      date.getUTCMonth() !== Number(month) - 1 ||
      date.getUTCDate() !== Number(day)
    ) {
      throw new Error('Event date must be a valid date');
    }
  } else {
    date = new Date(input);
    if (Number.isNaN(date.getTime())) {
      throw new Error('Event date must be a valid date');
    }
  }

  // Store event dates as timezone-independent ISO calendar dates.
  return date.toISOString().slice(0, 10);
}

function normalizeTime(value: string): string {
  const input = value.trim();
  const parts = input.split(/\s*(?:-|–|—|\bto\b)\s*/i);

  if (parts.length < 1 || parts.length > 2 || parts.some((part) => !part)) {
    throw new Error('Event time must be a time or a time range');
  }

  const normalizedParts = parts.map((part) => {
    const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i.exec(part);

    if (!match) {
      throw new Error('Event time must use a valid 12-hour or 24-hour format');
    }

    let hour = Number(match[1]);
    const minute = Number(match[2]);
    const second = Number(match[3] ?? 0);
    const meridiem = match[4]?.toUpperCase();

    if (
      minute > 59 ||
      second > 59 ||
      (meridiem && (hour < 1 || hour > 12)) ||
      (!meridiem && hour > 23)
    ) {
      throw new Error('Event time must be a valid time');
    }

    if (meridiem) {
      hour = (hour % 12) + (meridiem === 'PM' ? 12 : 0);
    }

    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  });

  // Normalize times and ranges to 24-hour HH:mm notation.
  return normalizedParts.join(' - ');
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: {
      type: [{ type: String, trim: true }],
      set: normalizeArray,
      required: true,
      validate: {
        validator: (items: string[]) =>
          items.length > 0 && items.every((item) => item.length > 0),
        message: 'Agenda must contain at least one non-empty item',
      },
    },
    organizer: { type: String, required: true, trim: true },
    tags: {
      type: [{ type: String, trim: true }],
      set: normalizeArray,
      required: true,
      validate: {
        validator: (items: string[]) =>
          items.length > 0 && items.every((item) => item.length > 0),
        message: 'Tags must contain at least one non-empty item',
      },
    },
  },
  { timestamps: true }
);

eventSchema.pre('validate', function () {
  if (this.isModified('title')) {
    this.slug = createSlug(this.title);
  }
});

// A save hook keeps the slug in sync with title edits and normalizes event schedule values.
eventSchema.pre('save', function () {
  if (this.isModified('title')) {
    const slug = createSlug(this.title);
    if (!slug) {
      throw new Error(
        'Event title must contain characters that can form a slug'
      );
    }
    this.slug = slug;
  }

  this.date = normalizeDate(this.date);
  this.time = normalizeTime(this.time);
});

eventSchema.index({ slug: 1 }, { unique: true });

export const Event: Model<IEvent> =
  mongoose.models.Event ?? mongoose.model<IEvent>('Event', eventSchema);
