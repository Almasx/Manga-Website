const multer = require("multer");
const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
});

const uploadFiles = upload.array("images");
const uploadImages = (req, res, next) => {
  uploadFiles(req, res, (err) => {
    if (err) {
      console.log(err);
      res.status(401);
      throw new Error("Not uploaded");
    }

    next();
  });
};

module.exports = { uploadImages };
