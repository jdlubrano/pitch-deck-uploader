# frozen_string_literal: true

require "rails_helper"

RSpec.describe "creating a new pitch deck", js: true do
  let(:test_pdf) { Rails.root.join("spec", "support", "fixtures", "test_pitch_deck.pdf") }

  # NOTE: (jdlubrano)
  # This could be a good candidate for visual/snapshot testing with Percy
  # or a similar service.
  it "renders a preview of the uploaded pitch deck" do
    visit("/pitch_decks/new")

    fill_in("name", with: "Test pitch deck")
    attach_file("file", test_pdf)

    expect(page).to have_selector("canvas", visible: true)
  end

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
