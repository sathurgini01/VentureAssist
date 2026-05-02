/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  transform: {},
  testMatch: ["**/__tests__/**/*.test.js"],
  testTimeout: 30000,
  forceExit: true,
  clearMocks: true,
  verbose: true,
};
