import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import * as constants from "../utils/constants.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import "../pages/index.css";

const cardPreview = new PopupWithImage("#preview-image-modal");
cardPreview.setEventListeners();

function handleImageClick(name, link) {
  cardPreview.open({ name, link });
}

function createCard(cardData) {
  const cardElement = new Card(cardData, "#card-template", handleImageClick);
  return cardElement.getView();
}

const userInformation = new UserInfo({
  name: ".profile__title",
  description: ".profile__description",
});

const profileEditForm = new PopupWithForm("#profile-edit-modal", (data) => {
  // console.log("Form data", data);
  userInformation.setUserInfo({
    title: data.title,
    description: data.description,
  });
});
profileEditForm.setEventListeners();
constants.profileEditButton.addEventListener("click", () => {
  editProfileFormValidator.resetValidation();
  const userData = userInformation.getUserInfo();
  constants.profileTitleInput.value = userData.title;
  constants.profileDescriptionInput.value = userData.description.trim();

  profileEditForm.open();
});

const addCardForm = new PopupWithForm("#add-card-modal", (data) => {
  cardSection.addItem(createCard(data));
});
addCardForm.setEventListeners();
constants.addCardButton.addEventListener("click", () => {
  addCardForm.open();
  addCardFormValidator.resetValidation();
});

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

const editProfileFormValidator = new FormValidator(
  constants.config,
  constants.profileEditForm
);
const addCardFormValidator = new FormValidator(
  constants.config,
  constants.addCardModal
);

//FORM FUNCTIONS

// function handleProfileEditSubmit(evt) {
//   evt.preventDefault();
//   profileTitle.textContent = profileTitleInput.value;
//   profileDescription.textContent = profileDescriptionInput.value;
//   closeModal(profileEditModal);
// }

// function handleAddCardSubmit(evt) {
//   evt.preventDefault();
//   const name = evt.target.title.value;
//   const link = evt.target.link.value;
//   renderCard({ name, link });
//   evt.target.reset();
//   closeModal(addCardModal);
//   addCardValidator.disableButton();
// }

// function handleImageClick(cardData) {
//   previewImageElement.src = cardData.link;
//   previewImageElement.alt = cardData.name + " " + "Image";
//   previewCaption.textContent = cardData.name;
//   openModal(previewImageModal);
// }

// initialCards.forEach((cardData) => {
//   cardListEl.prepend(getCardElement(cardData));
// });

/* -------------------------------------------------------------------------- */
/*                               EVENT LISTENERS                              */
/* -------------------------------------------------------------------------- */

// profileEditForm.addEventListener("submit", handleProfileEditSubmit);
// addCardForm.addEventListener("submit", handleAddCardSubmit);

// addCardButton.addEventListener("click", () => {
//   openModal(addCardModal);
// });

//Open and close Modal Functions

// const closeButtons = document.querySelectorAll(".modal__close");
// closeButtons.forEach((button) => {
//   const popup = button.closest(".modal");
//   button.addEventListener("click", () => closeModal(popup));
// });

// function closeModalOverlay(evt) {
//   if (evt.target === evt.currentTarget) {
//     closeModal(evt.currentTarget);
//   }
// }

// function closeModalEscape(evt) {
//   if (evt.key === "Escape") {
//     const modalOpened = document.querySelector(".modal_opened");
//     closeModal(modalOpened);
//   }
// }

// function openModal(modal) {
//   modal.classList.add("modal_opened");
//   document.addEventListener("keydown", closeModalEscape);
//   modal.addEventListener("mousedown", closeModalOverlay);
// }

// function closeModal(modal) {
//   modal.classList.remove("modal_opened");
//   document.removeEventListener("keydown", closeModalEscape);
//   modal.removeEventListener("mousedown", closeModalOverlay);
// }

// const config = {
//   formSelector: ".modal__form",
//   inputSelector: ".modal__input",
//   submitButtonSelector: ".modal__edit-save-button",
//   inactiveButtonClass: "modal__edit-save-button_disabled",
//   inputErrorClass: "modal__input_type_error",
//   errorClass: "modal__error_visible",
// };

// const profileEditValidator = new FormValidator(config, profileEditForm);
// const addCardValidator = new FormValidator(config, addCardForm);

profileEditValidator.enableValidation();
addCardValidator.enableValidation();

// function getCardElement(cardData) {
//   const card = new Card(cardData, "#card-template", handleImageClick);
//   const cardElement = card.getView();
//   return cardElement;
// }
