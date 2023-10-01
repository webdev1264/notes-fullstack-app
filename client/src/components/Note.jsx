const Note = ({ note, toggleImportance }) => {
  const label = "Make " + (note.important ? "not important" : "important");
  return (
    <li className="note">
      {note.content}{" "}
      <button onClick={() => toggleImportance(note.id)}>{label}</button>
    </li>
  );
};

export default Note;
