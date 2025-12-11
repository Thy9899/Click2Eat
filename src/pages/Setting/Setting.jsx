import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Setting.css";

const Setting = () => {
  const { user, setUser } = useContext(AuthContext);
  const adminId = user?.admin_id;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showEditPerDe, setShowEditPerDe] = useState(false);
  const [showEditPsss, setShowEditPsss] = useState(false);

  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    picture: null,

    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // =================================
  // UPDATE USER INFORMATION
  // =================================
  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "picture") {
      setForm((prev) => ({ ...prev, picture: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Save personal details
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("phone", form.phone);

      if (form.picture) formData.append("image", form.picture);

      const res = await fetch(
        `https://click2eat-backend-admin-service.onrender.com/api/admins/profile/${adminId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Update failed");

      const updatedAdmin = { ...user, ...data.admin };

      setUser(updatedAdmin);
      localStorage.setItem("admin", JSON.stringify(updatedAdmin));

      setMessage("✅ Profile updated successfully!");
      setShowEditPerDe(false);
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // =================================
  // UPDATE USER PASSWORD
  // =================================
  // Change password
  const handleChangePassword = async () => {
    setLoading(true);
    setMessage("");

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setMessage("❌ Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setMessage("❌ New password and confirm password do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://click2eat-backend-admin-service.onrender.com/api/admins/change-password/${adminId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");

      setMessage("✅ Password changed successfully!");

      // Clear fields
      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      setShowEditPsss(false);
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setting-container">
      <h2>Setting</h2>

      {/* ---------------- PERSONAL INFO ---------------- */}
      <div className="set-card-info">
        <div className="set-card-header">
          <h3>Personal Information</h3>
          <button
            className="edit-btn"
            onClick={() => setShowEditPerDe(!showEditPerDe)}
          >
            EDIT
          </button>
        </div>

        <hr />

        {!showEditPerDe ? (
          <div className="info-grid">
            <div className="info-row">
              <span className="label">Role</span>
              <span className="value">{user?.role}</span>
            </div>

            <div className="info-row">
              <span className="label">Email</span>
              <span className="value">{user?.email}</span>
            </div>

            <div className="info-row">
              <span className="label">Full Name</span>
              <span className="value">{user?.username}</span>
            </div>

            <div className="info-row">
              <span className="label">Phone Number</span>
              <span className="value">{user?.phone || "—"}</span>
            </div>
          </div>
        ) : (
          <form className="info-grid" onSubmit={handleSubmit}>
            <div className="info-row">
              <span className="label">Email</span>
              <input
                className="text-box"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="info-row">
              <span className="label">Full Name</span>
              <input
                className="text-box"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
              />
            </div>

            <div className="info-row">
              <span className="label">Phone Number</span>
              <input
                className="text-box"
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="info-row">
              <span className="label">Image</span>
              <input
                className="text-box"
                type="file"
                name="picture"
                onChange={handleChange}
              />
            </div>

            <button className="set-save-btn" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Save Changes"}
            </button>

            {message && <p className="set-message">{message}</p>}
          </form>
        )}
      </div>

      {/* --------------- PASSWORD CHANGE --------------- */}
      <div className="set-card-pass">
        <div className="set-card-header">
          <h3>Change Password</h3>
          <button
            className="edit-btn"
            onClick={() => setShowEditPsss(!showEditPsss)}
          >
            EDIT
          </button>
        </div>

        <hr />

        {!showEditPsss ? (
          <div className="info-grid">
            <div className="info-row">
              <span className="label">Current Password</span>
              <span className="value">••••••</span>
            </div>
          </div>
        ) : (
          <div className="info-grid">
            <div className="info-row">
              <span className="label">Current Password</span>
              <input
                className="text-box"
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                placeholder="Your current password"
              />
            </div>

            <div className="info-row">
              <span className="label">New Password</span>
              <input
                className="text-box"
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="New Password"
              />
            </div>

            <div className="info-row">
              <span className="label">Confirm Password</span>
              <input
                className="text-box"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat New Password"
              />
            </div>

            <button
              className="set-save-btn"
              type="button"
              disabled={loading}
              onClick={handleChangePassword}
            >
              {loading ? "Updating..." : "Save Password"}
            </button>

            {message && <p className="set-message">{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Setting;
