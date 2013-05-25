class Quiz < ActiveRecord::Base
  attr_accessible :name, :summary, :questions
  has_many :questions
  has_many :quiz_sessions

  validates_presence_of :name, :summary

  def question_count
    questions.size
  end

  def as_json(user=nil, options={})
    result = super(options)
    result.merge({:question_count => question_count,
                  :user_status => user_status(user) })
  end

  private

  def user_status user
    if user.nil?
      return :not_started
    end
    with_user = quiz_sessions.where(:user => user)
    unless with_user
      :not_started
    else
      solved = with_user.where(:finished => true)
      solved ? :finished : :started
    end
    
  end
end
