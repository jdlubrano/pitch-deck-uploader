import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const pdfjs = require("pdfjs-dist/webpack");

const PitchDeckForm = ({ pitchDeck }) => {
  const [convertingPdf, setConvertingPdf] = useState(false);
  const [name, setName] = useState(pitchDeck.name);
  const [pitchDeckSlides, setPitchDeckSlides] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChosen = async (event) => {
    const file = fileInputRef.current.files[0];

    if (!file) {
      return;
    }

    const slides = [];
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument(buffer).promise;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({scale: 0.5});
      const canvas = document.createElement("canvas");
      const canvasContext = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext,
        viewport
      };

      await page.render(renderContext).promise;
      document.body.appendChild(canvas);
      slides.push(canvas.toDataURL());
    }

    console.log(slides[0]);
    setPitchDeckSlides(slides);
  };

  const submitPitchDeck = event => {
    event.preventDefault();
    console.log("Submit form", name, fileInputRef.current.value);
  };

  return (
    <form className="row" onSubmit={submitPitchDeck}>
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
