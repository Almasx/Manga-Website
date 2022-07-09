const asyncHandler = require("express-async-handler");

const Manga = require("../models/mangaModel");
const Genre = require("../models/genreModel");
const Chapter = require("../models/chapterModel");
const User = require("../models/userModel");

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// @desc    Get & Filter/Sort Catalog
// @route   GET /api/manga
// @access  public
const getCatalog = asyncHandler(async (req, res) => {
  const { genres } = req.query;
  const filters = {};

  // Validate query
  if (genres) {
    filters.genres = genres;
  }

  const mangas = await Manga.find(filters);
  res.status(200).json(mangas);
});

// @desc    Get information about manga
// @route   Get /api/manga/:manga_id/
// @access  public
const getManga = asyncHandler(async (req, res) => {
  const { manga_id } = req.params;
  const manga = await Manga.findById(manga_id);

  // Check manga
  if (!manga) {
    res.status(400);
    throw new Error("Manga not found");
  }
  res.status(200).json(manga);
});

// @desc    Bookmark Manga
// @route   UPDATE /api/manga/:manga_id/
// @access  private
const bookmarkManga = asyncHandler(async (req, res) => {
  const { manga_id } = req.params;
  const manga = await Manga.findById(manga_id);

  // Check manga
  if (!manga) {
    res.status(400);
    throw new Error("Manga not found");
  }

  const mangaBookmarked = (await User.findById(req.user.id)).bookmarks;
  if (manga_id in mangaBookmarked) {
    res.status(400);
    throw new Error("Manga already bookmarked");
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $addToSet: { bookmarks: manga_id } },
    { new: true }
  ).select("-password");
  res.json(user);
});

// @desc    Create New Manga
// @route   POST /api/manga/
// @access  private
const createManga = asyncHandler(async (req, res) => {
  const { title, genres, description } = req.body;
  if (!title || !genres || !description || !req.file) {
    return res.json({ message: "Incomplete request!" });
  }

  const mangaExist = await Manga.findOne({ title });

  // Check for duplicates
  if (mangaExist) {
    res.status(400);
    throw new Error("Manga already exists");
  }

  // Get genres _id
  for await (const [index, name] of genres.entries()) {
    let genre = await Genre.findOne({ text: name });
    genres[index] = genre._id.toString();
  }

  let manga = await Manga.create({ title, genres, description });

  // Save file in storage
  let thumbnailPath = path.join(
    __dirname,
    "../../",
    process.env.UPLOAD_THUMBNAIL,
    manga._id.toString() + ".jpeg"
  );
  let thumbnailURI = `${req.get(
    "host"
  )}/uploads/thumbnail/${manga._id.toString()}`;

  await sharp(req.file.buffer)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(thumbnailPath);

  // Add new thumnail URI to document
  await Manga.findByIdAndUpdate(manga._id.toString(), {
    thumbnail: thumbnailURI,
  });
  manga = await Manga.findById(manga._id.toString());
  res.status(200).json(manga);
});

// @desc    Open Chapter
// @route   Get /api/manga/:manga_id/chapter/:chapter_id
// @access  public/private
const getChapter = asyncHandler(async (req, res) => {
  const { manga_id, chapter_id } = req.params;

  const manga = await Manga.findById(manga_id);

  // Validate manga
  if (!manga) {
    res.status(400);
    throw new Error("Manga not found");
  }

  const chapterExist = manga.chapters.filter((_id) => {
    _id === chapter_id;
  });

  // Check for chapter
  if (!chapterExist) {
    res.status(400);
    throw new Error("Chapter not found");
  }

  const chapter = Chapter.findById(chapter_id);
  res.status(200).json(chapter);
});

// @desc    Add new Chapter
// @route   POST /api/manga/:manga_id/chapter
// @access  private
const addChapter = asyncHandler(async (req, res) => {
  const { volume } = req.body;
  const { manga_id } = req.params;

  if (!req.files || !volume) {
    res.status(400);
    throw new Error("Invalid request to add chapter");
  }

  let manga = await Manga.findById(manga_id);

  // Validate manga
  if (!manga) {
    res.status(400);
    throw new Error("Manga not found");
  }

  let chapter = new Chapter({ volume });
  await chapter.save();

  const uploadPath = path.join(
    __dirname,
    "../../",
    process.env.UPLOAD_CHAPTER,
    chapter._id.toString()
  );

  // Save file in storage
  const images = [];
  fs.mkdirSync(uploadPath);
  for (let i = 1; i <= req.files.length; i++) {
    let pagePath = path.join(uploadPath, i.toString() + ".jpeg");
    let pageURI = `${req.get(
      "host"
    )}/uploads/chapter/${chapter._id.toString()}/pages/${i.toString()}`;

    await sharp(req.files[i - 1].buffer)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(pagePath);
    images.push(pageURI);
  }

  chapter = await Chapter.findByIdAndUpdate(
    chapter._id.toString(),
    { images },
    { new: true }
  );
  manga = await Manga.findByIdAndUpdate(
    manga._id.toString(),
    {
      $addToSet: { chapters: chapter._id.toString() },
    },
    { new: true }
  );
  res.status(200).json(chapter);
});

module.exports = {
  getCatalog,
  getManga,
  createManga,
  getChapter,
  addChapter,
  bookmarkManga,
};
