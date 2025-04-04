import { useState, useEffect, Fragment, memo, useCallback } from "react";
import axios from "axios";

// components
import SectionSlider from "../slider/SectionSlider";
import CardStyle from "../cards/CardStyle";

// the hook
import { useTranslation } from "react-i18next";

const PopularMovies = memo((props) => {
  const { t } = useTranslation();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/movies`);
        setMovies(response.data.data);

        setIsLoading(false);
      } catch (error) {
        console.error("There was an error fetching the movies!", error);
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);
  const renderCardStyle = useCallback(
    (data) => (
      <CardStyle
        key={data._id}
        image={data.vertical_poster}
        title={t(data.title)}
        movieTime={data.duration}
        watchlistLink="/playlist"
        link={`/movies-detail/${data._id}`}
      />
    ),
    [t]
  );

  return (
    <Fragment>
      <div
        className={`popular-movies-container ${
          isLoading ? "loading" : "loaded"
        }`}
      >
        <SectionSlider
          title={t("ott_home.popular_movies")}
          list={movies}
          className="popular-movies-block leikapui-block"
          viewAll="/movies"
          paddingY={props.paddingY}
        >
          {renderCardStyle}
        </SectionSlider>
      </div>
    </Fragment>
  );
});

PopularMovies.displayName = "PopularMovies";
export default PopularMovies;
