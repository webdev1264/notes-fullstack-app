const ShowAll = ({ showAll, handleShow }) => {
  return (
    <div>
      <button onClick={handleShow}>Show {showAll ? "important" : "all"}</button>
    </div>
  );
};

export default ShowAll;
