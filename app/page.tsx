import ExploreBtn from './components/ExploreBtn';
import FeaturedEvents from './components/FeaturedEvents';

const page = () => {
  return (
    <section>
      <h1 className="text-center mb-5">
        The Hub for Every Dev <br />
        Event You Can't Miss
      </h1>
      <p className="text-center">
        Hackathons, Meetups, and Conferneces, All in ONe Place
      </p>
      <ExploreBtn />
      <FeaturedEvents title="Featured Events" limit={3} />
    </section>
  );
};

export default page;
