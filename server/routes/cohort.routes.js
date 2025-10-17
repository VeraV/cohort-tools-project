const router = require("express").Router();
const CohortModel = require("../models/Cohort.model");

router.get("/", (req, res) => {
  CohortModel.find({})
    .then((cohorts) => {
      console.log("Retrieved cohorts ->", cohorts);
      res.status(200).json(cohorts);
    })
    .catch((error) => {
      next(error);
    });
});

router.post("/", async (req, res, next) => {
  try {
    const newCohort = await CohortModel.create(req.body);
    console.log("New cohort ->", newCohort);
    res.status(201).json(newCohort);
  } catch (error) {
    next(error);
  }
});

router.get("/:cohortId", async (req, res, next) => {
  try {
    const foundCohort = await CohortModel.findById(req.params.cohortId);
    console.log("Found cohort ->", foundCohort);
    res.status(200).json(foundCohort);
  } catch (error) {
    console.error("Error while finding a cohort ->", error);
    res.status(500).json({ error: "Failed to find a cohort" });
  }
});

router.put("/:cohortId", async (req, res) => {
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

router.delete("/:cohortId", async (req, res) => {
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

module.exports = router;
