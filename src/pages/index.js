import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import * as constants from "../utils/constants.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import "./index.css";

// Initialize the popup for image preview
const cardPreview = new PopupWithImage("#preview-image-modal");
cardPreview.setEventListeners();

function handleImageClick(name, link) {
  cardPreview.open({ name, link });
}

function createCard(cardData) {
  const cardElement = new Card(cardData, "#card-template", handleImageClick);
  return cardElement.getView();
}

// Initialize user information
const userInformation = new UserInfo({
  name: ".profile__title",
  description: ".profile__description",
});

// Initialize profile edit form
const profileEditForm = new PopupWithForm("#profile-edit-modal", (data) => {
  userInformation.setUserInfo({
    title: data.title,
    description: data.description,
  });
});
profileEditForm.setEventListeners();

// Add event listener for the profile edit button
constants.profileEditButton.addEventListener("click", () => {
  profileEditValidator.resetValidation();
  const userData = userInformation.getUserInfo();
  constants.profileTitleInput.value = userData.title;
  constants.profileDescriptionInput.value = userData.description.trim();
  profileEditForm.open();
});

// Initialize the add card form
const addCardForm = new PopupWithForm("#add-card-modal", (data) => {
  cardSection.addItem(createCard({ name: data.title, link: data.link }));
});
addCardForm.setEventListeners();

// Add event listener for the add card button
constants.addCardButton.addEventListener("click", () => {
  addCardForm.open();
  addCardValidator._disableButton();
});

// Initialize the card section and render initial cards
const cardSection = new Section(
  {
    renderer: (item) => {
      const cardElement = createCard(item);
      cardSection.addItem(cardElement);
    },
  },
  constants.cardListEl
);

cardSection.renderItems(constants.initialCards);

// Initialize form validators
const profileEditValidator = new FormValidator(
  constants.config,
  constants.profileEditForm
);
const addCardValidator = new FormValidator(
  constants.config,
  constants.addCardModal
);

profileEditValidator.enableValidation();
addCardValidator.enableValidation();
