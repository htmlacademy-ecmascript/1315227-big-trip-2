import PointEditView from '../view/point-edit-view.js';
import { UserAction, UpdateType } from '../const.js';
import {remove, render, RenderPosition} from '../framework/render.js';

export default class NewPointPresenter {
  #pointEditComponent = null;
  #pointListContainer = null;
  #offersModel = null;
  #destinationsModel = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #isFormBlock = false;

  constructor({pointListContainer, offersModel, destinationsModel, onDataChange, onDestroy}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;

    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  get cities() {
    return this.#destinationsModel.cities;
  }

  init(pointListContainer) {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointListContainer = pointListContainer;

    this.#pointEditComponent = new PointEditView({
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      cities: this.cities,
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

  setSaving() {
    this.#isFormBlock = true;
    this.#pointEditComponent.updateElement({
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#isFormBlock = false;
      this.#pointEditComponent.updateElement({
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {...point},
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' && !this.#isFormBlock) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
