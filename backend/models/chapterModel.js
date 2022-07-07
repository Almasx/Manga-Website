const mongoose = require("mongoose");

const chapterSchema = mongoose.Schema(
  {
    index: { type: Number, default: 1, unique: true },
    volume: { type: Number, required: true },
    images: [{ type: String, unique: true }],
  },
  { timestamps: true }
);

const Chapter = mongoose.model("Chapter", chapterSchema);

chapterSchema.pre("save", async function () {
  if (this.index) {
    let chapter = await Chapter.findOne();
    chapter.index++;
  }
});

module.exports = Chapter;
