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

app.get("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  Note.findById(id).then((note) => {
    if (note) {
      return res.json(note);
    }
    return res.status(404).end();
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  Note.findByIdAndDelete(id).then((deletedNote) => {
    console.log(deletedNote);
    res.json(deletedNote);
  });
});

app.post("/api/notes/", (req, res) => {
  const body = req.body;
  if (!body.content) {
    return res.status(400).json({ error: "content is missing" }); //400 - bad request
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save().then((savedNote) => {
    res.json(savedNote);
  });
});

app.put("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const updatedNote = req.body;
  Note.findByIdAndUpdate(id, updatedNote)
    .then((returnedNote) => {
      res.json(returnedNote);
    })
    .catch((e) => {
      res.status(500).json({ error: "Bad request", message: e.message });
    });
});

app.use((req, res) => {
  res.status(404).json({ error: "Unknown endpoint." });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
