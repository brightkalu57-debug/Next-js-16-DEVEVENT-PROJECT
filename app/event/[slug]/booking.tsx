'use client';

import { useState } from 'react';

const Booking = () => {
  const [email, setEmail] = useState('');

  const [submit, setSubmit] = useState(false);

  const numberOfBookedSpaces = 20;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setSubmit(true);
    }, 1000);
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
