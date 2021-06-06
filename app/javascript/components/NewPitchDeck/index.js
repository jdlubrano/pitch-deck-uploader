import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import PitchDeckForm from "../PitchDeckForm";

const NewPitchDeck = () => {
  return (
    <>
      <div className="row">
        <p className="col-12 mb-2">
          Upload a New Pitch Deck
        </p>
        <div className="col-12 mb-4">
          <small>
            <Link to="/pitch_decks">Back to pitch decks</Link>
          </small>
        </div>
      </div>
      <PitchDeckForm />
    </>
  );
};

export default NewPitchDeck;
