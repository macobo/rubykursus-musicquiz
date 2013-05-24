AngularMusicquiz::Application.routes.draw do
  match 'auth/:provider/callback', to: 'sessions#create'
  match 'auth/failure', to: redirect('/')
  match 'signout', to: 'sessions#destroy', as: 'signout'
  match 'loginstatus', to: 'sessions#index'

  scope "/api" do
    scope "/play" do
      post   "/"    => 'quiz_session#new',  format: 'json' 
      get    "/:id" => 'quiz_session#show', format: 'json'
      post   "/:id/answer" => 'quiz_session#answer', format: 'json'
    end
    scope "/quizzes" do
      get    "/"    => 'quiz#index',  format: 'json'
      post   "/"    => 'quiz#create', format: 'json'
      get    "/:id" => 'quiz#show',   format: 'json'
      post   "/:id" => 'quiz#update', format: 'json'
      delete "/:id" => 'quiz#destroy',format: 'json'
      
      scope  "/:quiz_id/questions" do
        get    "/"    => 'question#index',  format: 'json'
        post   "/"    => 'question#create', format: 'json'
        get    "/:id" => 'question#show',   format: 'json'
        post   "/:id" => 'question#update', format: 'json'
        delete "/:id" => 'question#destroy',format: 'json'
      end
    end
  end

  root to: "home#index"

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
