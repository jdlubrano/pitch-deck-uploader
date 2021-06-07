# frozen_string_literal: true

require "rails_helper"

RSpec.describe "GET /api/pitch_decks/:id" do
  let(:pitch_deck) { FactoryBot.create(:pitch_deck) }

  let(:headers) do
    {
      "ACCEPT" => "application/json"
    }
  end

  subject(:show_pitch_deck) do
    get "/api/pitch_decks/#{pitch_deck.id}", headers: headers
  end

  it "returns the PitchDeck as JSON" do
    show_pitch_deck

    expect(json_response[:pitch_deck]).to match(hash_including({
      id: pitch_deck.id,
      name: pitch_deck.name,
      created_at: pitch_deck.created_at.iso8601,
      updated_at: pitch_deck.updated_at.iso8601,
      file: hash_including({
        download_url: /http/
      })
    }))

    expect(json_response[:pitch_deck][:pitch_deck_preview]).to be_nil
  end

  context "when a PitchDeckPreview exists for the PitchDeck" do
    let!(:pitch_deck_preview) do
      FactoryBot.create(:pitch_deck_preview, :complete, pitch_deck: pitch_deck)
    end

    it "returns PitchDeckPreview data when one exists" do
      show_pitch_deck

      expect(json_response.dig(:pitch_deck, :pitch_deck_preview)).to match(hash_including({
        id: pitch_deck_preview.id,
        status: pitch_deck_preview.status,
        slides: match_array([
          {image_url: /http/}
        ])
      }))
    end
  end

  context "when the PitchDeck does not exist" do
    let(:pitch_deck) { FactoryBot.build_stubbed(:pitch_deck) }

    it "returns a 404 response" do
      show_pitch_deck
      expect(response).to have_http_status(:not_found)
    end
  end
end
