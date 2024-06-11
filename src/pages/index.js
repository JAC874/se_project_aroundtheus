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
    authorization: "73b28af1-3d27-47c6-87e4-d9eade98f6bf",
    "content-type": "application/json",
  },
});

//-------FORM VALIDATION-----//
const formValidators = {};

const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    const validator = new FormValidator(config, formElement);
    const formName = formElement.getAttribute("name");

    formValidators[formName] = validator;
    validator.enableValidation();
  });
};

// initialize validation
enableValidation(constants.config);

//--------  HANDLE FORM SUBMISSIONS------/

function handleSubmit(request, popupInstance, loadingText = "Saving...") {
  popupInstance.renderLoading(true, loadingText);
  request()
    .then(() => {
      popupInstance.close();
    })
    .catch(console.error)
    .finally(() => {
      popupInstance.renderLoading(false);
    });
}

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
  })
  .catch((err) => console.error(err));

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
  const { name, link } = data;
  function makeRequest() {
    return api
      .addCard(name, link)
      .then((data) => {
        cardSection.addItem(createCard(data));
      })
      .then(() => {
        addCardForm.reset();
        formValidators["add-card-form"].resetValidation();
      });
  }
  handleSubmit(makeRequest, addCardForm);
}

const addCardForm = new PopupWithForm(
  "#add-card-modal",
  handleAddCardFormSubmit
);
addCardForm.setEventListeners();

// EVENT LISTENER FOR NEW CARD BUTTON
constants.addCardButton.addEventListener("click", () => {
  addCardForm.open();
});

// PREVIEW IMAGE MODAL
const cardPreview = new PopupWithImage("#preview-image-modal");
cardPreview.setEventListeners();

function handleImageClick(name, link) {
  cardPreview.open({ name, link });
}

//----DELETE CARD-----//

const deleteCardPopup = new PopupWithForm(
  "#delete-card-modal",
  handleDeleteCardSubmit
);

let currentCardID = null;
let currentCardElement = null;

function handleDeleteCard(cardID, cardElement) {
  currentCardID = cardID;
  currentCardElement = cardElement;
  deleteCardPopup.open();
}

function handleDeleteCardSubmit() {
  function makeRequest() {
    return api.deleteRequest(currentCardID).then(() => {
      currentCardElement.remove();
    });
  }

  handleSubmit(makeRequest, deleteCardPopup, "Deleting...");
}

//-----HANDLE LIKES----//

function handleLikeButton(cardID, isLiked) {
  if (isLiked) {
    return api
      .removeLike(cardID)
      .then(() => false)
      .catch((error) => console.error("Error removing like:", error));
  } else {
    return api
      .addLike(cardID)
      .then(() => true)
      .catch((error) => console.error("Error adding like:", error));
  }
}

//----------USER INFO------//

const userInfo = new UserInfo(
  ".profile__title",
  ".profile__description",
  ".profile__image"
);

api
  .getUser()
  .then((inputValues) => {
    userInfo.setUserInfo(inputValues.name, inputValues.about);
    userInfo.setAvatar(inputValues.avatar);
  })
  .catch((err) => console.error("Error fetching user data:", err));

function handleProfileEditSubmit(data) {
  const { name, about } = data;
  function makeRequest() {
    return api
      .editProfile(name, about)
      .then((data) => {
        userInfo.setUserInfo(data.name, data.about);
      })
      .then(() => {
        formValidators["profile-edit-form"].resetValidation();
      });
  }

  handleSubmit(makeRequest, profileEditForm);
}

//-----PROFILE EDIT FORM-----//

const profileEditForm = new PopupWithForm(
  "#profile-edit-modal",
  handleProfileEditSubmit
);

profileEditForm.setEventListeners();

// EVENT LISTENER FOR PROFILE EDIT
constants.profileEditButton.addEventListener("click", () => {
  const data = userInfo.getUserInfo();
  constants.profileTitleInput.value = data.name;
  constants.profileDescriptionInput.value = data.about;
  profileEditForm.open();
});

//AVATAR UPDATE

const profileAvatar = document.querySelector(".profile__image-pencil");

profileAvatar.addEventListener("click", (e) => {
  if (e.target === e.currentTarget) {
    avatarEditPopup.open();
  }
});

const avatarEditPopup = new PopupWithForm(
  "#edit-avatar-modal",
  handleAvatarSubmit
);
avatarEditPopup.setEventListeners();

function handleAvatarSubmit({ link }) {
  function makeRequest() {
    return api.updateAvatar(link).then((res) => {
      userInfo.setAvatar(link);
      avatarEditPopup.reset();
      formValidators["edit-avatar-form"].disableButton();
      formValidators["edit-avatar-form"].resetValidation();
    });
  }

  handleSubmit(makeRequest, avatarEditPopup);
}
