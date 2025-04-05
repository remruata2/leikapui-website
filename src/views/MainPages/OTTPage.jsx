import { memo, Fragment, useEffect } from "react";
// hero slider
import OttHeroSlider from "../../components/slider/OttHeroSlider";

// sections
import PopularMovies from "../../components/sections/PopularMovies";
// import TvShowsSlider from "../../components/sections/TvShowsSlider";

//static data
// import { ottVerticleLatestMovies } from "../../StaticData/data";

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

console.log("Test OTTPage renders");
console.log("Device type:", isMobile ? "Mobile" : "Desktop");
console.log("API URL:", import.meta.env.VITE_API_URL);

const HomePage = memo(() => {
  useEffect(() => {
    // Log when component mounts
    console.log("OTTPage mounted");
    console.log("Environment variables:", {
      apiUrl: import.meta.env.VITE_API_URL,
      clientUrl: import.meta.env.VITE_CLIENT_URL,
    });
  }, []);

  return (
    <Fragment>
      <>
        <OttHeroSlider />
        <PopularMovies paddingY="my-4" />
      </>
      {/* <TvShowsSlider /> */}
    </Fragment>
  );
});

HomePage.displayName = "HomePage";
export default HomePage;
