import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createMemoryHistory } from "history";
import { fireEvent, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PitchDeckForm from ".";
import * as Api from "../../utils/Api";

describe("<PitchDeckForm />", () => {
  function mockCreatePitchDeckSuccess() {
    const mockCreatePitchDeck = jest.fn(() => {
      return Promise.resolve({
        ok: true,
        pitchDeck: {
          id: 1234
        }
      });
    });

    Api.createPitchDeck = mockCreatePitchDeck;

    return mockCreatePitchDeck;
  }

  it("renders the form", () => {
    const { getByTestId, getByLabelText } = render(<PitchDeckForm />);

    expect(getByTestId("test-pitch-deck-form")).toBeVisible();
    expect(getByLabelText("Name")).toBeVisible();
    expect(getByTestId("test-pitch-deck-file-input")).toBeVisible();
  });

  it("requires all inputs to be submitted", () => {
    const { getByTestId } = render(<PitchDeckForm />);

    expect(getByTestId("test-pitch-deck-name-input")).toBeRequired();
    expect(getByTestId("test-pitch-deck-file-input")).toBeRequired();
  });

  it("submits the pitch deck to the Api", () => {
    const mockCreatePitchDeck = mockCreatePitchDeckSuccess();
    const history = createMemoryHistory();

    const { getByTestId, getByText } = render(
      <Router history={history}>
        <PitchDeckForm />
      </Router>
    );

    const file = new File(["PDF content"], "test.pdf", {
      type: "application/pdf"
    });

    userEvent.upload(getByTestId("test-pitch-deck-file-input"), file);
    userEvent.type(getByTestId("test-pitch-deck-name-input"), "test name");
    userEvent.click(getByText("Submit"));

    expect(mockCreatePitchDeck).toHaveBeenCalledWith({
      name: "test name",
      file: file
    });
  });

  it("redirects the user to the pitch deck page after a successful upload", async () => {
    mockCreatePitchDeckSuccess();
    const history = createMemoryHistory();

    const { getByTestId, getByText } = render(
      <Router history={history}>
        <PitchDeckForm />
      </Router>
    );

    const file = new File(["PDF content"], "test.pdf", {
      type: "application/pdf"
    });

    userEvent.upload(getByTestId("test-pitch-deck-file-input"), file);
    userEvent.type(getByTestId("test-pitch-deck-name-input"), "test name");

    const submitButton = getByText("Submit");
    userEvent.click(submitButton);
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(history.location.pathname).toEqual("/pitch_decks/1234");
      expect(history.location.search).toEqual("?created=true");
    });
  });

  it("renders an error message when pitch deck creation fails", async () => {
    const mockCreatePitchDeck = jest.fn(() => {
      return Promise.resolve({
        ok: false
      });
    });

    Api.createPitchDeck = mockCreatePitchDeck;

    const { getByTestId, getByText } = render(<PitchDeckForm />);

    const file = new File(["PDF content"], "test.pdf", {
      type: "application/pdf"
    });

    userEvent.upload(getByTestId("test-pitch-deck-file-input"), file);
    userEvent.type(getByTestId("test-pitch-deck-name-input"), "test name");
    userEvent.click(getByText("Submit"));

    await waitFor(() => {
      expect(getByText("Failed to upload pitch deck. Please try again.")).toBeVisible();
      expect(getByText("Submit")).not.toBeDisabled();
    });
  });
});
