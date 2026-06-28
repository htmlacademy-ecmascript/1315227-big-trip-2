import { TYPES, DateFormat } from '../const.js';
import { createElement } from '../render.js';
import { formatPointDate } from '../utils.js';

const createEventTypeItems = (currentType, id) => TYPES.map((type) => {
  const isChecked = type.toLowerCase() === currentType;

  return `<div class="event__type-item">
      <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type}-${id}">${type}</label>
    </div>`;
}).join('');

const createCitiesDatalist = (cities) => cities?.map((city)=> `<option value="${city}"></option>`).join('');

const createPictures = (pictures) => pictures.map((picture) => `<img class="event__photo" src="${picture?.src}" alt="${picture?.description}">`);

const createOffers = (allOffers, selectedOffers) => allOffers.map((offer) => {
  const { id, title, price } = offer;
  const isChecked = selectedOffers.some((selected) => selected.id === id);

  return `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-${id}" type="checkbox" name="event-offer-${title}" ${isChecked ? 'checked=""' : ''}>
  <label class="event__offer-label" for="event-offer-${title}-${id}">
    <span class="event__offer-title">${title}</span>
    +€&nbsp;
    <span class="event__offer-price">${price}</span>
  </label>
</div>`;
}).join('');

const createPointEditTemplate = (point, selectedOffers, destination, allOffers, isNewPoint, cities) => {
  const { basePrice, type, dateFrom, dateTo, id } = point;
  const { description, name, pictures } = destination;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
             ${createEventTypeItems(type?.toLowerCase(), id)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${name}" list="destination-list-${id}">
          <datalist id="destination-list-${id}">
            ${createCitiesDatalist(cities)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${formatPointDate(dateFrom, DateFormat.INPUT_DATE)} ${formatPointDate(dateFrom, DateFormat.TIME_ONLY)}">
          —
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${formatPointDate(dateTo, DateFormat.INPUT_DATE)} ${formatPointDate(dateTo, DateFormat.TIME_ONLY)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            €
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice ?? ''}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${isNewPoint ? 'Cancel' : 'Delete'}</button>
        ${isNewPoint ? '' : `<button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>`}
      </header>

      ${allOffers.length ? `<section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${createOffers(allOffers, selectedOffers)}
          </div>
        </section>` : ''}

        ${description ? `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>
        </section>` : ''}

        ${pictures.length ? `<div class="event__photos-container">
          <div class="event__photos-tape">
            ${createPictures(pictures).join('')}
          </div>
        </div>` : ''}
      </section>
    </form>
  </li>`;
};

export default class PointEditView {
  constructor({ point, selectedOffers, destination, allOffers, isNewPoint = false, cities }) {
    this.point = point;
    this.offers = selectedOffers;
    this.destination = destination;
    this.allOffers = allOffers;
    this.isNewPoint = isNewPoint;
    this.cities = cities;
  }

  getTemplate() {
    return createPointEditTemplate(this.point, this.offers, this.destination, this.allOffers, this.isNewPoint, this.cities);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
