import { useState, Fragment, memo } from "react";

//components
import SectionSlider from "../slider/SectionSlider";
import CardStyle from "../cards/CardStyle";

//static data
import { latestMovie } from "../../StaticData/data";

// the hook
import { useTranslation } from "react-i18next";

const BestOfInternationalShows = memo((props) => {
  const { t } = useTranslation();

  return (
    <Fragment>
      <SectionSlider
        title={t("ott_home.best_international")}
        list={latestMovie}
        className="recommended-block section-top-spacing leikapui-block"
        slideMedium={props.slideMedium}
        paddingY={props.paddingY}
        // loop={true}
      >
        {(data) => (
          <CardStyle
            image={data.image}
            title={t(data.title)}
            movieTime={t(data.movieTime)}
            watchlistLink="/playlist"
            link="/movies-detail"
          />
        )}
      </SectionSlider>
    </Fragment>
  );
});

BestOfInternationalShows.displayName = "BestOfInternationalShows";
export default BestOfInternationalShows;
