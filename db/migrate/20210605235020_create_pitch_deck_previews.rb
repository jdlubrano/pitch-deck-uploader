class CreatePitchDeckPreviews < ActiveRecord::Migration[6.1]
  def change
    create_table :pitch_deck_previews do |t|
      t.belongs_to :pitch_deck, null: false, foreign_key: true
      t.string :status, null: false

      t.column :created_at, "timestamp with time zone", null: false
      t.column :updated_at, "timestamp with time zone", null: false
    end
  end
end
