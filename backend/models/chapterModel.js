const mongoose = require("mongoose");

const chapterSchema = mongoose.Schema(
  {
    index: { type: Number, default: 1, unique: true },
    volume: { type: Number, required: true },
    images: [{ type: String, required: true, unique: true }],
  },
  { timestamps: true }
);

chapterSchema.pre("save", async function () {
  if (this.index) {
    let chapter = await chapterSchema.findOne();
    chapter.index++;
  }
});

module.exports = mongoose.model("Chapter", chapterSchema);
