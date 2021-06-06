FactoryBot.define do
  factory :pitch_deck_preview do
    pitch_deck
    status { "complete" }

    trait(:complete) do
      status { "complete" }
    end

    trait(:failed) do
      status { "failed" }
    end
  end
end
