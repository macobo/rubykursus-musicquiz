class Question < ActiveRecord::Base
  belongs_to :quiz
  attr_accessible :answer, :data

  has_many :quiz_sessions

  serialize :data, JSON
end
