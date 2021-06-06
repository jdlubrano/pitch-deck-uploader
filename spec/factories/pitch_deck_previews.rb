FactoryBot.define do
  factory :pitch_deck_preview do
    pitch_deck
    status { "processing" }
  end
end
