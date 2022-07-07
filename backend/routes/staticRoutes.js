const express = require("express");
const router = express.Router();
const { getPage } = require("../controllers/staticControllers");

router.get("/chapter/:chapter_id/pages/:page_index", getPage);

module.exports = router;
