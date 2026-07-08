import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import InfoView from '../view/info-view.js';
import NoPointView from '../view/no-point-view.js';
import { createFilter } from '../mock/filter.js';
import { FilterType, SortType } from '../const.js';
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
  #pointListComponent = new PointListView();
  #infoComponent = null;
  #sortComponent = null;
  #filterComponent = null;
  #noPointComponent = null;

  #filterContainer = null;
  #eventContainer = null;
  #infoContainer = null;
  #pointsModel = null;

  #points = [];
  #destinations = [];
  #offers = [];
  #cities = [];
  #filters = [];

  #currentPointComponent = null;
  #currentEditComponent = null;
  #travelDates = {};
  #currentSortType = SortType.DAY;

  constructor({filterContainer, eventContainer, infoContainer, pointsModel}) {
    this.#filterContainer = filterContainer;
    this.#eventContainer = eventContainer;
    this.#infoContainer = infoContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    const { points, destinations, offers, cities } = this.#pointsModel;

    const sortedPoints = [...points].sort((a, b) =>
      new Date(a.dateFrom) - new Date(b.dateFrom)
    );

    const firstPoint = sortedPoints[0];
    const lastPoint = sortedPoints[sortedPoints.length - 1];

    this.#travelDates = {
      dateFrom: firstPoint.dateFrom,
      dateTo: lastPoint.dateTo
    };

    this.#points = sortedPoints;
    this.#destinations = [...destinations];
    this.#offers = [...offers];
    this.#cities = [...cities];
    this.#filters = createFilter(this.#points);

    this.#renderTripBoard();
  }

  #getTotalCost() {
    return this.#points.reduce((total, point) => {
      const { selectedOffers } = this.#preparePointData(point);
      const offersPrice = selectedOffers.reduce((sum, offer) => sum + offer.price, 0);
      return total + point.basePrice + offersPrice;
    }, 0);
  }

  #getCitiesForRoute() {
    const routeCities = this.#points
      .map((point) => {
        const destination = this.#destinations.find((dest) => dest.id === point.destination);
        return destination ? destination.name : '';
      })
      .filter(Boolean);

    const filteredCities = routeCities.filter((city, index, array) => {
      if (index === 0) {
        return true;
      }
      return city !== array[index - 1];
    });

    return filteredCities;
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

  #renderInfo() {
    this.#infoComponent = new InfoView({
      cities: this.#getCitiesForRoute(),
      travelDates: this.#travelDates,
      totalCost: this.#getTotalCost()
    });

    render(this.#infoComponent, this.#infoContainer, RenderPosition.AFTERBEGIN);
  }

  #renderSort() {
    this.#sortComponent = new SortView({ currentSortType: this.#currentSortType });

    render(this.#sortComponent, this.#eventContainer);
  }

  #renderList() {
    render(this.#pointListComponent, this.#eventContainer);
  }

  #renderFilter() {
    this.#filterComponent = new FilterView({ filters: this.#filters });

    render(this.#filterComponent, this.#filterContainer);
  }

  #renderNoPoints() {
    this.#noPointComponent = new NoPointView({ filterType: FilterType.EVERYTHING });

    render(this.#noPointComponent, this.#eventContainer);
  }

  #renderPoints() {
    this.#points.forEach((point)=> this.#renderPoint(point));
  }

  #renderTripBoard() {
    this.#renderFilter();

    if (!this.#points.length) {
      this.#renderNoPoints();
      return;
    }

    this.#renderInfo();
    this.#renderSort();
    this.#renderList();
    this.#renderPoints();
  }
}
