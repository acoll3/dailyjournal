import Note from './Note.js';
import List from './List.js';

class Journal {
  constructor() {
    this._postForm = null;
    this._notes = [];
    this._lists = []

    // Bind event handlers
    this._onPostClick = this._onPostClick.bind(this);
    this._onClearClick = this._onClearClick.bind(this);
  }

  async setup() {
    this._postForm = document.querySelector('#post-form');
    this._postButton = this._postForm.querySelector("#post-button")
    this._postButton.addEventListener('click', this._onPostClick);

    // load all existing notes the user previously entered
    let parentElem = document.querySelector("#posts");
    let notes = await Note.loadAll();
    let lists = await List.loadAll();
    for (let note of notes) {
      this._notes.push(note);
      note.addToDOM(parentElem);
    }
    for (let list of lists) {
      this._lists.push(list)
      list.addToDOM(parentElem);
    }

    document.querySelector("#clear").addEventListener("click", this._onClearClick);
  }

  async _onClearClick(event) {
    event.preventDefault();
    let parentElem = document.querySelector("#posts");
    let noteEntries = document.querySelectorAll(".template-note");
    let listEntries = document.querySelectorAll(".template-list");
    for (let domNote of noteEntries) {
      parentElem.removeChild(domNote);
    }
    for (let note of this._notes) {
      await note.delNote(note.title);
    }
    for (let domList of listEntries) {
      parentElem.removeChild(domList);
    }
    for (let list of this._lists) {
      await list.delList(list.title);
    }
    this._notes = [];
    this._lists = [];

  }

  _onPostClick(event) {
    event.preventDefault();
    let parentElem = document.querySelector("#posts");
    let titleInput = this._postForm.querySelector("#post-title");
    let title = titleInput.value;
    titleInput.value = "";

    let date = new Date().toDateString();
    let textInput = this._postForm.querySelector("#post-text");
    let text = textInput.value;
    textInput.value = "";

    if (this._postForm.querySelector("#note-radio").checked) {
      let note = new Note(title, date, text);
      note.createNote(title, date, text)
      note.addToDOM(parentElem);
      this._notes.push(note);

    } else if (this._postForm.querySelector("#list-radio").checked) {
      let list = new List(title, date, [text]);
      list.createList(title, date, [text]);
      list.addToDOM(parentElem);
      this._lists.push(list);

    } else {
      window.alert("Please select either a note or a list.");
    }
  }

}

let journal = new Journal();
journal.setup();
