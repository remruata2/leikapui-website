import { useState, useEffect, Fragment, memo, useCallback } from "react";
import axios from "axios";

// components
import SectionSlider from "../slider/SectionSlider";
import CardStyle from "../cards/CardStyle";

// the hook
import { useTranslation } from "react-i18next";

const TvShowsSlider = memo((props) => {
  const { t } = useTranslation();
  const [tvShows, setTvShows] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTvShows = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/tvShows`);
        setTvShows(response.data);
      } catch (error) {
        console.error("There was an error fetching the TvShows!", error);
      }
    };

    fetchTvShows();
  }, []);

  const renderCardStyle = useCallback(
    (data) => (
      <CardStyle
        key={data._id}
        image={data.vertical_poster}
        title={t(data.show_name)}
        movieTime={data.duration}
        watchlistLink="/playlist"
        link={`/shows-details/${data._id}`}
      />
    ),
    [t]
  );

  return (
    <Fragment>
      <SectionSlider
        title={t("Series")}
        list={tvShows}
        className="popular-tvShows-block streamit-block"
        viewAll="/tv-shows"
        paddingY={props.paddingY}
      >
        {renderCardStyle}
      </SectionSlider>
    </Fragment>
  );
});

TvShowsSlider.displayName = "TvShowsSlider";
export default TvShowsSlider;
