import { AuthProvider } from "@lib/auth/ui";
import { ChakraProvider, ProgressBar, theme } from "@ui/index";
import { queryClient } from "@util/query";
import type { NextPage } from "next";
import type { AppProps, NextWebVitalsMetric } from "next/app";
import Router from "next/router";
import { QueryClientProvider } from "react-query";

import "@fontsource/inter";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/900.css";

const progress = new ProgressBar();

type Page<P = Record<string, unknown>> = NextPage<P>;

type Props = AppProps & {
  Component: Page;
};

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeError", progress.finish);
Router.events.on("routeChangeComplete", () => {
  progress.finish();
});

export const reportWebVitals = ({
  id,
  name,
  label,
  value,
}: NextWebVitalsMetric) => {};

const MyApp = ({ Component, pageProps }: Props) => {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default MyApp;
