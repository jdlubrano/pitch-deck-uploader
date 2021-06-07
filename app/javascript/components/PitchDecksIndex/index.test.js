import React from "react";
import { MemoryRouter as Router } from "react-router-dom";
import { act, fireEvent, render, waitFor } from "@testing-library/react";

import PitchDecksIndex from ".";
import * as Api from "../../utils/Api";

describe("<PitchDecksIndex />", () => {
  function renderComponent() {
    return render(<PitchDecksIndex />, { wrapper: Router });
  }

  function mockApiLoading() {
    let timeout;

    const apiPromise = new Promise(resolve => {
      timeout = setTimeout(() => resolve({}), Number.POSITIVE_INFINITY)
    });

    Api.getPitchDecks = jest.fn();
    Api.getPitchDecks.mockReturnValue(apiPromise);

    return timeout;
  }

  function mockApiError() {
    Api.getPitchDecks = jest.fn();
    Api.getPitchDecks.mockResolvedValue({ok: false});
  }

  function mockApiSuccess(pitchDecks) {
    Api.getPitchDecks = jest.fn();
    Api.getPitchDecks.mockResolvedValue({ok: true, pitchDecks});
  }

  it("starts in the loading state", () => {
    const timeout = mockApiLoading();

    const { getByText } = renderComponent();

    expect(getByText("Loading pitch decks...")).toBeVisible();

    clearTimeout(timeout);
  });

  it("calls Api.getPitchDecks", () => {
    const timeout = mockApiLoading();

    const { getByText } = renderComponent();

    expect(Api.getPitchDecks).toHaveBeenCalled();

    clearTimeout(timeout);
  });

  it("renders an error when getPitchDeck fails", async () => {
    mockApiError();

    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(getByText("Failed to load pitch decks.")).toBeVisible();
    });
  });

  it("allows the user to retry loading the pitch deck after a failure", async () => {
    let firstAttempt = true;

    Api.getPitchDecks = jest.fn(() => {
      if (firstAttempt) {
        firstAttempt = false;
        return Promise.resolve({ok: false});
      }

      const pitchDecks = [
        {
          id: 1,
          name: "Test pitch deck",
          created_at: "2021-06-06T14:22:11Z",
          updated_at: "2021-06-06T14:22:11Z"
        }
      ];

      return Promise.resolve({ok: true, pitchDecks});
    });

    const { getByText, getByTestId } = renderComponent();

    await waitFor(() => {
      expect(getByText("Failed to load pitch decks.")).toBeVisible();
    });

    fireEvent.click(getByText("Retry"));

    await waitFor(() => {
      expect(getByTestId("test-pitch-decks-table")).toBeVisible();
    });
  });

  it("renders a link to upload a new pitch deck", async () => {
    mockApiSuccess([]);

    const { getByText } = renderComponent();

    await waitFor(() => {
      const newLink = getByText("Upload a new pitch deck");
      expect(newLink).toBeVisible();
      expect(newLink).toHaveAttribute("href", "/pitch_decks/new");
    });
  });

  it("renders rows in the table for each pitch deck", async () => {
    const pitchDecks = [
      {
        id: 1,
        name: "Test pitch deck",
        created_at: "2021-06-06T14:22:11Z",
        updated_at: "2021-06-06T14:22:11Z"
      }
    ];

    mockApiSuccess(pitchDecks);

    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(getByText("Test pitch deck")).toBeVisible();
      const showLink = getByText("Show Preview");
      expect(showLink).toHaveAttribute("href", `/pitch_decks/${pitchDecks[0].id}`);
    });
  });
});
