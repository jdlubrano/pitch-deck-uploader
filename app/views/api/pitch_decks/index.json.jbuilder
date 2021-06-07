json.pitch_decks @pitch_decks do |pitch_deck|
  json.extract! pitch_deck,
                :id,
                :name

  json.created_at pitch_deck.created_at.iso8601
  json.updated_at pitch_deck.updated_at.iso8601
end
