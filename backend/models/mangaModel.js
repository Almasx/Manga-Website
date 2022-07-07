const mongoose = require("mongoose");

const mangaSchema = mongoose.Schema({
  title: { type: String, required: true, unique: true },
  thumbnail: { type: String, unique: true },
  description: { type: String, required: true },
  genres: [{ type: mongoose.Types.ObjectId, ref: "Genre", required: true }],
  chapters: [{ type: mongoose.Types.ObjectId, ref: "Chapter", required: true }],
});

module.exports = mongoose.model("Manga", mangaSchema);
