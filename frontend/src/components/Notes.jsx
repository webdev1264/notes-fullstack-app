import Note from "./Note";

const Notes = ({ notesToShow, toggleImportance }) => {
  return (
    <ul>
      {notesToShow.map((note) => (
        <Note key={note.id} note={note} toggleImportance={toggleImportance} />
      ))}
    </ul>
  );
};

export default Notes;
