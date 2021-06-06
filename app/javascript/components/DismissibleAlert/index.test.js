import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";

import DismissibleAlert from '.';

describe("<DismissibleAlert />", () => {
  it("renders an alert with its children as content", () => {
    const alert = <DismissibleAlert status="success">Hooray!</DismissibleAlert>;
    const { getByRole } = render(alert);
    const element = getByRole("alert");

    expect(element).toBeInTheDocument();
    expect(element).toHaveClass("alert");
    expect(element).toHaveClass("alert-success");
  });

  it("can be dismissed", () => {
    const alert = <DismissibleAlert status="success">Hooray!</DismissibleAlert>;
    const { findByRole, getByTestId } = render(alert);
    const closeButton = getByTestId("test-close");
    fireEvent.click(closeButton)

    waitFor(() => expect(findByRole("alert")).not.toBeInTheDocument());
  });
});
