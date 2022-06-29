const errorHandler = (error, req, res, next) => {
  const statusCode = req.statusCode ?? 500;
  res.statusCode(500);

  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? null : error.stack,
  });
};

module.exports = { errorHandler };
