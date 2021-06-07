# frozen_string_literal: true

require "rails_helper"

RSpec.describe "creating a new pitch deck", js: true do
  it "renders a table of PitchDecks" do
    2.times do |i|
      FactoryBot.create(:pitch_deck, name: "Pitch Deck #{i + 1}")
    end

    visit("/")

    expect(page).to have_content("Pitch Decks")
    expect(page).to have_content("Pitch Deck 1")
    expect(page).to have_content("Pitch Deck 2")
  end
end
