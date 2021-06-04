json.pitch_deck do
  json.extract! @pitch_deck,
                :id,
                :name

  json.created_at @pitch_deck.created_at.iso8601
  json.updated_at @pitch_deck.updated_at.iso8601

  json.file do
    json.attachment_url rails_blob_url(@pitch_deck.file, disposition: "attachment")
    json.download_url rails_blob_url(@pitch_deck.file)
  end
end
