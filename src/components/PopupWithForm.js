import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super({ popupSelector });
    this._popupForm = this._popupElement.querySelector(".modal__form");
    this._handleFormSubmit = handleFormSubmit;
  }

  open() {
    super.open();
  }

  _getInputValues() {
    const input = this._popupElement.querySelectorAll(".modal__input");
    const inputItems = {};

    input.forEach(({ name, value }) => {
      inputItems[name] = value;
    });
    return inputItems;
  }

  setEventListeners() {
    this._popupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this._handleFormSubmit(this._getInputValues());
      this._popupForm.reset();
      this.close();
    });
    super.setEventListeners();
  }
}
