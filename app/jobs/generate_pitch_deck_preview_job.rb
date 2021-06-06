# frozen_string_literal: true

class GeneratePitchDeckPreviewJob < ApplicationJob
  queue_as :pitch_deck_previews

  discard_on ActiveRecord::RecordNotFound

  def perform(pitch_deck_id)
    pitch_deck = PitchDeck.find(pitch_deck_id)
    GeneratePitchDeckPreview.call(pitch_deck: pitch_deck)
  end
end
