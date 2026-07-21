import { TYPES } from '../const.js';
import { DESTINATION_IDS } from '../mock/destination.js';
import { OFFER_IDS_BY_TYPE } from '../mock/offer.js';
import { generateId } from '../utils/point.js';
import { getRandomArrayElement } from '../utils/common.js';

const PRICES = [1100, 2300, 2100, 900, 450];
const DESTINATION_COUNT = 10;

const DurationRange = {
  MIN_HOURS: 1,
  MAX_HOURS: 72
};

const DateRange = {
  MIN: '2019-07-10T22:55:56.845Z',
  MAX: '2019-12-11T11:22:13.375Z'
};

const getRandomDateInRange = (minDate, maxDate) => {
  const min = new Date(minDate).getTime();
  const max = new Date(maxDate).getTime();
  return new Date(min + Math.random() * (max - min));
};

const getRandomPointDates = () => {
  const dateFrom = getRandomDateInRange(DateRange.MIN, DateRange.MAX);
  const durationMs = (DurationRange.MIN_HOURS + Math.random() * (DurationRange.MAX_HOURS - DurationRange.MIN_HOURS)) * 60 * 60 * 1000;
  const dateTo = new Date(dateFrom.getTime() + durationMs);

  return {
    dateFrom: dateFrom.toISOString(),
    dateTo: dateTo.toISOString()
  };
};

const createPoint = () => {
  const type = getRandomArrayElement(TYPES);
  const { dateFrom, dateTo } = getRandomPointDates();

  return {
    id: generateId(),
    basePrice: getRandomArrayElement(PRICES),
    dateFrom,
    dateTo,
    destination: getRandomArrayElement(DESTINATION_IDS),
    isFavorite: Boolean(Math.round(Math.random())),
    offers: [getRandomArrayElement(OFFER_IDS_BY_TYPE[type.toLowerCase()])],
    type
  };
};

const createMockPoints = () => Array.from({length: DESTINATION_COUNT}, ()=> createPoint());

export { createMockPoints };
