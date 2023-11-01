const Logout = ({ user, handleLogout }) => {
  return (
    <p>
      {user.name} <span>logged in</span>{" "}
      <button onClick={handleLogout}>logout</button>
    </p>
  );
};

export default Logout;
