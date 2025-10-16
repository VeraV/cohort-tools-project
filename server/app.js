const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const CohortModel = require("./models/Cohort.model");
const StudentModel = require("./models/Student.model");
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
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

const authRoutes = require("./routes/auth.routes");
const UserModel = require("./models/User.model");
const { isAuthenticated } = require("./middleware/jwt.middleware");
app.use("/auth", authRoutes);

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

/******************* Cohorts **************************/
app.get("/api/cohorts", (req, res) => {
  CohortModel.find({})
    .then((cohorts) => {
      console.log("Retrieved cohorts ->", cohorts);
      res.status(200).json(cohorts);
    })
    .catch((error) => {
      next(error);
    });
});

app.post("/api/cohorts", async (req, res, next) => {
  try {
    const newCohort = await CohortModel.create(req.body);
    console.log("New cohort ->", newCohort);
    res.status(201).json(newCohort);
  } catch (error) {
    next(error);
  }
});

app.get("/api/cohorts/:cohortId", async (req, res, next) => {
  try {
    const foundCohort = await CohortModel.findById(req.params.cohortId);
    console.log("Found cohort ->", foundCohort);
    res.status(200).json(foundCohort);
  } catch (error) {
    next(error);
    // console.error("Error while finding a cohort ->", error);
    // res.status(500).json({ error: "Failed to find a cohort" });
  }
});

app.put("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const updatedCohort = await CohortModel.findByIdAndUpdate(
      req.params.cohortId,
      req.body,
      { new: true }
    );
    console.log("Updated cohort ->", updatedCohort);
    res.status(200).json(updatedCohort);
  } catch (error) {
    console.error("Error while updating a cohort ->", error);
    res.status(500).json({ error: "Failed to update a cohort" });
  }
});

app.delete("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const deletedCohort = await CohortModel.findByIdAndDelete(
      req.params.cohortId
    );
    console.log("Deleted cohort ->", deletedCohort);
    res.status(200).json(deletedCohort);
  } catch (error) {
    console.error("Error while deleting a cohort ->", error);
    res.status(500).json({ error: "Failed to delete a cohort" });
  }
});
/******************* Students **************************/

app.get("/api/students", (req, res) => {
  StudentModel.find({})
    .populate("cohort", "cohortName leadTeacher -_id")
    .then((students) => {
      console.log("Retrieved students ->", students);
      res.status(200).json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});

//create a new student
app.post("/api/students", async (req, res) => {
  try {
    const newStudent = await StudentModel.create(req.body);
    console.log("New student created: ", newStudent);
    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Error while creating a new student ->", error);
    res.status(500).json({ error: "Failed to create a student" });
  }
});

app.get("/api/students/:studentId", async (req, res) => {
  try {
    const foundStudent = await StudentModel.findById(
      req.params.studentId
    ).populate("cohort", "cohortName leadTeacher -_id");
    console.log("Found Student --> ", foundStudent);
    res.status(200).json(foundStudent);
  } catch (error) {
    console.error("Error while finding a student ->", error);
    res.status(500).json({ error: "Failed to find a student" });
  }
});

app.get("/api/students/cohort/:cohortId", async (req, res) => {
  try {
    const { cohortId } = req.params;
    const foundStudents = await StudentModel.find({
      cohort: cohortId,
    }).populate("cohort", "cohortName leadTeacher -_id");
    console.log("Found Students --> ", foundStudents);
    res.status(200).json(foundStudents);
  } catch (error) {
    console.error("Error while finding students of cohort ->", error);
    res.status(500).json({ error: "Failed to find all students of cohort" });
  }
});

app.put("/api/students/:studentId", async (req, res) => {
  try {
    const updatedStudent = await StudentModel.findByIdAndUpdate(
      req.params.studentId,
      req.body,
      { new: true }
    );
    console.log("Updated student ->", updatedStudent);
    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error("Error while updating a student ->", error);
    res.status(500).json({ error: "Failed to update a student" });
  }
});

app.delete("/api/students/:studentId", async (req, res) => {
  try {
    const deletedStudent = await StudentModel.findByIdAndDelete(
      req.params.studentId
    );
    console.log("Deleted student ->", deletedStudent);
    res.status(200).json(deletedStudent);
  } catch (error) {
    console.error("Error while deleting a student ->", error);
    res.status(500).json({ error: "Failed to delete a student" });
  }
});

app.get("/api/users/:userId", isAuthenticated, async (req, res) => {
  try {
    const theUser = await UserModel.findById(req.params.userId);
    res.status(200).json(theUser);
  } catch (error) {
    console.error("Error while getting a user ->", error);
    res.status(500).json({ error: "Failed to get a user" });
  }
});

// START SERVER ---- moved to index.js
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

app.use(errorHandler);
app.use(notFoundHandler);

module.exports = app; // export the app so tests can import it
