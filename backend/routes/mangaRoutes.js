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
router.get("/:manga_id", getManga);
router.post("/:manga_id/chapter", uploadImages, addChapter);
router.get("/:manga_id/chapter/:chapter_id", getChapter);

module.exports = router;
