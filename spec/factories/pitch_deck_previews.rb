FactoryBot.define do
  factory :pitch_deck_preview do
    pitch_deck
    status { "complete" }

    trait(:complete) do
      status { "complete" }

      images do
        filepath = Rails.root.join("spec", "support", "fixtures", "test_preview_image.png")
        file = Rack::Test::UploadedFile.new(filepath, "image/png")

        blob = ActiveStorage::Blob.create_and_upload!(
          io: file,
          filename: "page_0.png",
          metadata: {
            page_number: 0
          }
        )

        [blob]
      end
    end

    trait(:failed) do
      status { "failed" }
    end
  end
end
