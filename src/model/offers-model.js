export default class OffersModel {
  #pointsApiService = null;
  #offers = [];
  #isLoadFailed = false;

  constructor({pointsApiService}) {
    this.#pointsApiService = pointsApiService;
  }

  get offers() {
    return this.#offers;
  }

  get isLoadFailed() {
    return this.#isLoadFailed;
  }

  async init() {
    try {
      const offers = await this.#pointsApiService.offers;
      this.#offers = offers;
      this.#isLoadFailed = false;
    } catch(err) {
      this.#offers = [];
      this.#isLoadFailed = true;
    }
  }
}
