const express = require("express");
const router = express.Router();
const {
  getCatalog,
  getManga,
  createManga,
  getChapter,
  addChapter,
} = require("../controllers/mangaControllers");
const { protect } = require("../middleware/userMiddleware");
const { uploadImages } = require("../middleware/uploadMiddleware");

router.route("/").get(getCatalog).post(createManga);
router.get(":name", getManga);
router.post(":name/chapter", uploadImages, addChapter);
router.get(":name/chapter/:chapterID", getChapter);

module.exports = router;
