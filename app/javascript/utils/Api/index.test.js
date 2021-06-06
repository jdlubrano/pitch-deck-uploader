import { createPitchDeck } from ".";

describe("Api", () => {
  beforeEach(() => {
    fetch.resetMocks();
    console.error = jest.fn();
  });

  describe("createPitchDeck", () => {
    const name = "Test";
    const file = new File([], "test");

    function mockSuccessfulResponse() {
      return fetch.mockResponseOnce(JSON.stringify({
        pitch_deck: {
          id: 1234
        }
      }));
    }

    it("calls /api/pitch_decks", async () => {
      mockSuccessfulResponse();

      const response = await createPitchDeck({
        name,
        file
      });

      expect(fetch).toHaveBeenCalledWith("/api/pitch_decks", {
        method: "POST",
        headers: {
          "Accept": "application/json"
        },
        body: expect.any(FormData)
      });
    });

    it("returns the pitch deck data", async () => {
      mockSuccessfulResponse();

      const response = await createPitchDeck({
        name,
        file
      });

      expect(response).toEqual({
        ok: true,
        error: undefined,
        status: 200,
        pitchDeck: {
          id: 1234
        }
      });
    });

    it("returns an unsuccessful response", async () => {
      fetch.mockResponses([
        JSON.stringify({error: "Something went wrong"}),
        {status: 500}
      ]);

      const response = await createPitchDeck({
        name,
        file
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });

    it("returns an error response when the fetch is rejected", async () => {
      fetch.mockReject(new Error("Something went wrong"));

      const response = await createPitchDeck({
        name,
        file
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(undefined);
    });
  });
});
