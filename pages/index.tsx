import { HeroSection } from "@lib/landingpage/ui/herosection";
import {
  Box, NavMenuLayout,
  SEO
} from "@ui/index";
import useTranslation from "next-translate/useTranslation";

const LandingPage = () => {
  const { t } = useTranslation("app");
  return (
    <Box w="full">
      <SEO title={t("landing-title")} />
      <NavMenuLayout>
        <HeroSection />
      </NavMenuLayout>
    </Box>
  );
};

export default LandingPage;
