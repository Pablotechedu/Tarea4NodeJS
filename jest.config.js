export default {
  testEnvironment: "node",
  testMatch: ["**/tests/unit/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.js"],
  globalTeardown: "<rootDir>/src/tests/teardown.js",
  testTimeout: 10000,
  forceExit: true,
};
