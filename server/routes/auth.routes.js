const router = require("express").Router();
const UserModel = require("../models/User.model");
require("dotenv").config();

//variable for bcrypt
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { isAuthenticated } = require("../middleware/jwt.middleware"); // <== IMPORT

const saltRounds = 10;
//a '/signup' route to create a new user
router.post("/signup", async (req, res) => {
  try {
    // first check if the email already is taken in the DB
    const foundUserWithEmail = await UserModel.findOne({
      email: req.body.email,
    });

    if (foundUserWithEmail) {
      res.status(403).json({ errorMessage: "Invalid Credentials" });
    } else {
      //create the salt
      const theSalt = bcryptjs.genSaltSync(12);
      const hashedPassword = bcryptjs.hashSync(req.body.password, theSalt);
      //create user with the encrypted password
      const createdUser = await UserModel.create({
        ...req.body,
        password: hashedPassword,
      });
      // find the user you just created without the password
      const foundUser = await UserModel.findById(createdUser._id).select(
        "username email"
      );

      res.status(201).json(foundUser);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//a '/login' route to find a user based on the email and compare the passwords
router.post("/login", async (req, res) => {
  try {
    //first try to find the user based on the email
    const foundUser = await UserModel.findOne({ email: req.body.email });

    if (!foundUser) {
      res.status(403).json({ errorMessage: "Invalid Credentials" });
    } else {
      //if the founduser exists with the email, check the passwords
      const doesPasswordMatch = bcryptjs.compareSync(
        req.body.password,
        foundUser.password
      );
      if (doesPasswordMatch) {
        const payload = { _id: foundUser._id };

        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6d",
        });

        res
          .status(200)
          .json({ message: "You are logged in!", authToken: authToken });
      } else {
        res.status(403).json({ errorMessage: "Invalid Credentials" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/verify", isAuthenticated, async (req, res) => {
  try {
    console.log(`req.payload`, req.payload);
    res.status(200).json(req.payload);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
