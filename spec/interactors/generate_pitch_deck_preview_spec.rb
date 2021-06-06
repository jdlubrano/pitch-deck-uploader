# frozen_string_literal: true

require "rails_helper"

RSpec.describe GeneratePitchDeckPreview do
  describe "#call" do
    let(:pitch_deck) { FactoryBot.create(:pitch_deck) }

    subject(:generate_pitch_deck_preview) do
      described_class.call(pitch_deck: pitch_deck)
    end

    it "returns a successful result" do
      result = generate_pitch_deck_preview

      expect(result).to be_success
      expect(result.pitch_deck_preview).to be_a(PitchDeckPreview)
      expect(result.pitch_deck_preview).to be_complete
    end

    it "creates a PitchDeckPreview for the given PitchDeck" do
      expect { generate_pitch_deck_preview }
        .to change { pitch_deck.reload.pitch_deck_preview }
        .from(nil)
        .to(instance_of(PitchDeckPreview))
    end

    it "converts each page of the PitchDeck's PDF into an image attached to the PitchDeckPreview" do
      pages_in_test_pdf = 2
      pitch_deck_preview = generate_pitch_deck_preview.pitch_deck_preview
      images = pitch_deck_preview.images

      expect(images.count).to be(pages_in_test_pdf)

      blobs = images.map(&:blob)

      expect(blobs.map(&:content_type)).to all eq("application/png")

      page_numbers = blobs.map { |blob| blob.metadata.fetch("page_number") }

      expect(page_numbers).to contain_exactly(0, 1)
    end

    context "when the PitchDeck file cannot be converted" do
      let(:pitch_deck) do
        filepath = Rails.root.join("spec", "support", "fixtures", "test_ppt.pptx")
        pptx = Rack::Test::UploadedFile.new(filepath, "application/pdf")
        FactoryBot.create(:pitch_deck, file: pptx)
      end

      it "returns a failed result" do
        result = generate_pitch_deck_preview

        expect(result).not_to be_success
        expect(result.error).to be_a(MiniMagick::Error)
      end
    end
  end
end
