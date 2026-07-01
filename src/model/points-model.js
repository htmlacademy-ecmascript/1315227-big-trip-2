import { createMockDestinations } from '../mock/destination.js';
import { createMockOffers } from '../mock/offer.js';
import { createMockPoints } from '../mock/point.js';


export default class PointsModel {
  #destinations = createMockDestinations();
  #offers = createMockOffers();
  #points = createMockPoints(this.#destinations, this.#offers);
  #cities = Array.from(new Set(this.#destinations.map((city)=> city.name)));

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  get cities() {
    return this.#cities;
  }
}
