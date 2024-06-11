export default class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  _request(url, options) {
    return fetch(url, options).then(this._checkResponse);
  }

  //   GET CARDS
  getInitialCards() {
    return this._request(`${this._baseUrl}/cards`, {
      headers: this._headers,
    });
  }

  //POST CARDS
  addCard(name, link) {
    return this._request(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name,
        link,
      }),
    });
  }

  // GET USER INFO
  getUser() {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    });
  }

  //EDIT USER INFO
  editProfile(name, about) {
    return this._request(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ name, about }),
    });
  }

  // DELETE CARDS
  deleteRequest(cardID) {
    return this._request(`${this._baseUrl}/cards/${cardID}`, {
      method: "DELETE",
      headers: this._headers,
    });
  }

  //ADD LIKE
  addLike(cardID) {
    return this._request(`${this._baseUrl}/cards/${cardID}/likes`, {
      method: "PUT",
      headers: this._headers,
      body: JSON.stringify({ isLiked: true }),
    });
  }

  //REMOVE LIKE
  removeLike(cardID) {
    return this._request(`${this._baseUrl}/cards/${cardID}/likes`, {
      method: "DELETE",
      headers: this._headers,
      body: JSON.stringify({ isLiked: false }),
    });
  }

  //UPDATE AVATAR
  updateAvatar(avatar) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar,
      }),
    });
  }
}
