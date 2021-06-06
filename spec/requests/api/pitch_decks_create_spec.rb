# frozen_string_literal: true

require "rails_helper"

RSpec.describe "POST /api/pitch_decks" do
  let(:name) { "Test pitch deck" }
  let(:file) { Rack::Test::UploadedFile.new(file_contents, "application/pdf") }
  let(:file_contents) { Rails.root.join("spec", "support", "fixtures", "test_pitch_deck.pdf") }
  let(:params) { {pitch_deck: pitch_deck_params} }

  let(:headers) do
    {
      "ACCEPT" => "application/json",
      "CONTENT_TYPE" => "application/x-www-form-urlencoded"
    }
  end

  subject(:create_pitch_deck) do
    post "/api/pitch_decks", headers: headers, params: params
  end

  context "when the request is valid" do
    let(:pitch_deck_params) do
      {
        name: name,
        file: file
      }
    end

    # NOTE: (jdlubrano)
    # Even though I have unit tests for the CreatePitchDeck class, I still like
    # to include a happy path test to make sure that the integration of the
    # controller and the interactor actually works.  If the test setup is
    # especially involved, I might move that to a separate system spec.  In
    # this case, I would just include the test with my request specs.
    describe "happy path integration" do
      it "creates a PitchDeck" do
        allow(CreatePitchDeck).to receive(:call).and_call_original

        expect { create_pitch_deck }.to change { PitchDeck.count }.by(1)
        expect(response).to have_http_status(:created)

        expect(CreatePitchDeck)
          .to have_received(:call)
          .with(name: name, file: instance_of(ActionDispatch::Http::UploadedFile))
      end
    end

    context "when the PitchDeck is successfully created" do
      let(:pitch_deck) { FactoryBot.create(:pitch_deck) }
      let(:mock_result) { double("mock result", success?: true, pitch_deck: pitch_deck) }

      before do
        expect(CreatePitchDeck).to receive(:call).and_return(mock_result)
      end

      it "returns a successful response" do
        create_pitch_deck

        expect(response).to have_http_status(:created)
      end

      it "returns PitchDeck data" do
        create_pitch_deck

        expect(json_response[:pitch_deck]).to match({
          id: pitch_deck.id,
          name: pitch_deck.name,
          created_at: pitch_deck.created_at.iso8601,
          updated_at: pitch_deck.updated_at.iso8601,
          file: {
            download_url: a_string_starting_with("http://")
          },
          pitch_deck_preview: nil
        })
      end
    end

    context "when the PitchDeck cannot be created" do
      let(:mock_result) do
        double("mock result", error: "Test error", success?: false)
      end

      before do
        expect(CreatePitchDeck).to receive(:call).and_return(mock_result)
      end

      it "returns an unsuccessful response" do
        create_pitch_deck

        expect(response).to have_http_status(:unprocessable_entity)
      end

      it "includes the error in the response" do
        create_pitch_deck

        expect(json_response[:error][:code]).to eq("pitch_deck_creation_failed")
        expect(json_response[:error][:message]).to eq("Test error")
      end
    end
  end

  context "when the request is missing a name parameter" do
    let(:pitch_deck_params) { {file: file} }

    it "returns an unsuccessful response" do
      create_pitch_deck

      expect(response).to have_http_status(:bad_request)
    end

    it "includes an error in the response" do
      create_pitch_deck

      expect(json_response[:error][:code]).to eq("parameter_missing")
      expect(json_response[:error][:message]).to eq("Missing name parameter")
    end
  end

  context "when the request is missing a file parameter" do
    let(:pitch_deck_params) { {name: name} }

    it "returns an unsuccessful response" do
      create_pitch_deck

      expect(response).to have_http_status(:bad_request)
    end

    it "includes an error in the response" do
      create_pitch_deck

      expect(json_response[:error][:code]).to eq("parameter_missing")
      expect(json_response[:error][:message]).to eq("Missing file parameter")
    end
  end
end
