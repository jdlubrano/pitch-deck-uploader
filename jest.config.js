const config = {
  moduleNameMapper: {
    "\\.worker.js": `${__dirname}/app/javascript/__mocks__/workerMock.js`
  },
  restoreMocks: true,
  roots: ["app"],
  setupFilesAfterEnv: ["./jest-setup.js"],
  testEnvironment: "jsdom"
};

module.exports = config;
