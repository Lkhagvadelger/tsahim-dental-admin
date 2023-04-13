module.exports = {
  locales: ["en"],
  defaultLocale: "en",
  pages: {
    "*": ["app"],
    "/": ["app"],
    "rgx:^/app": ["app"],
  },
  interpolation: {
    prefix: "${",
    suffix: "}",
  },
  loadLocaleFrom: (locale, namespace) =>
    import(`./locales/${locale}/${namespace}`).then((m) => m.default),
};
