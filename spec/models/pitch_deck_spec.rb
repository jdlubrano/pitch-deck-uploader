# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PitchDeck do
  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to have_one(:pitch_deck_preview) }
  it { is_expected.to have_one_attached(:file) }
end
