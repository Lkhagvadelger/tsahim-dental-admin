module.exports = {
  locales: ["en"],
  defaultLocale: "en",
  pages: {
    "*": [ "auth"],
     "/": ["auth"],
     "rgx:^/auth": ["auth"],
  },
  interpolation: {
    prefix: "${",
    suffix: "}",
  },
  loadLocaleFrom: (locale, namespace) =>
    import(`./locales/${locale}/${namespace}`).then((m) => m.default),
};
