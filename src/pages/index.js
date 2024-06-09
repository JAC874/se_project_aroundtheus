/* ------------------------------ import ----------------------------- */
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import * as constants from "../utils/constants.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import "./index.css";
import Api from "../components/Api.js";

// API
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "9a777070-bbf5-4087-b884-1d339f3ca3e4",
    "content-type": "application/json",
  },
});

let cardSection;
api
  .getInitialCards()
  .then((cardData) => {
    cardSection = new Section(
      {
        items: cardData,
        renderer: (cardData) => {
          const cardElement = createCard(cardData);
          cardSection.addItem(cardElement);
        },
      },
      ".cards__list"
    );
    cardSection.renderItems();
    console.log(cardData);
  })
  .catch((err) => console.error(err));

// CREATE CARD SECTION AND RENDER CARDS
// const cardSection = new Section(
//   {
//     renderer: (item) => {
//       const cardElement = createCard(item);
//       cardSection.addItem(cardElement);
//     },
//   },
//   constants.cardListEl
// );

// cardSection.renderItems(constants.initialCards);

function createCard(cardData) {
  const card = new Card(
    cardData,
    "#card-template",
    handleImageClick,
    handleDeleteCard,
    handleLikeButton
  );
  const cardElement = card.getView();
  return cardElement;
}

// ADD NEW CARD FORM
function handleAddCardFormSubmit(data) {
  const cardData = { name: data.name, link: data.link };
  api
    .addCard(data.name, data.link)
    .then((data) => {
      const cardElement = createCard(data);
      cardSection.addItem(cardElement);
      addCardForm.close();
      addCardForm.reset();
      // addCardValidator.handleDisableButton();
    })
    .catch((error) => {
      console.error("Error adding card:", error);
    });
}

const addCardForm = new PopupWithForm(
  "#add-card-modal",
  handleAddCardFormSubmit
);
addCardForm.setEventListeners();

// EVENT LISTENER FOR NEW CARD BUTTON
constants.addCardButton.addEventListener("click", () => {
  addCardForm.open();
  addCardValidator._disableButton();
});

// PREVIEW IMAGE MODAL
const cardPreview = new PopupWithImage("#preview-image-modal");
cardPreview.setEventListeners();

function handleImageClick(name, link) {
  cardPreview.open({ name, link });
}

//------DELETING CARDS-----//
// const profileEditPopup = new PopupWithForm(
//   "#profile-edit-modal",
//   handleProfileEditSubmit
// );
// profileEditPopup.setEventListeners();

const deleteCardPopup = new PopupWithForm("#delete-card-modal", () => {
  api
    .deleteRequest(currentCardID)
    .then(() => {
      currentCardElement.remove();
      deleteCardPopup.close();
    })
    .catch((error) => console.error("Error deleting card:", error));
});

let currentCardID = null;
let currentCardElement = null;

function handleDeleteCard(cardID, cardElement) {
  currentCardID = cardID;
  currentCardElement = cardElement;
  deleteCardPopup.open();
}

//-----HANDLE LIKES----/

function handleLikeButton(likeButton, likedStatus, cardID) {
  if (likedStatus) {
    return api
      .removeLike(cardID)
      .then(() => {
        likeButton.classList.remove("card__like-button_active");
        return false; // Return new liked status
      })
      .catch((error) => console.error("Error removing like:", error));
  } else {
    return api
      .addLike(cardID)
      .then(() => {
        likeButton.classList.add("card__like-button_active");
        return true; // Return new liked status
      })
      .catch((error) => console.error("Error adding like:", error));
  }
}
//----------USER INFO------//

// LOAD USER INFO
const userInformation = new UserInfo({
  name: ".profile__title",
  description: ".profile__description",
});

// EDIT USER FORM
const profileEditForm = new PopupWithForm("#profile-edit-modal", (data) => {
  userInformation.setUserInfo({
    title: data.title,
    description: data.description,
  });
});
profileEditForm.setEventListeners();

// EVENT LISTENER FOR PROFILE EDIT
constants.profileEditButton.addEventListener("click", () => {
  profileEditValidator.resetValidation();
  const userData = userInformation.getUserInfo();
  constants.profileTitleInput.value = userData.title;
  constants.profileDescriptionInput.value = userData.description.trim();
  profileEditForm.open();
});

//-------FORM VALIDATION-----//

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
