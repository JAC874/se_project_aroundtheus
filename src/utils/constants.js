export const initialCards = [
  {
    name: "Yosemite Valley",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
  },
  {
    name: "Lake Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lake-louise.jpg",
  },
  {
    name: "Bald Mountains",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/latemar.jpg",
  },
  {
    name: "Vanoise National Park",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg",
  },
];

export const config = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__edit-save-button",
  inactiveButtonClass: "modal__edit-save-button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

// export const selectors = {
//   popupForm: "modal__form",
//   previewImage: "modal__preview-image",
//   addCardModal: "#add-card-modal",
// };

export const profileEditModal = document.querySelector("#profile-edit-modal");
export const profileEditButton = document.querySelector("#profile-edit-button");
export const profileTitle = document.querySelector("#profile-title");
export const profileDescription = document.querySelector(
  "#profile-description"
);
export const profileTitleInput = document.querySelector("#profile-title-input");
export const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);
export const profileEditForm = document.forms["profile-form"];

export const cardListEl = ".cards__list";

export const addCardModal = document.querySelector("#add-card-modal");
export const addCardButton = document.querySelector("#add-button");
export const addCardForm = document.forms["add-card-form"];

export const previewImageModal = document.querySelector("#preview-image-modal");
export const previewImageElement = document.querySelector(
  ".modal__preview-image"
);
export const previewCaption = previewImageModal.querySelector(
  ".modal__preview-caption"
);
