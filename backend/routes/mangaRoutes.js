const express = require("express");
const router = express.Router();
const {
  getCatalog,
  getManga,
  createManga,
  getChapter,
  addChapter,
  bookmarkManga,
} = require("../controllers/mangaControllers");
const { protect } = require("../middleware/userMiddleware");
const {
  uploadImages,
  uploadThumbnail,
} = require("../middleware/uploadMiddleware");

router.route("/").get(getCatalog).post(uploadThumbnail, createManga);
router.route("/:manga_id").get(getManga).put(protect, bookmarkManga);
router.post("/:manga_id/chapter", uploadImages, addChapter);
router.get("/:manga_id/chapter/:chapter_id", getChapter);

module.exports = router;
