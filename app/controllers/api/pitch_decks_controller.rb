module Api
  class PitchDecksController < ApiController
    include ActiveStorage::SetCurrent

    rescue_from ActiveRecord::RecordNotFound  do |exception|
      render json: {code: :not_found, error: exception.message}, status: :not_found
    end

    def index
      @pitch_decks = PitchDeck.order(id: :desc).all
      render :index
    end

    def show
      @pitch_deck = PitchDeck.find(params[:id])
      render :show
    end

    def create
      result = CreatePitchDeck.call(name: pitch_deck_params[:name], file: pitch_deck_params[:file])

      if result.success?
        @pitch_deck = result.pitch_deck
        render :show, status: :created
      else
        error = {
          code: :pitch_deck_creation_failed,
          message: result.error
        }

        render json: {error: error}, status: :unprocessable_entity
      end
    end

    private

    def pitch_deck_params
      params.require(:pitch_deck).permit(:name, :file).tap do |p|
        p.require(:name)
        p.require(:file)
      end
    end
  end
end
