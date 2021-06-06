# frozen_string_literal: true

require "rails_helper"

RSpec.describe CreatePitchDeck do
  describe "#call" do
    let(:name) { "Test pitch deck" }
    let(:file) { Rack::Test::UploadedFile.new(file_contents, "application/pdf") }
    let(:file_contents) { Rails.root.join("spec", "support", "fixtures", "test_pitch_deck.pdf") }

    subject(:create_pitch_deck) { described_class.call(name: name, file: file) }

    it "creates a PitchDeck" do
      expect { create_pitch_deck }.to change { PitchDeck.count }.by(1)
    end

    it "assigns the proper attributes to the PitchDeck" do
      pitch_deck = create_pitch_deck.pitch_deck

      expect(pitch_deck.name).to eq(name)
    end

    it "uploads the file as an attachment" do
      pitch_deck = create_pitch_deck.pitch_deck

      expect(pitch_deck.file).to be_persisted
      expect(pitch_deck.file.byte_size).to eq(File.size(file_contents))
      expect(pitch_deck.file.content_type).to eq("application/pdf")
    end

    context "when the file is not a PDF" do
      let(:file) do
        Rack::Test::UploadedFile.new(
          Tempfile.new,
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          original_filename: "test.pptx"
        )
      end

      it "returns an error" do
        result = create_pitch_deck

        expect(result).not_to be_success
        expect(result.error).to eq("File must be a PDF")
      end
    end

    context "when the file is too large" do
      let(:max_size) { File.size(file_contents) - 1 }

      before do
        stub_const("CreatePitchDeck::MAXIMUM_FILE_SIZE", max_size)
      end

      it "returns an error" do
        result = create_pitch_deck

        expect(result).not_to be_success
        expect(result.error).to match(/File cannot exceed/)
      end
    end

    context "when the name is blank" do
      let(:name) { "" }

      it "returns an error" do
        result = create_pitch_deck

        expect(result).not_to be_success
        expect(result.error).to match(/Name can't be blank/)
      end
    end
  end
end
