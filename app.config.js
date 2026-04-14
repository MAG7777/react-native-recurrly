// app.config.js replaces app.json to support dynamic environment variable injection.
// PostHog keys are read from .env at build time and exposed via expo-constants.
const appJson = require('./app.json')

module.exports = ({ config }) => ({
  ...appJson.expo,
  ...config,
  extra: {
    ...(appJson.expo.extra ?? {}),
    ...(config?.extra ?? {}),
    posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
    posthogHost: process.env.POSTHOG_HOST,
  },
  android: {
    ...appJson.expo.android,
    ...config.android,
    package: "com.mag.recurrly"
  },
  ios: {
    ...appJson.expo.ios,
    ...config.ios,
    bundleIdentifier: "com.mag.recurrly"
  },
  plugins: [
    ...(config.plugins ?? []),
    [
      "expo-build-properties",
      {
        "android": {
          "packagingOptions": {
            "pickFirst": [
              "META-INF/versions/9/OSGI-INF/MANIFEST.MF"
            ]
          }
        }
      }
    ]
  ]
})
