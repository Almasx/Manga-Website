const multer = require("multer");
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
const uploadImages = (req, res, next) => {
  uploadFiles(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Too many images exceeding the allowed limit
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        console.log(err);
        res.status(401);
        throw new Error("Too many images");
      }
    } else if (err) {
      console.log(error);
      res.status(401);
      throw new Error("Not uploaded");
    }

    next();
  });
};

module.exports = { uploadImages };
