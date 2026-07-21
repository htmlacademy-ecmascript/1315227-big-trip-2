import { createMockDestinations } from '../mock/destination.js';

export default class DestinationsModel {
  #destinations = createMockDestinations();
  #cities = Array.from(new Set(this.#destinations.map((city)=> city.name)));

  get destinations() {
    return this.#destinations;
  }

  get cities() {
    return this.#cities;
  }
}
