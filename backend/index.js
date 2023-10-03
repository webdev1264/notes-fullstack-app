require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const Note = require("./models/note");
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

app.get("/api/notes/:id", (req, res, next) => {
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

app.delete("/api/notes/:id", (req, res, next) => {
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

app.post("/api/notes/", (req, res, next) => {
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

app.put("/api/notes/:id", (req, res, next) => {
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

app.use((req, res) => {
  res.status(404).json({ error: "Unknown endpoint." });
});

app.use((error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
