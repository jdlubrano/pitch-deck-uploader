# frozen_string_literal: true

require "rails_helper"

RSpec.describe "creating a new pitch deck", js: true do
  let(:test_pdf) { Rails.root.join("spec", "support", "fixtures", "test_pitch_deck.pdf") }

  it "creates a PitchDeck" do
    expect(PitchDeck.count).to be_zero

    visit("/pitch_decks/new")

    fill_in("name", with: "Test pitch deck")
    attach_file("file", test_pdf)

    click_on("Submit")

    expect(page).to have_content("Successfully uploaded")
    expect(PitchDeck.count).to be(1)
  end
end
