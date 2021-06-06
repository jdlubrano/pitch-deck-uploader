# frozen_string_literal: true

class GeneratePitchDeckPreview
  PREVIEW_IMAGE_SIZE = 500 # pixels

  include Interactor

  def call
    images = convert_pdf_pages_to_images
    create_preview_with_images(images)
  end

  private

  delegate :pitch_deck, to: :context

  def create_preview_with_images(images)
    preview = pitch_deck.build_pitch_deck_preview
    preview.images = create_blobs_from_images(images)
    preview.complete!

    Rails.logger.info("Generated images for PitchDeckPreview #{preview.id}")
    context.pitch_deck_preview = preview
  end

  def create_blobs_from_images(images)
    images.each_with_index.map { |image, i|
      ActiveStorage::Blob.create_and_upload!(
        io: image,
        content_type: "application/png",
        filename: "page_#{i}.png",
        identify: false,
        metadata: {
          page_number: i
        }
      )
    }
  end

  def convert_pdf_pages_to_images
    pitch_deck.file.open do |f|
      page_count = MiniMagick::Image.new(f.path).pages.count

      magick = ImageProcessing::MiniMagick
        .source(f.path)
        .resize_to_limit(PREVIEW_IMAGE_SIZE, PREVIEW_IMAGE_SIZE)
        .convert("png")

      page_count.times.map do |page_number|
        magick.loader(page: page_number).call
      end
    rescue MiniMagick::Error => e
      Rails.logger.error("Could not generate preview for PitchDeck #{pitch_deck.id} #{e.inspect}")
      preview = pitch_deck.build_pitch_deck_preview
      preview.failed!
      context.pitch_deck_preview = preview

      context.fail!(error: e)
    end
  end
end
