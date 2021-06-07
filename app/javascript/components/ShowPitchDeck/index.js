import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import { getPitchDeck } from "../../utils/Api";
import { formatDateTime } from "../../utils/DateFormats";
import RetriableError from "../RetriableError";

const PitchDeck = ({ newlyCreated, pitchDeck }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  return (
    <>
      <div className="row">
        {newlyCreated && (
          <div className="col-12">
            <div className="alert alert-success" data-testid="test-created-message">
              You successfully uploaded a pitch deck!
            </div>
          </div>
        )}
        <div className="col-12 h4">
          {pitchDeck.name}
        </div>
        <div className="col-12">
          Created at: {formatDateTime(pitchDeck.created_at)}
        </div>
        <a href={pitchDeck.file.download_url} target="_blank">Download</a>
      </div>
      <PitchDeckPreview preview={pitchDeck.pitch_deck_preview} />
    </>
  );
}

const PitchDeckPreview = ({ preview }) => {
  let previewContent;

  if (!preview) {
    previewContent = (
      <div className="alert alert-info" data-testid="test-processing-info">
        This pitch deck is currently being processed.
        When the preview is available it will be displayed here automatically.
      </div>
    );
  } else if (preview.status === "failed") {
    previewContent = (
      <div className="alert alert-danger" data-testid="test-preview-failed">
        We could not generate a preview of This pitch deck.
        You can still download the deck using the Download link above.
      </div>
    );
  } else if (preview.status === "complete") {
    const { slides } = preview;

    previewContent = (
      <div className="row">
        {slides.map((slide, i) => (
          <div key={i} className="col-lg-6 col-12 mb-4">
            <img src={slide.image_url} alt={`slide ${i}`} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="row mt-4">
      <div className="col-12">{previewContent}</div>
    </div>
  );
};

const ShowPitchDeck = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pitchDeck, setPitchDeck] = useState(null);
  let previewPoller = null;

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search.slice(1));
  const newlyCreated = searchParams.get("created") === "true";

  async function loadPitchDeck() {
    const response = await getPitchDeck(id);

    if (response.ok) {
      const { pitchDeck } = response;
      setPitchDeck(pitchDeck);

      if (!pitchDeck.pitch_deck_preview) {
        previewPoller = setInterval(pollForPreview, 5000);
      }
    } else {
      setError("Failed to load pitch deck.");
    }

    setLoading(false);
  }

  async function pollForPreview() {
    const response = await getPitchDeck(id);

    if (response.ok) {
      const { pitchDeck } = response;

      if (pitchDeck.pitch_deck_preview) {
        setPitchDeck(pitchDeck);
        clearInterval(previewPoller);
      }
    }
  }

  useEffect(() => {
    loadPitchDeck();

    return function cleanup() {
      if (previewPoller) {
        clearInterval(previewPoller);
      }
    }
  }, []);

  function retryLoad() {
    setError(null);
    setLoading(true);
    loadPitchDeck();
  }

  return (
    <div className="row">
      <div className="col-12 mb-4">
        <Link to="/">Back to pitch decks</Link>
      </div>
      <div className="col-12">
        {loading && <p>Loading pitch deck...</p>}
        {!loading && error && <RetriableError error={error} onRetry={retryLoad} />}
        {!loading && !error && <PitchDeck newlyCreated={newlyCreated} pitchDeck={pitchDeck} />}
      </div>
    </div>
  );
};

export default ShowPitchDeck;
