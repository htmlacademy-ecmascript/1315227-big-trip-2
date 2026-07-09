import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import InfoView from '../view/info-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import { createFilter } from '../mock/filter.js';
import { updateItem } from '../utils/common.js';
import { sortPointPrice, sortPointTime, sortPointDay } from '../utils/point.js';
import { FilterType, SortType } from '../const.js';
import { render, RenderPosition } from '../framework/render.js';

export default class TripPresenter {
  #pointListComponent = new PointListView();
  #infoComponent = null;
  #sortComponent = null;
  #filterComponent = null;
  #noPointComponent = null;
  #pointPresenters = new Map();

  #filterContainer = null;
  #eventContainer = null;
  #infoContainer = null;
  #pointsModel = null;

  #points = [];
  #destinations = [];
  #offers = [];
  #cities = [];
  #filters = [];

  #travelDates = {};
  #currentSortType = SortType.DAY;
  #sourcedPoints = [];

  constructor({filterContainer, eventContainer, infoContainer, pointsModel}) {
    this.#filterContainer = filterContainer;
    this.#eventContainer = eventContainer;
    this.#infoContainer = infoContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    const { points, destinations, offers, cities } = this.#pointsModel;

    const sortedPointsByDay = [...points].sort(sortPointDay);

    const firstPoint = sortedPointsByDay[0];
    const lastPoint = sortedPointsByDay[sortedPointsByDay.length - 1];

    this.#travelDates = {
      dateFrom: firstPoint.dateFrom,
      dateTo: lastPoint.dateTo
    };

    this.#points = [...sortedPointsByDay];
    this.#destinations = [...destinations];
    this.#offers = [...offers];
    this.#cities = [...cities];
    this.#filters = createFilter(this.#points);

    this.#sourcedPoints = [...sortedPointsByDay];

    this.#renderTripBoard();
  }

  #getTotalCost() {
    return this.#points.reduce((total, point) => {
      const offerGroup = this.#offers.find((group) => group.type === point.type.toLowerCase());
      const selectedOffers = offerGroup?.offers?.filter((offer) => point.offers.includes(offer.id)) ?? [];
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

  #renderInfo() {
    this.#infoComponent = new InfoView({
      cities: this.#getCitiesForRoute(),
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

  #renderFilter() {
    this.#filterComponent = new FilterView({ filters: this.#filters });

    render(this.#filterComponent, this.#filterContainer);
  }

  #renderNoPoints() {
    this.#noPointComponent = new NoPointView({ filterType: FilterType.EVERYTHING });

    render(this.#noPointComponent, this.#eventContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point, this.#destinations, this.#offers, this.#cities);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderPoints() {
    render(this.#pointListComponent, this.#eventContainer);
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
    this.#renderPoints();
  }

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.PRICE:
        this.#points.sort(sortPointPrice);
        break;
      case SortType.TIME:
        this.#points.sort(sortPointTime);
        break;
      default:
        this.#points = [...this.#sourcedPoints];
    }

    this.#currentSortType = sortType;
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#sourcedPoints = updateItem(this.#sourcedPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = ()=> {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPoints();
    this.#renderPoints();
  };
}
