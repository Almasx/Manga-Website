const multer = require("multer");
const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
});

// For chapter pages
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

// for manga thumbnail
const uploadFile = upload.single("thumbnail");
const uploadThumbnail = (req, res, next) => {
  uploadFile(req, res, (err) => {
    if (err) {
      console.log(err);
      res.status(401);
      throw new Error("Not uploaded");
    }

    next();
  });
};

module.exports = { uploadImages, uploadThumbnail };
