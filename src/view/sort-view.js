import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const SORT_TYPES = [
  {
    type: SortType.DAY,
    label: 'Day',
    disabled: false,
    dataAttribute: true
  },
  {
    type: SortType.EVENT,
    label: 'Event',
    disabled: true,
    dataAttribute: false
  },
  {
    type: SortType.TIME,
    label: 'Time',
    disabled: false,
    dataAttribute: true
  },
  {
    type: SortType.PRICE,
    label: 'Price',
    disabled: false,
    dataAttribute: true
  },
  {
    type: SortType.OFFER,
    label: 'Offers',
    disabled: true,
    dataAttribute: false
  }
];

const createSortTemplate = (currentSortType) => `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${SORT_TYPES.map((item) => `
      <div class="trip-sort__item  trip-sort__item--${item.type}">
        <input id="sort-${item.type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${item.type}"
          ${item.dataAttribute ? `data-sort-type="${item.type}"` : ''}
          ${item.disabled ? 'disabled' : ''}
          ${currentSortType === item.type ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-${item.type}">${item.label}</label>
      </div>
    `).join('')}
  </form>`;

export default class SortView extends AbstractView {
  #currentSortType = null;
  #handleSortTypeChange = null;

  constructor({currentSortType, onSortChange}) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortChange;

    this.#setEventListeners();
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #setEventListeners() {
    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const currentSortType = evt.target.dataset.sortType;
    this.#handleSortTypeChange(currentSortType);
  };
}
