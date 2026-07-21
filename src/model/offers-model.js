import { createMockOffers } from '../mock/offer.js';

export default class OffersModel {
  #offers = createMockOffers();

  get offers() {
    return this.#offers;
  }
}
