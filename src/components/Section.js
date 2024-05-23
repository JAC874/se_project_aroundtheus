import { cardListEl } from "../utils/constants";

export default class Section {
  constructor({ renderer }, containerSelector) {
    this._renderer = renderer;
    // this._containerSelector = ".cardListEl";
    this._container = document.querySelector(containerSelector);
  }

  renderItems(items) {
    items.forEach((item) => {
      this._renderer(item);
    });
  }

  addItem(element) {
    this._container.prepend(element);
  }
}
