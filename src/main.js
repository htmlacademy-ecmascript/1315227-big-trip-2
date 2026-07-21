import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

const addPointButton = document.querySelector('.trip-main__event-add-btn');
const filterContainer = document.querySelector('.trip-controls__filters');
const eventContainer = document.querySelector('.trip-events');
const infoContainer = document.querySelector('.trip-main');
const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();

const handleNewPointFormClose = ()=> {
  addPointButton.disabled = false;
};

const filterPresenter = new FilterPresenter({
  filterModel,
  pointsModel,
  filterContainer
});

const tripPresenter = new TripPresenter({
  filterContainer,
  eventContainer,
  infoContainer,
  pointsModel,
  destinationsModel,
  offersModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const handleNewPointButtonClick = ()=> {
  tripPresenter.createPoint();
  addPointButton.disabled = true;
};

addPointButton.addEventListener('click', handleNewPointButtonClick);

tripPresenter.init();
filterPresenter.init();
