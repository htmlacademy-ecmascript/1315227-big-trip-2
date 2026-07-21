import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import InfoView from '../view/info-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { sortPointPrice, sortPointTime, sortPointDay } from '../utils/point.js';
import { filter } from '../utils/filter.js';
import { FilterType, SortType, UpdateType, UserAction } from '../const.js';
import { render, remove, RenderPosition } from '../framework/render.js';

export default class TripPresenter {
  #pointListComponent = new PointListView();
  #infoComponent = null;
  #sortComponent = null;
  #noPointComponent = null;
  #pointPresenters = new Map();
  #newPointPresenter = null;

  #eventContainer = null;
  #infoContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;
  #filters = [];
  #filterType = FilterType.EVERYTHING;

  #travelDates = {};
  #currentSortType = SortType.DAY;

  constructor({eventContainer, infoContainer, pointsModel, destinationsModel, offersModel, filterModel, onNewPointDestroy}) {
    this.#eventContainer = eventContainer;
    this.#infoContainer = infoContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortPointPrice);
      case SortType.TIME:
        return filteredPoints.sort(sortPointTime);
    }

    return filteredPoints.sort(sortPointDay);
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  get cities() {
    return this.#destinationsModel.cities;
  }

  get offers() {
    return this.#offersModel.offers;
  }

  init() {
    this.#renderTripBoard();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #getTotalCost() {
    return this.points.reduce((total, point) => {
      const offerGroup = this.offers.find((group) => group.type === point.type.toLowerCase());
      const selectedOffers = offerGroup?.offers?.filter((offer) => point.offers.includes(offer.id)) ?? [];
      const offersPrice = selectedOffers.reduce((sum, offer) => sum + offer.price, 0);
      return total + point.basePrice + offersPrice;
    }, 0);
  }

  #getCitiesForRoute(points) {
    const routeCities = points
      .map((point) => {
        const destination = this.destinations.find((dest) => dest.id === point.destination);
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

  #renderInfo() {
    const sortedByDay = [...this.#pointsModel.points].sort(sortPointDay);
    const firstPoint = sortedByDay[0];
    const lastPoint = sortedByDay[sortedByDay.length - 1];

    this.#travelDates = {
      dateFrom: firstPoint.dateFrom,
      dateTo: lastPoint.dateTo
    };

    this.#infoComponent = new InfoView({
      cities: this.#getCitiesForRoute(sortedByDay),
      travelDates: this.#travelDates,
      totalCost: this.#getTotalCost()
    });

    render(this.#infoComponent, this.#infoContainer, RenderPosition.AFTERBEGIN);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#eventContainer);
  }

  #renderNoPoints() {
    this.#noPointComponent = new NoPointView({ filterType: this.#filterType });

    render(this.#noPointComponent, this.#eventContainer);
  }

  #renderPoint(point, isNewPoint = false) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init({
      point,
      destinations: this.destinations,
      offers: this.offers,
      cities: this.cities,
      isNewPoint
    });

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    render(this.#pointListComponent, this.#eventContainer);
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #renderTripBoard() {

    if (!this.points.length) {
      this.#renderNoPoints();
      return;
    }

    this.#renderInfo();
    this.#renderSort();
    this.#renderPoints();
  }

  #clearTripBoard({ resetSortType = false } = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#noPointComponent);
    remove(this.#infoComponent);
    remove(this.#sortComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init({
          point: data,
          destinations: this.destinations,
          offers: this.offers,
          cities: this.cities
        });
        break;
      case UpdateType.MINOR:
        this.#clearTripBoard();
        this.#renderTripBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearTripBoard({resetSortType: true});
        this.#renderTripBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearTripBoard();
    this.#renderTripBoard();
  };
}
