const router = require("express").Router();
const StudentModel = require("../models/Student.model");

router.get("/", (req, res) => {
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

router.post("/", async (req, res) => {
  try {
    const newStudent = await StudentModel.create(req.body);
    console.log("New student created: ", newStudent);
    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Error while creating a new student ->", error);
    res.status(500).json({ error: "Failed to create a student" });
  }
});

router.get("/:studentId", async (req, res) => {
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

router.get("/cohort/:cohortId", async (req, res) => {
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

router.put("/:studentId", async (req, res) => {
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

router.delete("/:studentId", async (req, res) => {
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

module.exports = router;
