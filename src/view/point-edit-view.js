import he from 'he';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { TYPES, DateFormat } from '../const.js';
import { formatPointDate, getOffersByType } from '../utils/point.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  id: '',
  basePrice: 0,
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'flight'
};

const DATEPICKER_CONFIG = {
  dateFormat: 'd/m/y H:i',
  enableTime: true,
  'time_24hr': true,
  locale: {firstDayOfWeek: 1}
};

const createEventTypeItems = (currentType, id) => TYPES.map((type) => {
  const isChecked = type.toLowerCase() === currentType;

  return `<div class="event__type-item">
      <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}" ${isChecked ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type}-${id}">${type}</label>
    </div>`;
}).join('');

const createCitiesDatalist = (cities) => cities?.map((city)=> `<option value="${city}"></option>`).join('');

const createPictures = (pictures) => pictures.map((picture) => `<img class="event__photo" src="${picture?.src ?? ''}" alt="${picture?.description ?? ''}">`);

const createOffers = (allOffers, selectedOffers) => allOffers.map((offer) => {
  const { id, title, price } = offer;
  const isChecked = selectedOffers.some((selected) => selected.id === id);

  return `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden"
    id="event-offer-${title}-${id}"
    data-offer-id="${id}"
    type="checkbox"
    name="event-offer-${title}" ${isChecked ? 'checked=""' : ''}>
  <label class="event__offer-label" for="event-offer-${title}-${id}">
    <span class="event__offer-title">${title}</span>
    +€&nbsp;
    <span class="event__offer-price">${he.encode(String(price))}</span>
  </label>
</div>`;
}).join('');

const createPointEditTemplate = (point, isNewPoint, cities) => {
  const { basePrice, type, dateFrom, dateTo, id, selectedOffers, allOffers, selectedDestination } = point;
  const { description, name, pictures } = selectedDestination;

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
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${he.encode(name)}" list="destination-list-${id}">
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
          <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${he.encode(String(basePrice !== 0 ? basePrice : ''))}">
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

export default class PointEditView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleCloseClick = null;
  #handleDeleteClick = null;
  #point = null;
  #isNewPoint = false;
  #cities = [];
  #allOffers = [];
  #allDestinations = [];
  #initialOffersByType = [];
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({point = BLANK_POINT, offers, destinations, isNewPoint = false, cities, onFormSubmit, onCloseClick, onDeleteClick}) {
    super();

    if (isNewPoint) {
      point = {
        ...point,
        dateFrom: new Date().toISOString(),
        dateTo: new Date().toISOString()
      };
    }

    this.#point = point;
    this.#allOffers = offers;
    this.#cities = cities;
    this.#allDestinations = destinations;
    this.#isNewPoint = isNewPoint;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseClick = onCloseClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#initialOffersByType = getOffersByType(point.type, offers);

    this._setState(PointEditView.parsePointToState(point, this.#initialOffersByType, destinations));

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate(this._state, this.#isNewPoint, this.#cities);
  }

  removeElement() {
    super.removeElement();

    this.#removeDatepicker();
  }

  resetState() {
    const newState = PointEditView.parsePointToState(
      this.#point,
      this.#initialOffersByType,
      this.#allDestinations
    );

    this.updateElement(newState);
  }

  _restoreHandlers() {
    this.#setEventListeners();
    this.#setDatepicker();
  }

  #removeDatepicker() {
    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  #setDatepicker() {
    const createDatepicker = (selector, onClose, additionalConfig = {}) => flatpickr(
      selector,
      {
        ...DATEPICKER_CONFIG,
        ...additionalConfig,
        onClose
      }
    );

    this.#datepickerFrom = createDatepicker(
      this.element.querySelector('[name="event-start-time"]'),
      this.#dateFromCloseHandler,
      {
        maxDate: this._state.dateTo,
        defaultDate: this._state.dateFrom
      }
    );

    this.#datepickerTo = createDatepicker(
      this.element.querySelector('[name="event-end-time"]'),
      this.#dateToCloseHandler,
      {
        minDate: this._state.dateFrom,
        defaultDate: this._state.dateTo
      }
    );
  }

  #setEventListeners() {
    const rollupButton = this.element.querySelector('.event__rollup-btn');
    const deleteButton = this.element.querySelector('.event__reset-btn');
    const form = this.element.querySelector('form');
    const priceInput = this.element.querySelector('.event__input--price');

    rollupButton?.addEventListener('click', this.#closeClickHandler);
    deleteButton?.addEventListener('click', this.#deleteClickHandler);
    priceInput?.addEventListener('input', this.#priceInputHandler);

    form.addEventListener('submit', this.#formSubmitHandler);
    form.addEventListener('change', this.#formChangeHandler);
  }

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseClick();
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(PointEditView.parseStateToPoint(this._state));
  };

  #formChangeHandler = (evt) => {
    if (evt.target.matches('input[name="event-type"]')) {
      const newType = evt.target.value;
      this.#handleTypeChange(newType);
    }

    if (evt.target.matches('.event__input--destination')) {
      this.#handleDestinationChange(evt.target.value);
    }

    if (evt.target.matches('.event__offer-checkbox')) {
      const offerId = evt.target.dataset.offerId;
      this.#handleOfferClick(evt.target, offerId);
    }
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #dateFromCloseHandler = ([dateFrom]) => {
    this.updateElement({
      dateFrom
    });
  };

  #dateToCloseHandler = ([dateTo]) => {
    this.updateElement({
      dateTo
    });
  };

  #handleTypeChange = (newType)=> {
    const newAllOffers = getOffersByType(newType, this.#allOffers);
    this.updateElement({
      type: newType,
      allOffers: newAllOffers,
      selectedOffers: [],
    });
  };

  #handleDestinationChange = (destinationName) => {
    const newDestination = this.#allDestinations.find(
      (dest) => dest.name === destinationName
    );

    if (newDestination) {
      this.updateElement({
        destination: newDestination.id,
        selectedDestination: newDestination
      });
    } else {
      this.updateElement({
        destination: '',
        selectedDestination: {
          name: destinationName,
          description: '',
          pictures: []
        }
      });
    }
  };

  #handleOfferClick = (input, offerId) => {
    const clickedOffer = this._state.allOffers.find((offer) => offer.id === offerId);

    if (!clickedOffer) {
      return;
    }

    let newSelectedOffers = [...this._state.selectedOffers];

    if (input.checked) {
      newSelectedOffers.push(clickedOffer);
    } else {
      newSelectedOffers = newSelectedOffers.filter((offer) => offer.id !== offerId);
    }

    this._setState({
      selectedOffers: newSelectedOffers
    });
  };

  #priceInputHandler = (evt) => {
    const value = evt.target.value;
    const cleanedValue = this.#sanitizePrice(value);

    evt.target.value = cleanedValue;

    this._setState({
      basePrice: Number(cleanedValue),
    });
  };

  #sanitizePrice = (input) => input.replace(/\D/g, '').replace(/^0+/, '');

  static parsePointToState(point, allOffers, destinations) {
    const selectedOffers = allOffers.filter((offer) => point.offers.includes(offer.id));

    const selectedDestination = destinations.find(
      (dest) => dest.id === point.destination) ??
      { name: '', description: '', pictures: [] };

    return {
      ...point,
      selectedOffers,
      selectedDestination,
      allOffers,
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };

    point.offers = point.selectedOffers.map((offer) => offer.id);

    delete point.selectedOffers;
    delete point.allOffers;
    delete point.selectedDestination;

    return point;
  }
}
