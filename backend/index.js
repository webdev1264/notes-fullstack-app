require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((note) => note.id)) : 0;
  return maxId + 1;
};

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.get("/api/notes", (req, res) => {
  try {
    res.json(notes);
  } catch (e) {
    console.log(e);
  }
});

app.get("/api/notes/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const note = notes.find((note) => note.id === id);
    if (note) {
      return res.json(note);
    }
    return res.status(404).end();
  } catch (e) {
    console.log(e);
  }
});

app.delete("/api/notes/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    notes = notes.filter((note) => note.id !== id);
    res.status(204).end();
  } catch (e) {
    console.log(e);
  }
});

app.post("/api/notes/", (req, res) => {
  try {
    const body = req.body;
    if (!body.content) {
      return res.status(400).json({ error: "content is missing" }); //400 - bad request
    }
    const note = {
      id: generateId(),
      important: body.important || false,
      content: body.content,
    };

    notes.push(note);
    res.json(note);
  } catch (e) {
    console.log(e);
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
