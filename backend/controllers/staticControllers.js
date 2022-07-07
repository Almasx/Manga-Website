const asyncHandler = require("express-async-handler");
const path = require("path");

const Chapter = require("../models/chapterModel");
const Manga = require("../models/mangaModel");

// @desc    URI for page
// @route   GET /uploads/chapter/:chapter_id/pages/:page_index
// @access  public
const getPage = asyncHandler(async (req, res) => {
  const { chapter_id, page_index } = req.params;
  const chapter = await Chapter.findById(chapter_id);

  // Check Chapter
  if (!chapter) {
    res.status(400);
    throw new Error("Chapter not found");
  }

  // Check page
  if (!chapter.images[page_index - 1]) {
    res.status(400);
    throw new Error("Chapter not found");
  }

  res.sendFile(`./public/chapters/${chapter_id}/${page_index}.jpeg`, {
    root: path.join(__dirname, "../../"),
  });
});

// @desc    URI for manga thumbnail
// @route   GET /uploads/thumbnail/:manga_id
// @access  public
const getThumbnail = asyncHandler(async (req, res) => {
  const { manga_id } = req.params;
  const manga = await Manga.findById(manga_id);

  // Check manga
  if (!manga) {
    res.status(400);
    throw new Error("manga not found");
  }

  res.sendFile(`./public/thumbnails/${manga_id}.jpeg`, {
    root: path.join(__dirname, "../../"),
  });
});

module.exports = { getPage, getThumbnail };
