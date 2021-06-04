# frozen_string_literal: true

FactoryBot.define do
  factory :pitch_deck do
    sequence(:name) { |i| "Test pitch deck #{i}" }

    file do
      filepath = Rails.root.join("spec", "support", "fixtures", "test_pitch_deck.pdf")
      Rack::Test::UploadedFile.new(filepath, "application/pdf")
    end
  end
end
