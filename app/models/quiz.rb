class Quiz < ActiveRecord::Base
  attr_accessible :name, :summary, :questions
  has_many :questions

  validates_presence_of :name, :summary

  def question_count
    questions.size
  end

  def as_json(options={})
    result = super(options)
    result.merge({:question_count => question_count})
  end
end
