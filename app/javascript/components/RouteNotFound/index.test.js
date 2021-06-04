import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";

import RouteNotFound from '.';

describe("<RouteNotFound />" , () => {
  function renderRouteNotFound() {
    return render(
      <Router>
        <RouteNotFound />
      </Router>
    );
  }

  test("renders a link back to the homepage", () => {
    const { getByText } = renderRouteNotFound();
    const homeLink = getByText("homepage");

    expect(homeLink).toBeDefined();
    expect(homeLink).toHaveAttribute("href", "/");
  });
});
