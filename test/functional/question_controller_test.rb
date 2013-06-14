require 'test_helper'

class QuestionControllerTest < ActionController::TestCase
  def setup
    @quiz = FactoryGirl.create(:quiz)
    @question = FactoryGirl.create(:question, :quiz => @quiz)
    # mocking for auth_filter
    @user = FactoryGirl.create(:user)
    session[:user_id] = @user.id
  end

  test "valid quiz question index" do 
    get :index, :quiz_id => @quiz.id
    assert_response :success
    assert_equal @quiz, assigns(:quiz)
    assert_equal [@question], assigns(:questions)
  end

  test "invalid quiz question index" do
    assert_raise(ActiveRecord::RecordNotFound) do 
      get :index, :quiz_id => :invalid
    end
  end

  test "valid show" do
    get :show, :quiz_id => @quiz.id, :id => @question.id
    assert_response :success
    assert_equal JSON.parse(response.body)["answer"], @question.answer
  end

  test "create" do
    params = {
      :quiz_id => @quiz.id,
      :answer => @question.answer,
      :data => @question.data
    }
    assert_difference('Question.count') do
      post :create, params
    end
  end

  test "update" do 
    params = {
      :quiz_id => @quiz.id,
      :id => @question.id,
      :answer => "new answer",
      :data => @question.data
    }
    post :update, params
    assert_equal Question.find(@question.id).answer, "new answer"
  end

  test "destroy" do
    assert_difference('Question.count', -1) do
      delete :destroy, :quiz_id => @quiz.id, :id => @question.id
    end
    assert_equal response.body, "{}"
  end
end
