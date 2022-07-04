const mongoose = require("mongoose");

const genreSchema = mongoose.Schema({
  text: { type: String, required: true },
});

module.exports = mongoose.model("Genre", genreSchema);
