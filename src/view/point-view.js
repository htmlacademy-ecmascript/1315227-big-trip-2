import he from 'he';
import AbstractView from '../framework/view/abstract-view.js';
import { formatPointDate, getDurationInPoint } from '../utils/point.js';
import { DateFormat } from '../const.js';

const createOffer = (offer) => {
  const { title, price } = offer;
  return `<li class="event__offer">
          <span class="event__offer-title">${he.encode(title)}</span>
          +€&nbsp;
          <span class="event__offer-price">${he.encode(String(price))}</span>
        </li>`;
};

const createPointTemplate = (point, selectedOffers, destination) => {
  const { basePrice, isFavorite, type, dateFrom, dateTo } = point;
  const { name } = destination;

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${formatPointDate(dateFrom, DateFormat.ISO_DATE)}">${formatPointDate(dateFrom, DateFormat.SHORT_DATE)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${he.encode(type)}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${he.encode(type)} ${he.encode(name)}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${formatPointDate(dateFrom, DateFormat.ISO_DATETIME_MINUTES)}">${formatPointDate(dateFrom, DateFormat.TIME_ONLY)}</time>
          —
          <time class="event__end-time" datetime="${formatPointDate(dateTo, DateFormat.ISO_DATETIME_MINUTES)}">${formatPointDate(dateTo, DateFormat.TIME_ONLY)}</time>
        </p>
        <p class="event__duration">${getDurationInPoint(dateFrom, dateTo)}</p>
      </div>
      <p class="event__price">
        €&nbsp;<span class="event__price-value">${he.encode(String(basePrice))}</span>
      </p>
      ${selectedOffers?.length ? `<h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">${selectedOffers.map((offer)=> createOffer(offer)).join('')}</ul>` : ''}
      <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class PointView extends AbstractView {
  #handleEditClick = null;
  #point = null;
  #selectedOffers = [];
  #destination = {};

  constructor({ point, selectedOffers, destination, onEditClick }) {
    super();
    this.#point = point;
    this.#selectedOffers = selectedOffers;
    this.#destination = destination;
    this.#handleEditClick = onEditClick;

    this.#setEventListeners();
  }

  get template() {
    return createPointTemplate(this.#point, this.#selectedOffers, this.#destination);
  }

  #setEventListeners() {
    const rollupButton = this.element.querySelector('.event__rollup-btn');

    if (rollupButton) {
      rollupButton.addEventListener('click', this.#editClickHandler);
    }
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
