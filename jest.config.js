const config = {
  restoreMocks: true,
  roots: ["app"],
  setupFilesAfterEnv: ["./jest-setup.js"],
  testEnvironment: "jsdom"
};

module.exports = config;
