import { useState, useContext, useEffect } from "react";
import "./Users.css";
import { AuthContext } from "../../context/AuthContext";

const Users = () => {
  const { admins, fetchAdmins, register, loading, error } =
    useContext(AuthContext);

  const [openDrawer, setOpenDrawer] = useState(false);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [permission, setPermission] = useState("");

  // Add User Form
  const [form, setForm] = useState({
    role: "",
    email: "",
    username: "",
    password: "",
    status: true,
  });

  //==========================
  //  FETCH ADMINS
  //==========================
  useEffect(() => {
    fetchAdmins();
  }, []);

  // ==========================
  // FILTER LOGIC
  //==========================
  const filteredUsers = admins.filter((user) => {
    const matchSearch =
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase());

    const matchPermission = permission ? user.role === permission : true;

    return matchSearch && matchPermission;
  });

  // ==========================
  // HANDLE FORM CHANGE
  //==========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ==========================
  // SAVE USER
  //==========================
  const handleSave = async () => {
    if (!form.email || !form.username || !form.password || !form.role) {
      alert("All fields are required");
      return;
    }

    const result = await register(form);

    if (result.success) {
      alert("User created successfully");
      setOpenDrawer(false);
      setForm({
        role: "",
        email: "",
        username: "",
        password: "",
        status: true,
      });
      fetchAdmins(); // refresh admins list after adding
    }
  };

  return (
    <div>
      <h2>User’s List</h2>

      <div className="app-container">
        {/* ========================== HEADER ========================== */}
        <div className="user-header">
          <button className="add-btn" onClick={() => setOpenDrawer(true)}>
            + Add New User
          </button>

          <div className="filters">
            <div className="user-search">
              <i className="bx bx-search-alt icon"></i>
              <input
                type="search"
                placeholder="Search user name, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
            >
              <option value="">User Permissions</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="cashier">Cashier</option>
            </select>
          </div>
        </div>
        <div>
          {loading ? (
            // SHOW LOADING SPINNER
            <div className="spinner-border text-info spinner-center"></div>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <>
              {/* ========================== TABLE ========================== */}
              <table className="user-table">
                <thead>
                  <tr>
                    <th>User Permissions</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, i) => (
                      <tr key={i}>
                        <td>{user.role}</td>
                        <td>{user.email}</td>
                        <td>{user.username}</td>
                        <td>
                          <span className="status active">
                            {user.status ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <button className="edit-btn">Edit</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* ========================== DRAWER ========================== */}
              {openDrawer && (
                <div className="drawer-overlay">
                  <div className="drawer">
                    <h3>Add New User</h3>

                    <label>Role *</label>
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- select role --</option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                      <option value="cashier">Cashier</option>
                    </select>

                    <label>Email *</label>
                    <input
                      name="email"
                      autoComplete="new-email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="example@gmail.com"
                    />

                    <label>Username *</label>
                    <input
                      name="username"
                      autoComplete="off"
                      value={form.username}
                      onChange={handleChange}
                      required
                      placeholder="your name"
                    />

                    <label>Password *</label>
                    <input
                      type="password"
                      name="password"
                      autoComplete="new-password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="your password"
                    />

                    <label>Status</label>
                    <div className="toggle">
                      <input
                        type="checkbox"
                        name="status"
                        checked={form.status}
                        onChange={handleChange}
                      />
                      <span>{form.status ? "Active" : "Inactive"}</span>
                    </div>

                    {error && <p className="error">{error}</p>}

                    <hr />

                    <div className="drawer-actions">
                      <button
                        className="cancel"
                        onClick={() => setOpenDrawer(false)}
                      >
                        Cancel
                      </button>

                      <button
                        className="save"
                        onClick={handleSave}
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
