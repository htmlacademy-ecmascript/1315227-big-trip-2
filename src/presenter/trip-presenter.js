import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import InfoView from '../view/info-view.js';
import { render, RenderPosition } from '../render.js';

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
  filterComponent = new FilterView();
  sortComponent = new SortView();
  pointListComponent = new PointListView();
  infoComponent = new InfoView();

  constructor({filterContainer, eventContainer, infoContainer, pointsModel}) {
    this.filterContainer = filterContainer;
    this.eventContainer = eventContainer;
    this.infoContainer = infoContainer;
    this.pointsModel = pointsModel;
  }

  preparePointData(point = BLANK_POINT) {
    const offerGroup = this.offers.find((group) => group.type === point.type.toLowerCase());
    const selectedOffers = offerGroup?.offers?.filter((offer) =>
      point.offers.includes(offer.id)
    ) ?? [];
    const allOffers = offerGroup?.offers ?? [];
    const destination = this.destinations.find(
      (dest) => dest.id === point.destination) ??
      { name: '', description: '', pictures: [] };

    return {
      point,
      selectedOffers,
      destination,
      allOffers
    };
  }

  renderEditForm() {
    const { point, selectedOffers, destination, allOffers } = this.preparePointData(this.points[0]);

    render(new PointEditView({
      point,
      selectedOffers,
      destination,
      allOffers,
      isNewPoint: false,
      cities: this.cities
    }), this.pointListComponent.getElement());
  }

  renderPoints() {
    for (const point of this.points.slice(1)) {
      const { selectedOffers, destination } = this.preparePointData(point);

      render(new PointView({
        point,
        selectedOffers,
        destination
      }), this.pointListComponent.getElement());
    }
  }

  init() {
    this.points = [...this.pointsModel.getPoints()];
    this.destinations = [...this.pointsModel.getDestinations()];
    this.offers = [...this.pointsModel.getOffers()];
    this.cities = [...this.pointsModel.getCities()];

    render(this.infoComponent, this.infoContainer, RenderPosition.AFTERBEGIN);
    render(this.filterComponent, this.filterContainer);
    render(this.sortComponent, this.eventContainer);
    render(this.pointListComponent, this.eventContainer);

    this.renderEditForm();
    this.renderPoints();
  }
}
