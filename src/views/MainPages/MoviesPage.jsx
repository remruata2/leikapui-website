import { Fragment, memo } from "react";

// section
import AllMovies from "../../components/sections/AllMovies";

const MoviesPage = memo(() => {
  return (
    <Fragment>
      <AllMovies />
    </Fragment>
  );
});

MoviesPage.displayName = "MoviesPage";
export default MoviesPage;
