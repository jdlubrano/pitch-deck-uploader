import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import { getPitchDeck } from "../../utils/Api";

const dayjs = require("dayjs");
const localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)

const Loading = () => <p>Loading pitch deck...</p>;

const Error = ({ error, onRetry }) => {
  return (
    <div className="alert alert-danger" role="alert">
      <span className="me-2">{error}</span>
      <a href="#" onClick={onRetry}>Retry</a>
    </div>
  );
};

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
          Created at: {dayjs(pitchDeck.created_at).format("LLL")}
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

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search.slice(1));
  const newlyCreated = searchParams.get("created") === "true";

  async function loadPitchDeck() {
    const response = await getPitchDeck(id);

    if (response.ok) {
      setPitchDeck(response.pitchDeck);
    } else {
      setError("Failed to load pitch deck.");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadPitchDeck();
  }, []);

  function retryLoad() {
    setError(null);
    setLoading(true);
    loadPitchDeck();
  }

  return (
    <div className="row">
      <div className="col-12 mb-4">
        <Link to="/">Back to home</Link>
      </div>
      <div className="col-12">
        {loading && <Loading />}
        {!loading && error && <Error error={error} onRetry={retryLoad} />}
        {!loading && !error && <PitchDeck newlyCreated={newlyCreated} pitchDeck={pitchDeck} />}
      </div>
    </div>
  );
};

export default ShowPitchDeck;
