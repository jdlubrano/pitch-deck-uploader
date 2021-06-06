import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";

import { createPitchDeck } from "../../utils/Api";
import DismissibleAlert from "../DismissibleAlert";

const PitchDeckForm = ({ pitchDeck }) => {
  const fileInputRef = useRef(null);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [name, setName] = useState(pitchDeck.name);
  const history = useHistory();

  const [notification, setNotification] = useState({
    message: null,
    status: null
  });

  const submitPitchDeck = async (event) => {
    event.preventDefault();

    setDisableSubmit(true);

    setNotification({
      message: null,
      status: null
    });

    const response = await createPitchDeck({
      name,
      file: fileInputRef.current.files[0]
    });

    if (response.ok) {
      const { pitchDeck } = response;
      history.push(`/pitch_decks/${pitchDeck.id}?created=true`);
    } else {
      const message = (
        <span>
          Failed to upload pitch deck. {response.error?.message || "Please try again."}
        </span>
      );

      setDisableSubmit(false);

      setNotification({
        message,
        status: "danger"
      });
    }
  };

  const resetState = () => {
    setName("");
    fileInputRef.current.value = "";
  };

  return (
    <>
      <form className="row mb-3" onReset={resetState} onSubmit={submitPitchDeck} data-testid="test-pitch-deck-form">
        <div className="col-12 mb-3">
          <label htmlFor="pitchDeckName" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="pitchDeckName"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            data-testid="test-pitch-deck-name-input"
            required />
        </div>
        <div className="col-12 mb-3">
          <label htmlFor="pitchDeckFile" className="form-label">Presentation File (PDF only)</label>
          <input
            id="pitchDeckFile"
            ref={fileInputRef}
            type="file"
            name="file"
            className="form-control"
            aria-label="pitch deck file"
            data-testid="test-pitch-deck-file-input"
            required />
        </div>
        <div>
          <button className="btn btn-primary me-3" type="submit" disabled={disableSubmit}>Submit</button>
          <button className="btn btn-light" type="reset">Clear</button>
        </div>
      </form>
      {notification.status && (
        <div className="row">
          <div className="col-12">
            <DismissibleAlert status={notification.status}>
              {notification.message}
            </DismissibleAlert>
          </div>
        </div>
      )}
    </>
  );
};

PitchDeckForm.propTypes = {
  pitchDeck: PropTypes.shape({
    name: PropTypes.string
  })
};

PitchDeckForm.defaultProps = {
  pitchDeck: {
    name: ""
  }
};

export default PitchDeckForm;
