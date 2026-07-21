import { TYPES } from '../const.js';
import { getRandomArrayElement } from '../utils/common.js';

const OFFER_IDS_BY_TYPE = {
  taxi: ['offer-taxi-1', 'offer-taxi-2'],
  bus: ['offer-bus-1'],
  train: ['offer-train-1', 'offer-train-2', 'offer-train-3'],
  ship: ['offer-ship-1'],
  drive: ['offer-drive-1'],
  flight: ['offer-flight-1', 'offer-flight-2'],
  'check-in': [''],
  sightseeing: [''],
  restaurant: ['offer-restaurant-1', 'offer-restaurant-2']
};

const OFFER_TITLES = [
  'Add luggage',
  'Upgrade to a business class',
  'Add breakfast',
  'Lunch in city',
  'Book tickets'
];

const OFFER_PRICES = [120, 100, 90, 80];

const createMockOffers = () => TYPES.map((type) => ({
  type: type.toLowerCase(),
  offers: OFFER_IDS_BY_TYPE[type.toLowerCase()].map((id) => ({
    id,
    title: getRandomArrayElement(OFFER_TITLES),
    price: getRandomArrayElement(OFFER_PRICES),
  }))
}));

export { createMockOffers, OFFER_IDS_BY_TYPE };
