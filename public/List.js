export default class List {
  constructor(title, date, elems) {
    this.title = title;
    this.date = date;
    this.elems = elems;

    this._newList = null;
    this._newList = null;

    this._onEditClick = this._onEditClick.bind(this);
    this._onDelClick = this._onDelClick.bind(this);
    this._onLoseFocus = this._onLoseFocus.bind(this);
  }

  createListElem(text) {
    let newListElem = document.createElement("div");
    newListElem.classList.add("list-elem");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = text;

    let label = this.createCheckboxLabel(text);

    newListElem.appendChild(checkbox);
    newListElem.appendChild(label);
    return newListElem;
  }

  createCheckboxLabel(text) {
    let newElemLabel = document.createElement("label");
    newElemLabel.htmlfor = text;
    newElemLabel.textContent = text;
    return newElemLabel;
  }

  addToDOM(parent) {
    let newList = document.querySelector(".hidden-list").cloneNode([true]);

    for (let elem of this.elems) {
      let newListElem = this.createListElem(elem)
      newList.querySelector("ul").appendChild(newListElem);
    }

    this._newList = newList;

    newList.querySelector("h3").textContent = this.title;
    newList.querySelector("span").textContent = this.date;

    let editButton = newList.querySelector(".edit");
    let delButton = newList.querySelector(".delete");
    editButton.addEventListener("click", this._onEditClick);
    delButton.addEventListener("click", this._onDelClick);

    this._editWindow = newList.querySelector(".edit-window");
    this._editWindow.addEventListener("blur", this._onLoseFocus);

    newList.classList.remove("hidden-list");
    newList.classList.add("template-list");
    parent.appendChild(newList);
  }

  static async loadOne(title) {
    let path = "/lists/" + title;
    let [status, data] = await apiRequest("GET", path);
    if (status === 404) alert("List does not exist")
    if (status !== 200) alert("Couldn't find list");
    return new Note(data);
  }

  static async loadAll() {
    let path = "/lists";
    let [status, data] = await apiRequest("GET", path);
    if (status === 404) alert("Lists do not exist")
    if (status !== 200) alert("Couldn't find lists");
    let lists = []
    for (let list of data.lists) {
      lists.push(new List(list.title, list.date, list.elems));
    }
    return lists;
  }

  async createList(title, date, elems) {
    let path = "/lists";
    let [status, data] = await apiRequest("POST", path, {title, date, elems});
    if (status != 200) alert("Couldn't create list");
    return data;
  }

  async updateList(title, newElem) {
    let path = "/lists/" + title;
    let [status, data] = await apiRequest("PATCH", path, {elem: newElem});
    if (status != 200) alert("Couldn't update list elem");
    return data;
  }

  _onEditClick(event) {
    let editButton = event.target;
    this._editWindow.style.display = "block";
  }

  async delList(title) {
    let path = "/lists/" + title;
    let [status, data] = await apiRequest("DELETE", path);
    if (status != 200) alert("Couldn't delete list");
    return data;
  }

  _onDelClick(event) {
    this.delList(this.title);
    let parentElem = document.querySelector("#posts");
    parentElem.removeChild(this._newList);
  }

  _onLoseFocus(event) {
    let parentList = this._newList.querySelector("ul");
    let newText = this._editWindow.value;
    let newListElem = this.createListElem(newText);
    this.updateList(this.title, newText);
    this.elems.push(newText);
    parentList.appendChild(newListElem);
    this._editWindow.value = "";
    this._editWindow.style.display = "none";
  }
}
