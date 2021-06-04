class CreatePitchDeck
  include Interactor
  include ActionView::Helpers::NumberHelper

  MAXIMUM_FILE_SIZE = 100.megabytes

  delegate :name, :file, to: :context

  def call
    validate_file!

    pitch_deck = PitchDeck.new(name: name)
    pitch_deck.file = file
    context.fail!(error: pitch_deck.errors.full_messages.to_sentence) unless pitch_deck.valid?

    pitch_deck.save!

    context.pitch_deck = pitch_deck
  end

  private

  def validate_file!
    if file.content_type != "application/pdf"
      context.fail!(error: "File must be a PDF")
    end

    if file.size > MAXIMUM_FILE_SIZE
      context.fail!(error: "File cannot exceed #{number_to_human_size(MAXIMUM_FILE_SIZE)}")
    end
  end
end
