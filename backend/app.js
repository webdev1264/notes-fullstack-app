const express = require("express");
const cors = require("cors");
const app = express();
const notesRouter = require("./controllers/notes");
const middleware = require("./utils/middleware");

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);

app.use(middleware.unknownEndpoint);

app.use(middleware.errorHandler);

module.exports = app;