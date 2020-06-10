import apiRequest from "./api.js";

export default class Note {
  constructor(title, date, text) {
    this.title = title;
    this.date = date;
    this.text = text;

    this._newNote = null;
    this._noteText = null;
    this._editWindow = null;

    this._onEditClick = this._onEditClick.bind(this);
    this._onDelClick = this._onDelClick.bind(this);
    this._onLoseFocus = this._onLoseFocus.bind(this);
  }

  addToDOM(parent) {
    let newNote = document.querySelector(".hidden-note").cloneNode([true]);
    this._newNote = newNote;
    this._noteText = newNote.querySelector("p");
    newNote.querySelector("h3").textContent = this.title;
    newNote.querySelector("span").textContent = this.date;
    this._noteText.textContent = this.text;


    let editButton = newNote.querySelector(".edit");
    let delButton = newNote.querySelector(".delete");
    editButton.addEventListener("click", this._onEditClick);
    delButton.addEventListener("click", this._onDelClick);

    this._editWindow = newNote.querySelector(".edit-window");
    this._editWindow.value = this.text;
    this._editWindow.addEventListener("blur", this._onLoseFocus);

    newNote.classList.remove("hidden-note");
    newNote.classList.add("template-note")
    parent.appendChild(newNote);
  }

  static async loadOne(title) {
    let path = "/notes/" + title;
    let [status, data] = await apiRequest("GET", path);
    if (status === 404) alert("Note does not exist")
    if (status !== 200) alert("Couldn't find note");
    return new Note(data);
  }

  static async loadAll() {
    let path = "/notes";
    let [status, data] = await apiRequest("GET", path);
    if (status === 404) {
      alert("Note does not exist");
    }
    if (status !== 200) alert("Couldn't find note");
    let notes = []
    for (let note of data.notes) {
      notes.push(new Note(note.title, note.date, note.text));
    }
    return notes;
  }

  async createNote(title, date, text) {
    let path = "/notes";
    let [status, data] = await apiRequest("POST", path, {title, date, text});
    if (status != 200) {
      alert("Couldn't create note");
    }
    return data;
  }

  async updateNote(title, text) {
    let path = "/notes/" + title;
    let [status, data] = await apiRequest("PATCH", path, {text: text});
    if (status != 200) {
      alert("Couldn't update note");
    }
    return data;
  }

  _onEditClick(event) {
    this._editWindow.style.display = "block";
  }

  async delNote(title) {
    let path = "/notes/" + title;
    let [status, data] = await apiRequest("DELETE", path);
    if (status != 200) {
      alert("Couldn't delete note");
    }
    return data;
  }

  _onDelClick(event) {
    this.delNote(this.title);
    let parentElem = document.querySelector("#posts");
    parentElem.removeChild(this._newNote);
  }

  _onLoseFocus(event) {
    this.text = event.target.value;
    this.updateNote(this.title, this.text);
    this._noteText.textContent = this.text;
    this._editWindow.value = this.text; // reset the text inside the edit window
    this._editWindow.style.display = "none";

  }

}
