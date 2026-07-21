import PointEditView from '../view/point-edit-view.js';
import { UserAction, UpdateType } from '../const.js';
import { generateId } from '../utils/point.js';
import {remove, render, RenderPosition} from '../framework/render.js';

export default class NewPointPresenter {
  #pointEditComponent = null;
  #pointListContainer = null;
  #offersModel = null;
  #destinationsModel = null;
  #handleDataChange = null;
  #handleDestroy = null;

  constructor({pointListContainer, offersModel, destinationsModel, onDataChange, onDestroy}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;

    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new PointEditView({
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      isNewPoint: true,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {
        ...point,
        id: generateId(),
      },
    );

    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
