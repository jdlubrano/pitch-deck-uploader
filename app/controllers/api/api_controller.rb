module Api
  class ApiController < ActionController::API
    rescue_from ActionController::ParameterMissing do |e|
      error = {
        code: :parameter_missing,
        message: "Missing #{e.param} parameter"
      }
      render json: {error: error}, status: :bad_request
    end
  end
end
