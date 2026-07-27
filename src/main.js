import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic hS2sfS44wcl1sa2j';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const addPointButton = document.querySelector('.trip-main__event-add-btn');
const filterContainer = document.querySelector('.trip-controls__filters');
const eventContainer = document.querySelector('.trip-events');
const infoContainer = document.querySelector('.trip-main');
const filterModel = new FilterModel();

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});

const destinationsModel = new DestinationsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});

const offersModel = new OffersModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});

const handleNewPointFormClose = ()=> {
  addPointButton.disabled = false;
};

addPointButton.disabled = true;

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

const startApp = async () => {
  await Promise.all([
    destinationsModel.init(),
    offersModel.init()
  ]);

  pointsModel.init().then(() => {
    if (
      !pointsModel.isLoadFailed &&
      !destinationsModel.isLoadFailed &&
      !offersModel.isLoadFailed
    ) {
      addPointButton.disabled = false;
    }
  });

  tripPresenter.init();
  filterPresenter.init();
};

startApp();
