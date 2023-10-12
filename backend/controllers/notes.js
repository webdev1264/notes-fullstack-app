const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", async (req, res, next) => {
  try {
    const notes = await Note.find({});
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

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  try {
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (e) {
    next(e);
  }
});

notesRouter.put("/:id", (req, res, next) => {
  const id = req.params.id;
  const updatedNote = req.body;
  Note.findByIdAndUpdate(id, updatedNote, {
    new: true,
    runValidators: true,
    context: "query",
  }) //option {new:true} is used to return the modified object(returnedNote). runValidators and context are required for validation check (see noteSchema)
    .then((returnedNote) => {
      res.json(returnedNote);
    })
    .catch((e) => {
      next(e);
    });
});

module.exports = notesRouter;
