const asyncHandler = require("express-async-handler");
const fs = require("fs");
const Manga = require("../models/mangaModel");
const Genre = require("../models/genreModel");
const Chapter = require("../models/chapterModel");
const path = require("path");

// @desc    Get & Filter/Sort Catalog
// @route   GET /api/mangas
// @access  public
const getCatalog = asyncHandler(async (req, res) => {
  const filters = {};
  filters.genres = req.query?.genres;
  const mangas = await Manga.find(filters);
  res.status(200).json(mangas);
});

// @desc    Get information about manga
// @route   Get /api/mangas/:name/
// @access  public
const getManga = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const manga = await Manga.findOne({ name });

  // Check for duplicates
  if (!manga) {
    res.status(400);
    throw new Error("Manga not found");
  }
  res.status(200).json(manga);
});

// @desc    Create New Manga
// @route   POST /api/mangas/
// @access  private
const createManga = asyncHandler(async (req, res) => {
  const { name, genres, description } = req.body;
  if (!name || !genres || !description) {
    return res.json({ message: "Incomplete request!" });
  }

  const manga = await Manga.findOne({ name });

  // Check for duplicates
  if (manga) {
    res.status(400);
    throw new Error("Manga already exists");
  }

  // Wire each genre with collection
  genres = [...genres];
  genres.forEach((item) => {
    Genre.findOne({ text: item })._id.toString();
  });

  manga = await Manga.create({ name, genres, description }, (error) => {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  });

  res.status(200).json({ message: `Manga ${manga.name} created!` });
});

// @desc    Open Chapter
// @route   Get /api/manga/:name/chapter/:chapterID
// @access  public/private
const getChapter = asyncHandler(async (req, res) => {
  const { name, chapterID } = req.body;

  const manga = await Manga.findOne({ name });

  // Validate manga
  if (!manga) {
    res.status(400);
    throw new Error("Manga not found");
  }

  const chapterExist = manga.chapters.filter((_id) => {
    _id === chapterID;
  });

  // Check for chapter
  if (!chapterExist) {
    res.status(400);
    throw new Error("Chapter not found");
  }

  const chapter = Chapter.findById(chapterID);
  res.status(200).json(chapter);
});

// @desc    Add new Chapter
// @route   POST /api/manga/:name/chapter
// @access  private
const addChapter = asyncHandler(async (req, res) => {
  const { volume, name } = req.body;
  if (!req.files || !volume) {
    res.status(400);
    throw new Error("Invalid request to add chapter");
  }

  const manga = await Manga.findOne({ name });

  // Validate manga
  if (!manga) {
    res.status(400);
    throw new Error("Manga not found");
  }

  const chapterId = await chapterSchema.findOne().index;
  const uploadPath = path.join(__dirname, UPLOAD_DIR, chapterId + 1);

  const images = [];
  fs.mkdirSync(uploadPath);
  for (let i = 0; i < req.files.length; i++) {
    let pagePath = path.join(uploadPath, index);
    await sharp(req.files.buffer)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(pagePath);
    images.push(pagePath);
  }
  const chapter = await new Chapter({ volume, images });
  chapter.save((error) => {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  });

  res.status(200).json(chapter);
});

module.exports = { getCatalog, getManga, createManga, getChapter, addChapter };
