import GoogleSignin from "./GoogleSignin.js";

const CLIENT_ID = "1093968881586-6nh5rjaqeutb0bgb6rsop68jdql16ust.apps.googleusercontent.com";

class Login {
  constructor() {
    this._gs = null;
  }
  async setup() {
    this._gs = await GoogleSignin.init(CLIENT_ID);
  }

  async _loadProfile() {
    let { name, email } = this._gs.getProfile();
    let authInfo = this._gs.getAuthInfo();
    let res = await fetch("/api/google", {
      headers: { "Authorization": `Google ${authInfo.idToken}` }
    });
    let json = await res.json();
    console.log(json);
  }

  _onSignIn() {
    this._loadProfile();
  }

}

let login = new Login();
