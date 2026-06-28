import { createMockDestinations } from '../mock/destination.js';
import { createMockOffers } from '../mock/offer.js';
import { createMockPoints } from '../mock/point.js';


export default class PointsModel {
  destinations = createMockDestinations();
  offers = createMockOffers();
  points = createMockPoints(this.destinations, this.offers);
  cities = Array.from(new Set(this.destinations.map((city)=> city.name)));

  getPoints() {
    return this.points;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }

  getCities() {
    return this.cities;
  }
}
