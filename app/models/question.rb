class Question < ActiveRecord::Base
  belongs_to :quiz
  attr_accessible :answer, :data

  serialize :data, JSON
end
