class QuizController < ApplicationController

    before_filter :authorization_required, :except => [:index, :show]
    
    def from_params
        # take the needed args for a constructor
        {:name => params[:name], :summary => params[:summary]}
    end

    # GET /quizzes
    def index
        @quizzes = Quiz.all
        render json: @quizzes.as_json(:user => current_user)
    end

    # GET /quizzes/1
    def show
        @quiz = Quiz.find(params[:id])
        render json: @quiz
    end

    # POST /quizzes
    def create
        @quiz = Quiz.new(from_params)
        if @quiz.save
            render json: @quiz, status: :created
        else
            render json: @quiz.errors, status: :unprocessable_entity
        end
    end

    # PUT /quizzes/1
    def update
        @quiz = Quiz.find(params[:id])
        if !@quiz.update_attributes(from_params)
            render json: @quiz.errors, status: :unprocessable_entity 
        end
    end

    # DELETE /quizzes/1
    def destroy
        @quiz = Quiz.find(params[:id])
        @quiz.destroy
        render json: {}
    end
end