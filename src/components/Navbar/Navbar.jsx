import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{ padding: "10px", background: "#333", color: "#fff" }}>
      <Link to="/" style={{ color: "white", marginRight: "10px" }}>
        Home
      </Link>
      {user ? (
        <>
          <Link to="/dashboard" style={{ color: "white", marginRight: "10px" }}>
            Dashboard
          </Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: "white", marginRight: "10px" }}>
            Login
          </Link>
          <Link to="/register" style={{ color: "white" }}>
            Register
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
