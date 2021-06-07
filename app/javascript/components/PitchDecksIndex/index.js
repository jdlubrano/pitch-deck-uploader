import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import RetriableError from "../RetriableError";

import { getPitchDecks } from "../../utils/Api";
import { formatDateTime } from "../../utils/DateFormats";

const PitchDecksTable = ({ pitchDecks }) => {
  if (pitchDecks.length === 0) {
    return null;
  }

  return (
    <table className="table mt-4" data-testid="test-pitch-decks-table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Created At</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {pitchDecks.map((pitchDeck) => (
          <tr key={pitchDeck.id}>
            <td>{pitchDeck.name}</td>
            <td>{formatDateTime(pitchDeck.created_at)}</td>
            <td>
              <Link to={`/pitch_decks/${pitchDeck.id}`}>Show Preview</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const PitchDecksIndex = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pitchDecks, setPitchDecks] = useState([]);

  async function loadPitchDecks() {
    const response = await getPitchDecks();

    if (response.ok) {
      setPitchDecks(response.pitchDecks);
    } else {
      setError(true);
    }

    setLoading(false);
  }

  function retryLoad() {
    setError(false);
    setLoading(true);
    loadPitchDecks();
  }

  useEffect(() => {
    loadPitchDecks();
  }, []);

  return (
    <div className="row">
      <div className="col-12">
        {loading && (
          <p>Loading pitch decks...</p>
        )}
        {!loading && error && (
          <RetriableError error={"Failed to load pitch decks."} onRetry={retryLoad} />
        )}
        {!loading && !error && (
          <>
            <h2>Pitch Decks</h2>
            <Link to="/pitch_decks/new">Upload a new pitch deck</Link>
            <PitchDecksTable pitchDecks={pitchDecks} />
          </>
        )}
      </div>
    </div>
  );
};

export default PitchDecksIndex;
