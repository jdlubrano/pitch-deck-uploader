export async function createPitchDeck({ name, file }) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("file", file);

  const response = await fetch("/api/pitch_decks", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formData
  });

  return response;
}
