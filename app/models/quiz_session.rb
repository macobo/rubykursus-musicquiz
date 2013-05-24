class QuizSession < ActiveRecord::Base
  belongs_to :quiz
  belongs_to :user
  attr_accessible :answers_given, :finished, :questions

  serialize :answers_given, JSON
  serialize :questions, JSON

  def self.from_params params, user = nil
    q_session = QuizSession.new
    q_session.quiz = Quiz.find(params[:quiz_id])
    q_session.user = user
    q_session.answers_given = []
    q_session.finished = false

    n = q_session.quiz.questions.size - 1
    q_session.questions = (0..n).to_a.shuffle
    q_session
  end

  def get_question i=nil
    i ||= answers_given.size - 1
    index = questions[i]
    quiz.questions[index].data
  end

  def get_answer i=nil
    i ||= answers_given.size - 1
    index = questions[i]
    print index, quiz.questions[index].nil?
    quiz.questions[index].answer
  end

  def correct_answers
    questions.zip(answers_given).map { |q, given_answer|
      get_answer(q) == given_answer
    }
  end

  def as_json(options={})
    result = super(options)
    result.merge({
      :question_count => quiz.questions.length,
      :correct_answers => correct_answers,
      :quiz => quiz
    })
  end
end
