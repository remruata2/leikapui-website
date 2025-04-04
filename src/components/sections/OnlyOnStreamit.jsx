import React, { memo, Fragment, useState } from "react";

//component
import SectionSlider from "../slider/SectionSlider";
import CardStyle from "../../components/cards/CardStyle";
import VerticalSlider from "../slider/VerticalSlider";

//static data
import { sectionSliders } from "../../StaticData/sliders";

// the hook
import { useTranslation } from "react-i18next";

const OnlyOnLeikapui = memo(() => {
  const { t } = useTranslation();
  const [onlyOnLeikapui] = useState(sectionSliders);

  return (
    <VerticalSlider
      title={t("ott_home.only_on_streamit")}
      list={onlyOnLeikapui}
      className="leikapui-block"
    />
  );
});

OnlyOnLeikapui.displayName = "OnlyOnLeikapui";
export default OnlyOnLeikapui;
