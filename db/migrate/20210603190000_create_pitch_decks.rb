class CreatePitchDecks < ActiveRecord::Migration[6.1]
  def change
    create_table :pitch_decks do |t|
      t.string :name, null: false

      t.column :created_at, "timestamp with time zone", null: false
      t.column :updated_at, "timestamp with time zone", null: false
    end
  end
end
