import { TYPES, PRICES, DESTINATION_COUNT, GroupOfferRandomRange } from '../const.js';
import { getRandomArrayElement, generateId, getRandomPointDates, getRandomInt } from '../utils.js';

const createPoint = (destinations, offers) => {
  const type = getRandomArrayElement(TYPES);
  const offerGroup = offers.find((group) => group.type === type.toLowerCase());
  const { dateFrom, dateTo } = getRandomPointDates();

  return {
    id: generateId(),
    basePrice: getRandomArrayElement(PRICES),
    dateFrom,
    dateTo,
    destination: destinations.length ? getRandomArrayElement(destinations).id : '',
    isFavorite: Boolean(Math.round(Math.random())),
    offers: offerGroup?.offers?.length ? Array.from({length: getRandomInt(GroupOfferRandomRange.MIN, GroupOfferRandomRange.MAX)}, ()=> getRandomArrayElement(offerGroup.offers).id) : [],
    type
  };
};

const createMockPoints = (mockDestinations, mockOffers) => Array.from({length: DESTINATION_COUNT}, ()=> createPoint(mockDestinations, mockOffers));

export { createMockPoints };
