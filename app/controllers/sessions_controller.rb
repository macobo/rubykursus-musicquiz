class SessionsController < ApplicationController
  def index
    if session[:user_id]
      user = User.find(session[:user_id])
      render json: {:user => user, :logged_in => true}
    else
      render json: {:logged_in => false}
    end
  end

  def create
    user = User.from_omniauth(env["omniauth.auth"])
    session[:user_id] = user.id
    render json: {:user => user, :logged_in => true}
  end

  def destroy
    session[:user_id] = nil
    redirect_to :back
  end
end