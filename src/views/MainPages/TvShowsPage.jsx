import { Fragment } from "react";

//hero-slider
import TvShowHeroSlider from "../../components/slider/TvShowHeroSlider";

//sections
import TVPopularShows from "../../components/sections/TVPopularShows";
import BestOfInternationalShows from "../../components/sections/BestOfInternationalShows";
import ShowsWeRecommend from "../../components/sections/ShowsWeRecommend";
import AllTvShows from "../../components/sections/AllTvShows";

const TvShowsPage = () => {
  return (
    <Fragment>
      <AllTvShows />
    </Fragment>
  );
};

TvShowsPage.DisplayName = TvShowsPage;
export default TvShowsPage;
