class PitchDeck < ApplicationRecord
  has_one :pitch_deck_preview
  has_one_attached :file

  validates :name, presence: true
end
