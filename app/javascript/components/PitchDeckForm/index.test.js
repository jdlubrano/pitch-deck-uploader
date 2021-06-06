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

  it("redirects the user to the pitch deck page after a successful upload", () => {
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

    waitFor(() => {
      expect(history.location).toEqual("/pitch_decks/1234");
    });
  });

  it("renders an error message when pitch deck creation fails", () => {
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

    waitFor(() => {
      expect(getByText("Failed to upload pitch deck")).toBeVisible();
      expect(getByText("Submit")).not.toBeDisabled();
    });
  });
});
