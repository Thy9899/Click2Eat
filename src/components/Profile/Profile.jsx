import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";
import { AuthContext } from "../../context/AuthContext";

const Profile = ({ logout }) => {
  const { user } = useContext(AuthContext);

  if (!user) return null; // safety check

  return (
    <div className="sub-menu-wrap">
      <div className="sub-menu">
        {/* User info */}
        <div className="user-info">
          <img
            src={
              `http://localhost:5000/Images/${user.image}` ||
              "./Photos/profile.png"
            }
            alt={user.username}
          />
          <h3>{user.username}</h3>
        </div>
        <hr />

        {/* Links */}
        <Link to="/profile" className="sub-menu-link">
          <img
            src="https://images.icon-icons.com/1769/PNG/512/4092564-about-mobile-ui-profile-ui-user-website_114033.png"
            alt="profile"
          />
          <p>View Profile</p>
        </Link>

        <button className="sub-menu-link logout-btn-form" onClick={logout}>
          <img
            src="https://images.icon-icons.com/2098/PNG/512/log_out_icon_128821.png"
            alt="logout"
          />
          <p>Logout</p>
        </button>
      </div>
    </div>
  );
};

export default Profile;
