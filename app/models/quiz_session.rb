class QuizSession < ActiveRecord::Base
  belongs_to :quiz
  belongs_to :user
  attr_accessible :answers_given, :finished, :questions, :user

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

  def give_answer answer 
    answers_given.push(answer)
    self.finished = answers_given.size == questions.size
    save!
  end

  def get_question i=nil
    if i.nil?
      i = answers_given.size
    end
    if i < questions.size
      index = questions[i]
      quiz.questions[index].data
    end
  end

  def get_answer i=nil
    if i.nil?
      i = answers_given.size
    end
    index = questions[i]
    quiz.questions[index].answer
  end

  def correct_answers
    n = answers_given.size
    (0..n-1).zip(answers_given).map { |q, given_answer|
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
