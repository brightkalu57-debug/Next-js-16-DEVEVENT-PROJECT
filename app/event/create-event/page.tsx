'use client';

import { useState, type FormEvent } from 'react';
import type { IEvent } from '@/database/event.model';

type EventField = {
  name: string;
  label: string;
  placeholder?: string;
  type: 'text' | 'date' | 'textarea' | 'file' | 'select';
  rows?: number;
};
const eventFields: EventField[] = [
  {
    name: 'title',
    label: 'Event Title',
    placeholder: 'Event title',
    type: 'text',
  },
  {
    name: 'description',
    label: 'Description',
    placeholder: 'Event description',
    type: 'textarea',
    rows: 5,
  },
  {
    name: 'image',
    label: 'Upload Image',
    type: 'file',
  },
  {
    name: 'organizer',
    label: "Organizer's Name",
    placeholder: "Organizer's name",
    type: 'text',
  },
  {
    name: 'overview',
    label: 'Event Overview',
    placeholder: 'Event overview',
    type: 'textarea',
    rows: 2,
  },
  {
    name: 'agenda',
    label: 'Agenda (separate each item with a new line)',
    placeholder: `Opening remarks
Keynote presentation
Networking...`,
    type: 'textarea',
    rows: 3,
  },
  {
    name: 'audience',
    label: 'Audience',
    placeholder: 'Who is this event for?',
    type: 'text',
  },
  {
    name: 'mode',
    type: 'select',
    label: 'Mode',
  },
  {
    name: 'venue',
    label: 'Venue',
    placeholder: 'Event venue',
    type: 'text',
  },
  {
    name: 'location',
    label: 'Location',
    placeholder: 'City and country',
    type: 'text',
  },
  {
    name: 'date',
    label: 'Date',
    placeholder: 'Event date',
    type: 'date',
  },
  {
    name: 'time',
    label: 'Time',
    placeholder: 'e.g. 10:00 - 17:00',
    type: 'text',
  },
  {
    name: 'tags',
    label: 'Tags(Seperate each tag by clicking enter)',
    placeholder: `React
AI
DevOps...`,
    type: 'textarea',
    rows: 3,
  },
];
const Page = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    const form = event.currentTarget;
    const body = new FormData(form);

    try {
      const response = await fetch('/api/event', {
        method: 'POST',
        body,
      });
      const result: { message?: string; event?: IEvent } =
        await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? 'Failed to create event');
      }

      setSuccessMessage(result.message ?? 'Event created successfully');
      form.reset();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to create event'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <section>
        <h1 className="text-center">Create a New Event</h1>
        <p className="text-center mt-2">
          Fill the form below to add a new event
        </p>
      </section>
      <section>
        <form
          className="flex w-full flex-col items-center mt-15"
          onSubmit={handleSubmit}
        >
          {eventFields.map((field) => (
            <div className="mt-6 w-120 max-md:w-full" key={field.name}>
              <label htmlFor={field.name} className="block">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  className="bg-white/3 rounded-[12px] px-5 py-2 border-white/20 border-[1px] w-full mt-2 min-h-24 max-md:min-h-20 resize-none"
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  rows={field.rows}
                  required
                />
              ) : field.type !== 'file' && field.type !== 'select' ? (
                <input
                  className="bg-white/3 rounded-[12px] px-5 py-1.5 border-white/20 border-[1px] w-full h-11 max-md:h-10 mt-2"
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  type={field.type}
                  required
                />
              ) : field.type === 'file' ? (
                <input
                  className="bg-white/3 rounded-[12px] px-5 py-2 border-white/20 
                border-[1px] w-full h-11 max-md:h-10 mt-2 file:bg-primary/10 file:text-primary
                file:mr-5 file:py-1.5 file:px-3 file:rounded-[10px]"
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  accept="image/*"
                  required
                />
              ) : (
                <select
                  className="bg-white/3 rounded-[12px] px-5 py-1.5 border-white/20 border-[1px] w-full h-11 max-md:h-10 mt-2"
                  id={field.name}
                  name={field.name}
                  required
                >
                  <option value="Online" className="bg-black text-primary">
                    Online
                  </option>
                  <option value="Offline" className="bg-black text-primary">
                    Offline
                  </option>
                  <option value="Hybrid" className="bg-black text-primary">
                    Hybrid
                  </option>
                </select>
              )}
            </div>
          ))}
          {errorMessage && (
            <p role="alert" className="mt-4 text-red-400">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p role="status" className="mt-4 text-green-400">
              {successMessage}
            </p>
          )}
          <div className="mt-6 w-120 max-md:w-full">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary/20 text-primary font-bold w-full py-2
             rounded-[10px] border border-primary/30 hover:shadow-[0px_0px_20px_0px_color-mix(in_srgb,var(--primary)_60%,transparent)] hover:bg-primary/40"
            >
              {isSubmitting ? 'Creating Event...' : 'Create Event'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Page;
