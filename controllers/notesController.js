const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");

const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().lean();
  if (!notes?.length)
    return res.status(400).json({
      message: "There are no Notes!",
    });

  res.status(200).json({
    message: "Here are all the notes.",
    notes,
  });
});

const createNote = asyncHandler(async (req, res) => {
  const { user, title, text, completed } = req.body;
  if (!user || !title || !text)
    return res.status(400).json({ message: "All fields are required!" });
  const note = await Note.create({
    user,
    title,
    text,
    completed: completed ? completed : false,
  });
  if (!note) return res.status(400).json({ message: "Invalid inputs!" });
  res.status(201).json({
    message: `Note ${note.title} successfully created.`,
    note,
  });
});

const updateNote = asyncHandler(async (req, res) => {
  const { id, title, text, completed } = req.body;
  if (!id || !title || !text || typeof completed !== "boolean")
    return res.status(400).json({ message: "All fields are required!" });

  const note = await Note.findById(id).exec();
  if (!note) return res.status(400).json({ message: "Note not found!" });
  note.title = title;
  note.text = text;
  note.completed = completed;
  await note.save();
  res.status(200).json({
    message: "Note updated successfully.",
    note,
  });
});

const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "Note ID required!" });
  const note = await Note.findById(id).exec();
  if (!note)
    return res.status(404).json({ message: "There is no note with that ID!" });
  const result = await note.deleteOne();
  res.status(200).json({
    message: `Note with id: ${result._id} has been successfully deleted!`,
  });
});

module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
};
