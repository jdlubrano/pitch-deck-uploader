require 'spec_helper'

ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../config/environment', __dir__)

abort("The Rails environment is running in production mode!") if Rails.env.production?
require 'rspec/rails'

# Add additional requires below this line. Rails is not loaded until this point!
require "capybara/rspec"
require "webdrivers/chromedriver"

Webdrivers.cache_time = 24.hours

Dir[Rails.root.join('spec', 'support', '**', '*.rb')].sort.each { |f| require f }

begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  puts e.to_s.strip
  exit 1
end

RSpec.configure do |config|
  config.use_transactional_fixtures = true
  config.infer_spec_type_from_file_location!
  config.filter_rails_from_backtrace!

  config.include ResponseHelpers, type: :request

  config.before(:suite) do
    FactoryBot.lint
  ensure
    PitchDeckPreview.destroy_all
    PitchDeck.destroy_all
  end

  config.after(:suite) do
    FileUtils.rm_rf(ActiveStorage::Blob.service.root)
  end
end

Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :rspec
    with.library :rails
  end
end

Capybara.javascript_driver = :selenium_headless
