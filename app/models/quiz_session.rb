class QuizSession < ActiveRecord::Base
  belongs_to :quiz
  belongs_to :user
  attr_accessible :answers_given, :finished, :questions

  serialize :answers_given, JSON
  serialize :questions, JSON

  def get_question i 
    index = @questions[i]
    @quiz.questions[index].data
  end

  def get_answer i
    index = @questions[i]
    @quiz.questions[index].answer
  end

  def correct_answers
    @questions.zip(@answers_given).map { |q, given_answer|
      get_answer(q) == given_answer
    }
  end

  def as_json(options={})
    result = super(options)
    result.merge({
      :question_count => @quiz.questions.length,
      :correct_answers => correct_answers,
      :quiz_id => quiz.id
    })
  end
end
