const express = require("express");
const router = express.Router();
const { getPage, getThumbnail } = require("../controllers/staticControllers");

router.get("/chapter/:chapter_id/pages/:page_index", getPage);
router.get("/thumbnail/:manga_id", getThumbnail);

module.exports = router;
