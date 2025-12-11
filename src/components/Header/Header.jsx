import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Header.css";

const Header = ({ className }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className={`header ${className || ""}`}>
      <span className="title">Click2Eat Admin</span>

      {user ? (
        <div className="user-info">
          <span className="username">{user.username}</span>
          <img
            src={user.image ? `${user.image}` : "/default-avatar.png"}
            alt="Profile"
            className="profile-pic"
          />
        </div>
      ) : (
        <div className="user-info">
          <span className="username">Guest</span>
        </div>
      )}
    </div>
  );
};

export default Header;
