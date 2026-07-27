export default class DestinationsModel {
  #pointsApiService = null;
  #destinations = [];
  #isLoadFailed = false;

  constructor({pointsApiService}) {
    this.#pointsApiService = pointsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  get cities() {
    return Array.from(new Set(this.#destinations.map((city) => city.name)));
  }

  get isLoadFailed() {
    return this.#isLoadFailed;
  }

  async init() {
    try {
      const destinations = await this.#pointsApiService.destinations;
      this.#destinations = destinations;
      this.#isLoadFailed = false;
    } catch(err) {
      this.#destinations = [];
      this.#isLoadFailed = true;
    }
  }
}
