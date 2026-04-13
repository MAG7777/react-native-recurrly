// app.config.js replaces app.json to support dynamic environment variable injection.
// PostHog keys are read from .env at build time and exposed via expo-constants.
const appJson = require('./app.json')

module.exports = {
  ...appJson.expo,
  extra: {
    posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
    posthogHost: process.env.POSTHOG_HOST,
  },
}
