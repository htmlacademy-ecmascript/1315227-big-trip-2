import AbstractView from '../framework/view/abstract-view.js';
import { SORT_TYPES } from '../const.js';

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

  constructor({currentSortType}) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }
}
