const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../models/user");

userRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}).populate("notes", {
      content: 1,
      important: 1,
    });
    res.json(users);
  } catch (e) {
    next(e);
  }
});

userRouter.post("/", async (req, res, next) => {
  const { userName, name, password } = req.body;

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      userName,
      name,
      passwordHash,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (e) {
    next(e);
  }
});

module.exports = userRouter;
