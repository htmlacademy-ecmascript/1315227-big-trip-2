import AbstractView from '../framework/view/abstract-view.js';
import { formatPointDate } from '../utils/point.js';
import { DateFormat } from '../const.js';

const MAX_NAMES_OF_CITIES = 3;

const formatCities = (cities) => {
  if (cities.length <= MAX_NAMES_OF_CITIES) {
    return cities.join(' &mdash; ');
  } else {
    const firstCityName = cities[0];
    const lastCityName = cities[cities.length - 1];

    return `${firstCityName} &mdash; ... &mdash; ${lastCityName}`;
  }
};

const createInfoTemplate = (cities, travelDates, totalCost) => {
  const { dateFrom, dateTo } = travelDates;
  const formatDates = dateFrom === dateTo ? formatPointDate(dateFrom, DateFormat.DAY_MONTH) : `${formatPointDate(dateFrom, DateFormat.DAY_MONTH)}&nbsp;—&nbsp;${formatPointDate(dateTo, DateFormat.DAY_MONTH)}`;

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${formatCities(cities)}</h1>

      <p class="trip-info__dates">${formatDates}</p>
    </div>

    <p class="trip-info__cost">
      Total: €&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>
  </section>`;
};

export default class InfoView extends AbstractView {
  #cities = [];
  #travelDates = {};
  #totalCost = 0;

  constructor({cities, travelDates, totalCost}) {
    super();
    this.#cities = cities;
    this.#travelDates = travelDates;
    this.#totalCost = totalCost;
  }

  get template() {
    return createInfoTemplate(this.#cities, this.#travelDates, this.#totalCost);
  }
}
