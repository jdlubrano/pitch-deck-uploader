Rails.application.routes.draw do
  namespace :api do
    resources :pitch_decks, only: %i[index show create]
  end

  get "*any", to: 'home#index', constraints: lambda { |req|
    req.path.exclude? 'rails/active_storage'
  }

  root to: 'home#index'
end
