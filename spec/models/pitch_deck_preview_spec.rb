# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PitchDeckPreview, type: :model do
  it { is_expected.to belong_to(:pitch_deck) }
  it { is_expected.to have_many_attached(:images) }

  it do
    is_expected
      .to define_enum_for(:status)
      .backed_by_column_of_type(:string)
      .with_values(
        complete: "complete",
        failed: "failed"
      )
  end
end
