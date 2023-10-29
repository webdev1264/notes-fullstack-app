import { useEffect, useState } from "react";
import AddNote from "./components/AddNote";
import Notes from "./components/Notes";
import ShowAll from "./components/ShowAll";
import noteService from "./services/notes";
import loginService from "./services/login";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import Form from "./components/Form";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const initialNotes = await noteService.getAll();
        setNotes(initialNotes);
      } catch (e) {
        console.log(e);
        showErrorMessage(`No content. ${e.message}`);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const userData = JSON.parse(loggedUserJSON);
      setUser(userData);
      noteService.setToken(userData.token);
    }
  }, []);

  function showSuccessMessage(note) {
    setSuccessMessage(`Added ${note.content}`);
    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  }

  function showErrorMessage(message) {
    setErrorMessage(`Error: ${message}`);
    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  }

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
    const changedNote = {
      ...note,
      user: note.user.id,
      important: !note.important,
    };
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

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userData = await loginService.login({ userName, password });
      noteService.setToken(userData.token);
      setUser(userData);
      localStorage.setItem("loggedUser", JSON.stringify(userData));
    } catch (e) {
      console.log(e.message);
      showErrorMessage("Wrong credentials");
    } finally {
      setUserName("");
      setPassword("");
    }
  };

  const loginForm = () => (
    <Form
      handleLogin={handleLogin}
      userName={userName}
      password={password}
      setUserName={setUserName}
      setPassword={setPassword}
    />
  );

  const noteForm = () => (
    <AddNote
      addNote={addNote}
      newNote={newNote}
      handleNoteChange={handleNoteChange}
    />
  );

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} className="error" />
      <Notification message={successMessage} className="success" />
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          {noteForm()}
        </div>
      )}
      <ShowAll showAll={showAll} handleShow={() => setShowAll(!showAll)} />
      <Notes notesToShow={notesToShow} toggleImportance={toggleImportance} />
      <Footer />
    </div>
  );
};

export default App;
