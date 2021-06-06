# frozen_string_literal: true

class PitchDeckPreview < ApplicationRecord
  belongs_to :pitch_deck
  has_many_attached :images

  STATUSES = %i[processing complete failed].freeze

  enum status: STATUSES.map { |status| [status, status.to_s] }.to_h
end
