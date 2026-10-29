'use client';

import { useState } from 'react';
import bookingEvents from '@/lib/booking.action';

type BookingProps = {
  eventId: string;
  slug: string;
  initialBookingCount: number;
};

const Booking = ({
  eventId,
  slug,
  initialBookingCount,
}: BookingProps) => {
  const [email, setEmail] = useState('');
  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState('');
  const [numberOfBookedSpaces, setNumberOfBookedSpaces] =
    useState(initialBookingCount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let result;
    try {
      result = await bookingEvents({
        email,
        eventId,
        slug,
      });
    } catch {
      setError('Booking failed. Please try again.');
      return;
    }

    if (result.success) {
      setNumberOfBookedSpaces((count) => count + 1);
      setSubmit(true);
    } else {
      setError(result.error);
    }
  };
  return (
    <section id="book-event">
      <form onSubmit={handleSubmit}>
        <p>Book Your Spot</p>
        {numberOfBookedSpaces > 0 ? (
          <p>
            Join {numberOfBookedSpaces} people who have already booked their
            spots!
          </p>
        ) : (
          <p>Be the first to book a spot</p>
        )}
        {submit === true ? (
          <p>Thank you for signing up!</p>
        ) : (
          <div>
            <p>Email Address</p>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Enter your email address "
            />
            {error && (
              <p role="alert" className="text-red-400">
                {error}
              </p>
            )}
            <button className="submit-button mt-3" type="submit">
              Submit
            </button>
          </div>
        )}
      </form>
    </section>
  );
};

export default Booking;
