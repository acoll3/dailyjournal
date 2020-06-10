"use strict";

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const { MongoClient } = require("mongodb");

const DATABASE_NAME = "cs193x_finalproject";
const CLIENT_ID ="1093968881586-6nh5rjaqeutb0bgb6rsop68jdql16ust.apps.googleusercontent.com";

let api = express.Router();
let conn;
let db;
let Notes, Lists;

module.exports = async (app) => {
  app.set("json spaces", 2);
  conn = await MongoClient.connect("mongodb://localhost", { useUnifiedTopology: true });
  db = conn.db(DATABASE_NAME);
  Notes = db.collection("notes");
  Lists = db.collection("lists");
  app.use("/api", api);
};

api.use(cors());
api.use(bodyParser.json());

api.get("/", (req, res) => {
  res.json({ success: true });
});

api.use("/notes/:title", async (req, res, next) => {
  let title = req.params.title;
  let note = await Notes.findOne({ title });
  if (!note) {
    res.status(400).json({ error: "Note doesn't exist" } );
    return;
  }
  res.locals.note = note;
  next();
});

api.use("/lists/:title", async (req, res, next) => {
  let title = req.params.title;
  let list = await Lists.findOne({ title });
  if (!list) {
    res.status(400).json({ error: "List doesn't exist" } );
    return;
  }
  res.locals.list = list;
  next();
});

// get all Notes
api.get("/notes", async (req, res) => {
  let notes = await Notes.find().toArray();
  for (let note of notes) delete note._id;
  res.json({notes});
});

// get all Lists
api.get("/lists", async (req, res) => {
  let lists = await Lists.find().toArray();
  for (let list of lists) delete list._id;
  res.json({ lists });
});


// get a note
api.get("/notes/:title", async (req, res) => {
  let note = res.locals.note;
  let {title, date, text} = note;
  res.json({title, date, text});
});

// get a list
api.get("/lists/:title", async (req, res) => {
  let list = res.locals.list;
  let {title, date, elems} = list;
  res.json({ title, date, elems });
});

// post new note
api.post("/notes", async (req, res) => {
  let title = req.body.title;
  let text = req.body.text;
  let date = req.body.date;
  if (!title) {
    res.status(400).json({ error: "Missing title property in request body" });
    return;
  }
  let newNote = {title: title, date: date, text: text}; // todo: change with actual data!!
  await Notes.insertOne(newNote);
  delete newNote._id;
  res.json({ newNote });
});

// post new list
api.post("/lists", async (req, res) => {
  let title = req.body.title;
  let elems = req.body.elems;
  let date = req.body.date;
  if (!title) {
    res.status(400).json({ error: "Missing title property in request body" });
    return;
  }
  let newList = {title: title, date: date, elems: elems}; // todo: change with actual data!!
  await Lists.insertOne(newList);
  delete newList._id;
  res.json({ newList });
});

// update note with new text
api.patch("/notes/:title", async (req, res) => {
  let newText = req.body.text;
  let note = res.locals.note;
  if (newText) {
    note.text = newText;
  }
  await Notes.replaceOne({ title: note.title }, note);
  delete note._id;
  res.json({ note });
});

// update list with new element
api.patch("/lists/:title", async (req, res) => {
  let newElem = req.body.elem;
  let list = res.locals.list;
  if (newElem) {
    list.elems.push(newElem);
  }
  await Lists.replaceOne({ title: list.title }, list);
  delete list._id;
  res.json({ list });
});

// delete note
api.delete("/notes/:title", async (req, res) => {
  let note = res.locals.note;
  await Notes.remove(note);
  res.json({ success: true })
});

// delete list
api.delete("/lists/:title", async (req, res) => {
  let list = res.locals.list;
  await Lists.remove(list);
  res.json({ success: true })
});
