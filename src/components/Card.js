export default class Card {
  constructor(
    data,
    cardSelector,
    handleImageClick,
    handleDeleteCard,
    handleLikeButton
  ) {
    this.name = data.name;
    this.link = data.link;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this._cardID = data._id;
    this._handleDeleteCard = handleDeleteCard;
    this._handleLikeButton = handleLikeButton;
    this.isLiked = data.isLiked;
  }

  _setEventListeners() {
    this._likeButton = this._cardElement.querySelector(".card__like-button");
    this._deleteButton = this._cardElement.querySelector(
      ".card__delete-button"
    );
    if (this.isLiked) {
      this._likeButton.classList.add("card__like-button_active");
    }

    this._likeButton.addEventListener("click", (e) => {
      e.preventDefault();
      this._toggleLike();
    });

    this._deleteButton.addEventListener("click", () => {
      this._handleDeleteCard(this._cardID, this._cardElement);
    });

    this._cardImageEl.addEventListener("click", () => {
      this._handleImageClick(this.name, this.link);
    });
  }

  _toggleLike() {
    this._handleLikeButton(this._cardID, this.isLiked)
      .then((isLiked) => {
        this.isLiked = isLiked;
        this._updateLikeButton();
      })
      .catch((error) => console.error("Error toggling like:", error));
  }

  _updateLikeButton() {
    if (this.isLiked) {
      this._likeButton.classList.add("card__like-button_active");
    } else {
      this._likeButton.classList.remove("card__like-button_active");
    }
  }

  getView() {
    this._cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);
    this._cardImageEl = this._cardElement.querySelector(".card__image");
    this._cardTitleEl = this._cardElement.querySelector(".card__title");
    this._cardImageEl.src = this.link;
    this._cardImageEl.alt = this.name;
    this._cardTitleEl.textContent = this.name;
    this._setEventListeners();
    return this._cardElement;
  }
}
