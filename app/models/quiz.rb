class Quiz < ActiveRecord::Base
  attr_accessible :name, :summary, :questions
  has_many :questions
  has_many :quiz_sessions

  validates_presence_of :name, :summary

  def question_count
    questions.size
  end

  def as_json(options={})
    puts options
    result = super(options)
    result.merge({:question_count => question_count,
                  :user_status => user_status(options[:user]) })
  end

  private

  def user_status user
    if user.nil?
      return :not_started
    end
    with_user = quiz_sessions.where(:user_id => user.id)
    puts({:awith_user => with_user.empty?, :user => user})
    if with_user.empty?
      :not_started
    else
      solved = with_user.where(:finished => true)
      solved.empty? ? :started : :finished
    end
  end
end
