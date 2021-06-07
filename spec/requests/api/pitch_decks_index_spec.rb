# frozen_string_literal: true

require "rails_helper"

RSpec.describe "GET /api/pitch_decks" do
  let!(:pitch_deck) { FactoryBot.create(:pitch_deck) }

  let(:headers) do
    {
      "ACCEPT" => "application/json"
    }
  end

  subject(:get_pitch_decks) do
    get "/api/pitch_decks", headers: headers
  end

  it "returns all PitchDecks as JSON" do
    get_pitch_decks

    expect(json_response[:pitch_decks].first).to eq({
      id: pitch_deck.id,
      name: pitch_deck.name,
      created_at: pitch_deck.created_at.iso8601,
      updated_at: pitch_deck.updated_at.iso8601
    })
  end
end
