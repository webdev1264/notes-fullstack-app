const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

notesRouter.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Note.findById(id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((e) => {
      next(e);
    });
});

notesRouter.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Note.findByIdAndRemove(id)
    .then((deletedNote) => {
      console.log(deletedNote);
      res.status(202).end();
    })
    .catch((e) => {
      next(e);
    });
});

notesRouter.post("/", (req, res, next) => {
  const body = req.body;
  // if (body.content === undefined) {
  //   return res.status(400).json({ error: "content is missing" }); //400 - bad request
  // }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => {
      res.json(savedNote);
    })
    .catch((e) => {
      next(e);
    });
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
