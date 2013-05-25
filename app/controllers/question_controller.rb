class QuestionController < ApplicationController
    before_filter :authorization_required

    def quiz
        @quiz = Quiz.find(params[:quiz_id])
    end

    def from_params
        {:answer => params[:answer], 
         :data => params[:data]}
    end

    # GET /quizzes/1/questions
    def index
        @questions = quiz.questions.all
        render json: @questions
    end

    # GET /quizzes/1/questions/1
    def show
        @question = quiz.questions.find(params[:id])
        render json: @question
    end

    # POST /quizzes/1/questions
    def create
        @question = quiz.questions.build(from_params)
        if @question.save
            render json: @question, status: :created
        else
            render json: @question.errors, status: :unprocessable_entity
        end
    end

    # POST /quizzes/1/questions/1
    def update
        @question = quiz.questions.find(params[:id])

        if @question.update_attributes(from_params)
            render json: @question
        else
            render json: @question.errors, status: :unprocessable_entity
        end
    end

    # DELETE /quizzes/1/question/1
    def destroy
        @question = quiz.questions.find(params[:id])
        @question.destroy
        render json: {}
    end
end
