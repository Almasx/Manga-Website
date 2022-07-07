const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const path = require("path");
const port = process.env.PORT || 5000;
const { errorHandler } = require("./middleware/errorMiddleware");
const { logger } = require("./middleware/loggingMiddleware");
const connectDB = require("./config/db");

connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(errorHandler);
app.use(logger);

app.use("/uploads", require("./routes/staticRoutes"));
app.use("/api/manga", require("./routes/mangaRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.listen(port, () => console.log(`Server started on port ${port}`));
