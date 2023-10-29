const notesRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Note = require("../models/note");
const User = require("../models/user");

const getTokenFrom = (request) => {
  const authorization = request.get("Authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

notesRouter.get("/", async (req, res, next) => {
  try {
    const notes = await Note.find({}).populate("user", {
      userName: 1,
      name: 1,
    });
    res.json(notes);
  } catch (e) {
    next(e);
  }
});

notesRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const note = await Note.findById(id);
    if (note) {
      res.json(note);
    } else {
      res.status(404).end();
    }
  } catch (e) {
    next(e);
  }
});

notesRouter.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    await Note.findByIdAndRemove(id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

notesRouter.post("/", async (req, res, next) => {
  const body = req.body;
  // if (body.content === undefined) {
  //   return res.status(400).json({ error: "content is missing" }); //400 - bad request
  // }

  try {
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
    if (!decodedToken.id) {
      return res.status(401).json({ error: "token invalid" });
    }

    const user = await User.findById(decodedToken.id);

    const note = new Note({
      content: body.content,
      important: body.important || false,
      user: user.id,
    });

    const savedNote = await note.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();

    res.status(201).json(savedNote);
  } catch (e) {
    next(e);
  }
});

notesRouter.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  const updatedNote = req.body;
  try {
    const returnedNote = await Note.findByIdAndUpdate(id, updatedNote, {
      new: true,
      runValidators: true,
      context: "query",
    }); //option {new:true} is used to return the modified object(returnedNote). runValidators and context are required for validation check (see noteSchema)

    res.json(returnedNote);
  } catch (e) {
    next(e);
  }
});

module.exports = notesRouter;
