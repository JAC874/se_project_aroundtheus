export default class Popup {
  constructor({ popupSelector }) {
    this._popupElement = document.querySelector(popupSelector);
    this._closeButton = this._popupElement.querySelector(".modal__close"); // Assuming the close button has this class
  }

  open() {
    this._popupElement.classList.add("modal_opened");
    this.setEventListeners();
  }

  close() {
    this._popupElement.classList.remove("modal_opened");
    this.removeEventListeners();
  }

  setEventListeners() {
    this._popupElement.addEventListener(
      "mousedown",
      this._handleOverlayClick.bind(this)
    );
    document.addEventListener("keydown", this._handleEscClose.bind(this));
    if (this._closeButton) {
      this._closeButton.addEventListener("click", this.close.bind(this));
    }
  }

  removeEventListeners() {
    this._popupElement.removeEventListener(
      "mousedown",
      this._handleOverlayClick.bind(this)
    );
    document.removeEventListener("keydown", this._handleEscClose.bind(this));
    if (this._closeButton) {
      this._closeButton.removeEventListener("click", this.close.bind(this));
    }
  }

  _handleOverlayClick(evt) {
    if (evt.target === evt.currentTarget) {
      this.close();
    }
  }

  _handleEscClose(evt) {
    if (evt.key === "Escape") {
      this.close();
    }
  }
}
