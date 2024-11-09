import { memo, Fragment } from "react";
// hero slider
import OttHeroSlider from "../../components/slider/OttHeroSlider";

// sections
import PopularMovies from "../../components/sections/PopularMovies";
import TvShowsSlider from "../../components/sections/TvShowsSlider";

//static data
import { ottVerticleLatestMovies } from "../../StaticData/data";

console.log("Test OttPage renders");
const HomePage = memo(() => {
  return (
    <Fragment>
      <OttHeroSlider />
      <PopularMovies paddingY="my-4" />
      <TvShowsSlider />
    </Fragment>
  );
});

HomePage.displayName = "HomePage";
export default HomePage;
