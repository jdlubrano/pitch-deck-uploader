Rails.application.routes.draw do
  match "*any", via: :get, to: 'home#index'
  root to: 'home#index'
end
