import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createMemoryHistory } from "history";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import ShowPitchDeck from ".";
import * as Api from "../../utils/Api";

describe("<ShowPitchDeck />", () => {
  const pitchDeckId = 1234;

  function renderComponent() {
    const history = createMemoryHistory();
    history.push(`/pitch_decks/${pitchDeckId}`);

    return render(
      <Router history={history}>
        <Switch>
          <Route path="/pitch_decks/:id">
            <ShowPitchDeck />
          </Route>
        </Switch>
      </Router>
    );
  }

  function mockApiLoading() {
    let timeout;

    const apiPromise = new Promise(resolve => {
      timeout = setTimeout(() => resolve({}), Number.POSITIVE_INFINITY)
    });

    Api.getPitchDeck = jest.fn();
    Api.getPitchDeck.mockReturnValue(apiPromise);

    return timeout;
  }

  function mockApiError() {
    Api.getPitchDeck = jest.fn();
    Api.getPitchDeck.mockResolvedValue({ok: false});
  }

  function mockApiSuccess(pitchDeck) {
    Api.getPitchDeck = jest.fn();
    Api.getPitchDeck.mockResolvedValue({ok: true, pitchDeck});
  }

  it("starts in the loading state", async () => {
    const timeout = mockApiLoading();

    const { getByText } = renderComponent();

    expect(getByText("Loading pitch deck...")).toBeVisible();

    clearTimeout(timeout);
  });

  it("calls Api.getPitchDeck", () => {
    const timeout = mockApiLoading();

    const { getByText } = renderComponent();

    expect(Api.getPitchDeck).toHaveBeenCalledWith(pitchDeckId.toString());

    clearTimeout(timeout);
  });

  it("renders an error when getPitchDeck fails", async () => {
    mockApiError();

    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(getByText("Failed to load pitch deck.")).toBeVisible();
    });
  });

  it("allows the user to retry loading the pitch deck after a failure", async () => {
    let firstAttempt = true;

    Api.getPitchDeck = jest.fn(() => {
      if (firstAttempt) {
        firstAttempt = false;
        return Promise.resolve({ok: false});
      }

      const pitchDeck = {
        id: pitchDeckId,
        name: "Test name",
        created_at: "2021-06-06T14:22:11Z",
        updated_at: "2021-06-06T14:22:11Z",
        file: {
          download_url: "http://test.localhost"
        }
      };

      return Promise.resolve({ok: true, pitchDeck});
    });

    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(getByText("Failed to load pitch deck.")).toBeVisible();
    });

    fireEvent.click(getByText("Retry"));

    await waitFor(() => {
      expect(getByText("Download")).toBeVisible();
    });
  });

  it("renders a link to download the pitch deck", async () => {
    const pitchDeck = {
      id: pitchDeckId,
      name: "Test name",
      created_at: "2021-06-06T14:22:11Z",
      updated_at: "2021-06-06T14:22:11Z",
      file: {
        download_url: "http://test.localhost"
      }
    };

    mockApiSuccess(pitchDeck);

    const { getByText } = renderComponent();

    await waitFor(() => {
      const downloadLink = getByText("Download");
      expect(downloadLink).toBeVisible();
      expect(downloadLink).toHaveAttribute("href", "http://test.localhost");
    });
  });

  it("renders a message when the pitch deck preview is not yet available", async () => {
    const pitchDeck = {
      id: pitchDeckId,
      name: "Test name",
      created_at: "2021-06-06T14:22:11Z",
      updated_at: "2021-06-06T14:22:11Z",
      file: {
        download_url: "http://test.localhost"
      }
    };

    mockApiSuccess(pitchDeck);

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(getByTestId("test-processing-info")).toBeVisible();
    });
  });

  it("renders an error when the pitch deck preview failed", async () => {
    const pitchDeck = {
      id: pitchDeckId,
      name: "Test name",
      created_at: "2021-06-06T14:22:11Z",
      updated_at: "2021-06-06T14:22:11Z",
      file: {
        download_url: "http://test.localhost"
      },
      pitch_deck_preview: {
        status: "failed"
      }
    };

    mockApiSuccess(pitchDeck);

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(getByTestId("test-preview-failed")).toBeVisible();
    });
  });

  it("renders the pitch deck preview slides when the preview is complete", async () => {
    const pitchDeck = {
      id: pitchDeckId,
      name: "Test name",
      created_at: "2021-06-06T14:22:11Z",
      updated_at: "2021-06-06T14:22:11Z",
      file: {
        download_url: "http://test.localhost"
      },
      pitch_deck_preview: {
        status: "complete",
        slides: [
          {image_url: "http://test.localhost/slide.png"}
        ]
      }
    };

    mockApiSuccess(pitchDeck);

    const { getByAltText } = renderComponent();

    await waitFor(() => {
      const img = getByAltText("slide 0");
      expect(img).toBeVisible();
      expect(img).toHaveAttribute("src", "http://test.localhost/slide.png");
    });
  });
});
