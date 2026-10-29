import Link from 'next/link';

const ExploreBtn = () => {
  return (
    <div id="explore-btn" className="mt-7 mx-auto">
      <Link href="/event">
        Explore Events
        <img src="/icons/arrow-down.svg" alt="" />
      </Link>
    </div>
  );
};

export default ExploreBtn;
