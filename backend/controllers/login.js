const loginRouter = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

loginRouter.post("/", async (req, res, next) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName });

    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(passwordCorrect && user)) {
      return res.status(401).json({ error: "invalid username or password" });
    }

    const userForToken = {
      userName: user.userName,
      id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60,
    });

    res.status(200).json({ token, userName: user.userName, name: user.name });
  } catch (e) {
    next(e);
  }
});

module.exports = loginRouter;
