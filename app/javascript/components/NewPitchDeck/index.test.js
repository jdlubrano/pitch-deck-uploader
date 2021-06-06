import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter as Router } from "react-router-dom";

import NewPitchDeck from ".";

describe("<NewPitchDeck />", () => {
  it("renders a blank PitchDeckForm", () => {
    const component = <NewPitchDeck />;
    const { getByTestId } = render(component, { wrapper: Router });

    expect(getByTestId("test-pitch-deck-form")).toBeInTheDocument();
  });
});
