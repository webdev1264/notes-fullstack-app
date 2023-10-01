const AddNote = ({ addNote, newNote, handleNoteChange }) => {
  return (
    <form onSubmit={addNote}>
      <input type="text" value={newNote} onChange={handleNoteChange} />
      <button type="submit">save</button>
      <br />
    </form>
  );
};

export default AddNote;
