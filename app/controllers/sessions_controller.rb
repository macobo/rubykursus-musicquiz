class SessionsController < ApplicationController
  def index
    puts "index", session
    user = User.find(session[:user_id])
    render json: user
  end

  def create
    user = User.from_omniauth(env["omniauth.auth"])
    session[:user_id] = user.id
    puts "create", session
    render json: {:user => user, :logged_in => true}
  end

  def destroy
    session[:user_id] = nil
    redirect_to :back
  end
end