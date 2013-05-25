class ApplicationController < ActionController::Base
  #protect_from_forgery

  private

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  def authorization_required
    if current_user.nil?
      render json: {:logged_in => false}
    end
  end

  helper_method :current_user, :authorization_required
end
