class CreateQuizSessions < ActiveRecord::Migration
  def change
    create_table :quiz_sessions do |t|
      t.references :quiz
      t.references :user
      t.string :questions
      t.string :answers_given
      t.boolean :finished

      t.timestamps
    end
    add_index :quiz_sessions, :quiz_id
    add_index :quiz_sessions, :user_id
  end
end
