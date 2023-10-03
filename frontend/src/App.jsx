import { useEffect, useState } from "react";
import AddNote from "./components/AddNote";
import Notes from "./components/Notes";
import ShowAll from "./components/ShowAll";
import noteService from "./services/notes";
import Notification from "./components/Notification";
import Footer from "./components/Footer";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      console.log(initialNotes);
      setNotes(initialNotes);
    });
  }, []);

  const showSuccessMessage = (note) => {
    setSuccessMessage(`Added ${note.content}`);
    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  };
  const showErrorMessage = (message) => {
    setErrorMessage(`Error: ${message}`);
    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  };

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    };
    noteService
      .create(noteObject)
      .then((returnedNote) => {
        console.log(returnedNote);
        setNotes(notes.concat(returnedNote));
        setNewNote("");
        showSuccessMessage(returnedNote);
      })
      .catch((e) => {
        console.log(e);
        showErrorMessage(e.response.data.error);
      });
  };

  const handleNoteChange = (e) => {
    setNewNote(e.target.value);
  };

  const toggleImportance = (id) => {
    const note = notes.find((note) => note.id === id);
    const changedNote = { ...note, important: !note.important };
    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        console.log(returnedNote);
        const updatedNotes = notes.map((note) =>
          note.id === id ? returnedNote : note
        );
        console.log(updatedNotes);
        setNotes(updatedNotes);
      })
      .catch((error) => {
        setErrorMessage(
          `The note '${note.content}' was already deleted from server. Error ${error.message}`
        );
        setTimeout(() => setErrorMessage(""), 5000);
        notes.filter((note) => note.id !== id);
      });
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} className="error" />
      <Notification message={successMessage} className="success" />
      <ShowAll showAll={showAll} handleShow={() => setShowAll(!showAll)} />
      <Notes notesToShow={notesToShow} toggleImportance={toggleImportance} />
      <AddNote
        addNote={addNote}
        newNote={newNote}
        handleNoteChange={handleNoteChange}
      />
      <Footer />
    </div>
  );
};

export default App;
