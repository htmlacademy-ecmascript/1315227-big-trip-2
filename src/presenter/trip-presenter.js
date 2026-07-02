import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import InfoView from '../view/info-view.js';
import NoPointView from '../view/no-point-view.js';
import { render, replace, RenderPosition } from '../framework/render.js';

const BLANK_POINT = {
  id: '',
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'flight'
};

export default class TripPresenter {
  #filterComponent = new FilterView();
  #sortComponent = new SortView();
  #pointListComponent = new PointListView();
  #infoComponent = new InfoView();
  #noPointComponent = new NoPointView();

  #filterContainer = null;
  #eventContainer = null;
  #infoContainer = null;
  #pointsModel = null;

  #points = [];
  #destinations = [];
  #offers = [];
  #cities = [];

  #currentPointComponent = null;
  #currentEditComponent = null;

  constructor({filterContainer, eventContainer, infoContainer, pointsModel}) {
    this.#filterContainer = filterContainer;
    this.#eventContainer = eventContainer;
    this.#infoContainer = infoContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    const { points, destinations, offers, cities } = this.#pointsModel;

    this.#points = [...points];
    this.#destinations = [...destinations];
    this.#offers = [...offers];
    this.#cities = [...cities];

    this.#renderTripBoard();
  }

  #preparePointData(point = BLANK_POINT) {
    const offerGroup = this.#offers.find((group) => group.type === point.type.toLowerCase());
    const selectedOffers = offerGroup?.offers?.filter((offer) =>
      point.offers.includes(offer.id)
    ) ?? [];
    const allOffers = offerGroup?.offers ?? [];
    const destination = this.#destinations.find(
      (dest) => dest.id === point.destination) ??
      { name: '', description: '', pictures: [] };

    return {
      selectedOffers,
      destination,
      allOffers
    };
  }

  #closeEditForm() {
    if (!this.#currentEditComponent) {
      return;
    }

    replace(this.#currentPointComponent, this.#currentEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    this.#currentPointComponent = null;
    this.#currentEditComponent = null;
  }

  #openEditForm(pointComponent, pointEditComponent) {
    this.#closeEditForm();

    this.#currentPointComponent = pointComponent;
    this.#currentEditComponent = pointEditComponent;

    replace(pointEditComponent, pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#closeEditForm();
    }
  };

  #renderPoint(point) {
    const { selectedOffers, destination, allOffers } = this.#preparePointData(point);

    const pointEditComponent = new PointEditView({
      point,
      selectedOffers,
      destination,
      allOffers,
      isNewPoint: false,
      cities: this.#cities,
      onFormSubmit: () => {
        this.#closeEditForm();
      },
      onCloseClick: () => {
        this.#closeEditForm();
      }
    });

    const pointComponent = new PointView({
      point,
      selectedOffers,
      destination,
      onEditClick: () => {
        this.#openEditForm(pointComponent, pointEditComponent);
      }
    });

    render(pointComponent, this.#pointListComponent.element);

  }

  #renderTripBoard() {
    render(this.#filterComponent, this.#filterContainer);

    if (!this.#points.length) {
      render(this.#noPointComponent, this.#eventContainer);
      return;
    }

    render(this.#infoComponent, this.#infoContainer, RenderPosition.AFTERBEGIN);
    render(this.#sortComponent, this.#eventContainer);
    render(this.#pointListComponent, this.#eventContainer);

    for (const point of this.#points) {
      this.#renderPoint(point);
    }
  }
}
