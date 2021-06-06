export async function createPitchDeck({ name, file }) {
  const formData = new FormData();
  formData.append("pitch_deck[name]", name);
  formData.append("pitch_deck[file]", file);

  let response;

  try {
    response = await fetch("/api/pitch_decks", {
      method: "POST",
      headers: {
        "Accept": "application/json"
      },
      body: formData
    });

    const responseJson = await response.json();

    return {
      ok: response.ok,
      error: responseJson.error,
      status: response.status,
      pitchDeck: responseJson.pitch_deck
    };
  } catch(err) {
    console.error(err);

    return {
      ok: false,
      status: response?.status,
    }
  }
}

export async function getPitchDeck(id) {
  let response;

  try {
    response = await fetch(`/api/pitch_decks/${id}`, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    const responseJson = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      pitchDeck: responseJson.pitch_deck
    };
  } catch(err) {
    console.error(err);

    return {
      ok: false,
      status: response?.status,
    }
  }

}
