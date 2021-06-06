json.pitch_deck do
  json.extract! @pitch_deck,
                :id,
                :name

  json.created_at @pitch_deck.created_at.iso8601
  json.updated_at @pitch_deck.updated_at.iso8601

  json.file do
    json.download_url rails_blob_url(@pitch_deck.file)
  end

  if @pitch_deck.pitch_deck_preview.present?
    json.pitch_deck_preview do
      json.extract! @pitch_deck.pitch_deck_preview,
                    :id,
                    :status

      json.slides @pitch_deck.pitch_deck_preview.slides do |slide|
        json.image_url slide.url
      end
    end
  else
    json.pitch_deck_preview nil
  end
end
