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

// Initialize form validators
const profileEditValidator = new FormValidator(
  constants.config,
  constants.profileEditForm
);
const addCardValidator = new FormValidator(
  constants.config,
  constants.addCardModal
);

const editAvatarFormValidator = new FormValidator(
  constants.config,
  constants.editAvatarForm
);

editAvatarFormValidator.enableValidation();
profileEditValidator.enableValidation();
addCardValidator.enableValidation();

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
  addCardForm.renderLoading(true);
  api
    .addCard(data.name, data.link)
    .then((data) => {
      const cardElement = createCard(data);
      cardSection.addItem(cardElement);
      addCardForm.close();
      addCardForm.reset();
      addCardValidator._disableButton();
      addCardForm.close();
    })
    .catch((error) => {
      console.error("Error adding card:", error);
    })
    .finally(() => {
      addCardForm.renderLoading(false);
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
        return false;
      })
      .catch((error) => console.error("Error removing like:", error));
  } else {
    return api
      .addLike(cardID)
      .then(() => {
        likeButton.classList.add("card__like-button_active");
        return true;
      })
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

function handleProfileEditSubmit(inputValues) {
  profileEditForm.renderLoading(true);
  api
    .editProfile(inputValues.name, inputValues.about)
    .then((data) => {
      userInfo.setUserInfo(data.name, data.about);
      profileEditForm.close();
    })
    .catch((err) => console.error("Error editing profile:", err))
    .finally(() => {
      profileEditForm.renderLoading(false);
    });
}

// EDIT USER FORM
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
  avatarEditPopup.renderLoading(true);
  api
    .updateAvatar(link)
    .then((res) => {
      console.log("Avatar updated successfully:", res);
      userInfo.setAvatar(link);
      avatarEditPopup.close();
      avatarEditPopup.reset();
    })
    .catch((err) => {
      console.error("Error occurred while updating avatar:", err);
    })
    .finally(() => {
      avatarEditPopup.renderLoading(false);
    });
}
