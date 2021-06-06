# frozen_string_literal: true

class PitchDeckPreview < ApplicationRecord
  belongs_to :pitch_deck
  has_many_attached :images

  STATUSES = %i[complete failed].freeze

  enum status: STATUSES.map { |status| [status, status.to_s] }.to_h

  def slides
    images.sort_by { |image| image.blob.metadata.fetch("page_number") }
  end
end
