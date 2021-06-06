# frozen_string_literal: true

require "rails_helper"

RSpec.describe GeneratePitchDeckPreviewJob do
  describe "#perform" do
    let(:pitch_deck) { FactoryBot.create(:pitch_deck) }

    subject(:perform) { described_class.perform_now(pitch_deck.id) }

    before do
      allow(GeneratePitchDeckPreview).to receive(:call)
    end

    it "calls the GeneratePitchDeckPreview interactor" do
      perform

      expect(GeneratePitchDeckPreview)
        .to have_received(:call)
        .with(pitch_deck: pitch_deck)
    end

    context "when the PitchDeck does not exist" do
      let(:pitch_deck) { FactoryBot.build_stubbed(:pitch_deck) }

      it "does not attempt to generate a preview" do
        perform
        expect(GeneratePitchDeckPreview).not_to have_received(:call)
      end
    end
  end
end
