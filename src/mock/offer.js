import { OFFER_TITLES, OFFER_PRICES, TYPES, OfferRandomRange } from '../const.js';
import { getRandomArrayElement, generateId, getRandomInt } from '../utils.js';

const createOffer = () => ({
  id: generateId(),
  title: getRandomArrayElement(OFFER_TITLES),
  price: getRandomArrayElement(OFFER_PRICES),
});

const createMockOffers = () => TYPES.map((type) => ({
  type: type.toLowerCase(),
  offers: Array.from({ length: getRandomInt(OfferRandomRange.MIN, OfferRandomRange.MAX) }, createOffer)
}));

export { createMockOffers };
