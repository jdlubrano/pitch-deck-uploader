import { formatDateTime } from ".";

describe("formatDateTime", () => {
  it("formats an ISO date string", () => {
    expect(formatDateTime("2021-06-06T14:22:11Z")).toMatch(/June 6, 2021/);
  });
});
