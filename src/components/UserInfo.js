export default class UserInfo {
  constructor({ name, description }) {
    this._title = document.querySelector(name);
    this._description = document.querySelector(description);
  }

  getUserInfo() {
    const userInfo = {
      title: this._title.textContent,
      description: this._description.textContent,
    };
    return userInfo;
  }

  setUserInfo(data) {
    this._title.textContent = data.title;
    this._description.textContent = data.description;
  }
}
