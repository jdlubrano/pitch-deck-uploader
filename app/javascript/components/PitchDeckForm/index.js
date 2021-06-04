import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { createPitchDeck } from "../../utils/Api";
import DismissibleAlert from "../DismissibleAlert";
import PdfPage from "../PdfPage";

const pdfjs = require("pdfjs-dist/webpack");

const PitchDeckForm = ({ pitchDeck }) => {
  const fileInputRef = useRef(null);
  const [name, setName] = useState(pitchDeck.name);
  const [pdf, setPdf] = useState(null);
  const [previewPage, setPreviewPage] = useState(null);

  const [notification, setNotification] = useState({
    message: null,
    status: null
  });

  const handleFileChosen = async (event) => {
    setPdf(null);
    setPreviewPage(null);

    const file = fileInputRef.current.files[0];

    if (!file) {
      return;
    }

    const buffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument(buffer).promise;
    const page = await pdf.getPage(1);

    setPdf(pdf);
    setPreviewPage(page);
  };

  const submitPitchDeck = async (event) => {
    event.preventDefault();

    const response = await createPitchDeck({
      name,
      file: fileInputRef.current.files[0]
    });

    const notification = {};

    if (response.ok) {
      resetState();
      const { pitchDeck } = response;

      notification.message = (
        <>
          Successfully uploaded pitch deck!
          <Link className="ms-2" to={`/pitch_decks/${pitchDeck.id}`}>View</Link>
        </>
      );

      notification.status = "success";
    } else {
      notification.message = (
        <>
          Failed to upload pitch deck. {response.error?.message || "Please try again."}
        </>
      );

      notification.status = "danger";
    }

    setNotification(notification);
  };

  const resetState = () => {
    setName("");
    fileInputRef.current.value = "";
    setPdf(null);
    setPreviewPage(null);
  };

  return (
    <>
      <form className="row mb-3" onReset={resetState} onSubmit={submitPitchDeck}>
        <p className="col-12 mb-2">
          Upload a New Pitch Deck
        </p>
        <div className="col-12 mb-4">
          <small>
            <Link to="/pitch_decks">Back to pitch decks</Link>
          </small>
        </div>
        <div className="col-12 mb-3">
          <label htmlFor="pitchDeckName" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="pitchDeckName"
            value={name}
            onChange={e => setName(e.target.value)}
            required />
        </div>
        <div className="col-12 mb-3">
          <input
            ref={fileInputRef}
            type="file"
            className="form-control"
            aria-label="pitch deck file"
            onChange={handleFileChosen}
            required />
        </div>
        <div>
          <button className="btn btn-primary me-3" type="submit">Submit</button>
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
      {pdf && previewPage && (
        <div className="row">
          <div className="col-12">
            Showing page 1 of {pdf.numPages}
          </div>
          <div className="col-12">
            <PdfPage pdfPage={previewPage} />
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
