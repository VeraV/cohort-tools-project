const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const {
  errorHandler,
  notFoundHandler,
} = require("./middleware/error-handling");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// STATIC DATA

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

const authRoutes = require("./routes/auth.routes");
const apiRoutes = require("./routes/api.routes");
const studentRoutes = require("./routes/student.routes");
const cohortRoutes = require("./routes/cohort.routes");

app.use("/auth", authRoutes);

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

app.use("/api/students", studentRoutes);
app.use("/api/cohorts", cohortRoutes);
app.use("/api", apiRoutes);
app.use(notFoundHandler);

module.exports = app; // export the app so tests can import it
