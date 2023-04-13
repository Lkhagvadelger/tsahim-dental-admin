// theme/index.js
import {
  extendTheme,
  withDefaultColorScheme,
  ThemeConfig,
} from "@chakra-ui/react";

// Global style overrides
import { styles } from "./foundations/styles";
import { fonts } from "./foundations/fonts";
import { colors } from "./foundations/colors";

// Component style overrides
import Heading from "./overrides/heading";
import Button from "./overrides/button";
import Text from "./overrides/text";
import Input from "./overrides/input";
import Select from "./overrides/select";
import Td from "./overrides/td";

// Re-export Chakra components
export * from "@chakra-ui/react";

// Toaster
export { toaster } from "./helpers/toaster";

// Custom components
export { ProgressBar } from "./components/ProgressBar";
export { SEO } from "./components/SEO";
export { AppLayout } from "./components/AppLayout";
export { LandingLayout as NavMenuLayout } from "./components/LandingLayout";
export { NavContentLayout } from "./components/NavContentLayout";
export { Logo } from "./components/Logo";
export { LinkBox } from "./components/LinkBox";
export { Card } from "./components/Card";
export { CardLink } from "./components/CardLink";
export { CardButton } from "./components/CardButton";
export { TableContent } from "./components/TableContent";
export { TablePagination } from "./components/TablePagination";
export { Step } from "./components/stepper/Step";
export { StepContent } from "./components/stepper/StepContent";
export { Steps } from "./components/stepper/Steps";
export { useSteps } from "./components/stepper/useSteps";
export { RadioCard } from "./components/RadioCard";
export { CheckboxCard } from "./components/CheckboxCard";
export { validateFiles } from "./helpers/validatefiles";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const overrides = {
  config,
  styles,
  fonts,
  colors,
  // Other foundational style overrides go here
  components: {
    Heading,
    Button,
    Text,
    Input,
    Select,
    Td
    // Other components go here
  },
};

export const theme = extendTheme(
  overrides,
  withDefaultColorScheme({ colorScheme: "Blue" })
);
