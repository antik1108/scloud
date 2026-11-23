// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  { ignores: ["dist/*", "ios/*", "android/*", ".expo/*"] },
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@react-native-firebase/*"],
              message: "Import Firebase only inside src/services/firebase (see CLAUDE.md).",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/services/firebase/**"],
    rules: { "no-restricted-imports": "off" },
  },
]);
