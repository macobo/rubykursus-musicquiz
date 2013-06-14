require 'test_helper'

class QuizTest < ActiveSupport::TestCase
  def setup
    @quiz = FactoryGirl.create(:quiz)
  end


  test "empty quiz should have question_count of 0" do
    assert_equal @quiz.question_count, 0
  end

  test "adding a question should increase question_count" do
    question = FactoryGirl.create(:question, :quiz => @quiz)
    assert_equal @quiz.question_count, 1
  end

  test "json representation should include question count" do
    q = @quiz.as_json
    assert_equal q[:question_count], @quiz.question_count
  end
end
