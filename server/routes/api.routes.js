const router = require("express").Router();
const UserModel = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/users/:userId", isAuthenticated, async (req, res) => {
  try {
    const theUser = await UserModel.findById(req.params.userId);
    res.status(200).json(theUser);
  } catch (error) {
    console.error("Error while getting a user ->", error);
    res.status(500).json({ error: "Failed to get a user" });
  }
});

module.exports = router;
