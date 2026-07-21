import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import { UserAction, UpdateType } from '../const.js';
import { isDatesEqual, isOffersEqual } from '../utils/point.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #pointComponent = null;
  #pointEditComponent = null;
  #pointListContainer = null;

  #point = null;
  #destinations = [];
  #offers = [];
  #cities = [];
  #isNewPoint = false;
  #mode = Mode.DEFAULT;

  #handleDataChange = null;
  #handleModeChange = null;

  constructor({pointListContainer, onDataChange, onModeChange}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init({point, destinations, offers, cities, isNewPoint}) {
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#cities = cities;
    this.#isNewPoint = isNewPoint;

    this.#renderPoint();
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  #preparePointData(point) {
    const offerGroup = this.#offers.find((group) => group.type === point.type.toLowerCase());
    const selectedOffers = offerGroup?.offers?.filter((offer) =>
      point.offers.includes(offer.id)
    ) ?? [];

    const destination = this.#destinations.find(
      (dest) => dest.id === point.destination) ??
      { name: '', description: '', pictures: [] };

    return {
      selectedOffers,
      destination
    };
  }

  #renderPoint() {
    const { selectedOffers, destination } = this.#preparePointData(this.#point);

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      isNewPoint: this.#isNewPoint,
      cities: this.#cities,
      onFormSubmit: this.#handleFormSubmit,
      onCloseClick: this.#handleCloseClick,
      onDeleteClick: this.#handleDeleteClick
    });

    this.#pointComponent = new PointView({
      point: this.#point,
      selectedOffers,
      destination,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      if (this.#isNewPoint) {
        render(this.#pointComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
        return;
      }

      render(this.#pointComponent, this.#pointListContainer);

      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  #replacePointToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange(this.#point.id);
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    this.#pointEditComponent.resetState();
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #handleFormSubmit = (point) => {
    const isMinorUpdate =
      !isDatesEqual(this.#point.dateFrom, point.dateFrom) ||
      !isDatesEqual(this.#point.dateTo, point.dateTo) ||
      !isOffersEqual(this.#point.offers, point.offers) ||
      this.#point.basePrice !== point.basePrice;

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      point
    );

    this.#replaceFormToPoint();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {
        ...this.#point,
        isFavorite: !this.#point.isFavorite
      }
    );
  };

  #handleCloseClick = () => {
    this.#replaceFormToPoint();
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };
}
