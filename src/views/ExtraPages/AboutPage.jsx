import { Fragment, memo } from "react";

//components
import TeamSection from "./AboutSections/TeamSection";
import ContactUs from "./AboutSections/ContactUs";
import WorkSection from "./AboutSections/WorkSection";

// the hook
import { useTranslation } from "react-i18next";

const AboutPage = memo(() => {
  const { t } = useTranslation();
  return (
    <Fragment>
      <TeamSection></TeamSection>
      <ContactUs></ContactUs>
      <WorkSection></WorkSection>
    </Fragment>
  );
});

AboutPage.displayName = "AboutPage";
export default AboutPage;
