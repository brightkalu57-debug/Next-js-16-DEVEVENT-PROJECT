const Header = () => {
  return (
    <header
      className="flex items-center justify-between px-10 py-4 
    bg-white/3 text-white border-b border-black "
    >
      <a href="/" className="flex items-center gap-2">
        <img className="w-6 h-6" src="./favicon.ico" alt="Logo" />
        <p className="hidden md:block font-bold text-xl italic ">DevEvent</p>
      </a>
      <ul className="flex items-center gap-6">
        <a href="/about">Home</a>
        <a href="/events">Events</a>
        <a href="/create-event">Create Event</a>
      </ul>
    </header>
  );
};

export default Header;
