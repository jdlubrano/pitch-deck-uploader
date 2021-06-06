Rails.application.routes.draw do
  namespace :api do
    resources :pitch_decks, only: %i[create]
  end

  match "*any", via: :get, to: 'home#index'
  root to: 'home#index'
end
