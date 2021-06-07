import React from "react";
import { fireEvent, render } from "@testing-library/react";

import RetriableError from ".";

describe("<RetriableError />", () => {
  it("renders an alert", () => {
    const error = "Something went wrong";
    const onRetry = jest.fn();
    const { getByRole, getByText } = render(<RetriableError error={error} onRetry={onRetry} />);

    expect(getByRole("alert")).toHaveClass("alert-danger");
    expect(getByText(error)).toBeVisible();
  });

  it("calls the onRetry handler when the retry link is clicked", () => {
    const error = "Something went wrong";
    const onRetry = jest.fn();
    const { getByText } = render(<RetriableError error={error} onRetry={onRetry} />);

    fireEvent.click(getByText("Retry"));

    expect(onRetry).toHaveBeenCalled();
  });
});
