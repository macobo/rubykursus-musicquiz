class QuizSessionController < ApplicationController
  def new
    @q_session = QuizSession.from_params params, current_user
    if @q_session.save
        render json: @q_session, status: :created
    else
        render json: @q_session.errors, status: :unprocessable_entity
    end
  end

  def answer
    @q_session = QuizSession.find params[:id]
    expected_answer = @q_session.get_answer
    @q_session.answers_given.push(params[:answer])
    @q_session.save!
    render json: {
      :quiz => @q_session, 
      :question => @q_session.get_question,
      :expected_answer => expected_answer
    }
  end

  def show
    @q_session = QuizSession.find params[:id]
    render json: {:quiz => @q_session, :question => @q_session.get_question}
  end 
end
