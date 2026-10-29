import Link from 'next/link';

const Header = () => {
  return (
    <header
      className="flex items-center justify-between px-10 py-4 
    bg-white/3 text-white border-b border-black "
    >
      <Link href="/" className="flex items-center gap-2">
        <img className="w-6 h-6" src="/favicon.ico" alt="Logo" />
        <p className="hidden md:block font-bold text-xl italic ">DevEvent</p>
      </Link>
      <ul className="flex items-center gap-6">
        <Link href="/">Home</Link>
        <Link href="/event">Events</Link>
        <Link href="/event/create-event">Create Event</Link>
      </ul>
    </header>
  );
};

export default Header;
