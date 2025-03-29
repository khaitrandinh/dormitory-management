import React, { useEffect, useState, useContext } from "react";
import axios from "../services/axios";
import { FaTrash } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import "../Styles/AdminPage.css"; // You may rename this to UserManagement.css

const AdminPage = () => {
  const { role } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/admin/users");
      setUsers(response.data);
    } catch (err) {
      setError("Failed to load user list.");
      console.error("Error:", err);
    }
  };

  const updateRole = async (id, newRole) => {
    setLoading(true);
    try {
      await axios.put(`/admin/users/${id}`, { role: newRole });
      fetchUsers();
    } catch (err) {
      setError("Failed to update user role.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    setLoading(true);
    try {
      await axios.put(`/admin/users/${id}`, { status: newStatus });
      fetchUsers();
    } catch (err) {
      setError("Failed to update user status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    try {
      await axios.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      setError("Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-wrapper">
          <h2 className="page-title">User Management</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="table-responsive">
            <table className="table table-hover user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  {role === "admin" && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>

                    <td>
                      {role === "admin" ? (
                        <select
                          disabled={loading}
                          value={user.role}
                          onChange={(e) => updateRole(user.id, e.target.value)}
                          className="form-select"
                        >
                          <option value="admin">Admin</option>
                          <option value="staff">Staff</option>
                          <option value="student">Student</option>
                        </select>
                      ) : (
                        user.role
                      )}
                    </td>

                    <td>
                      {role === "admin" ? (
                        <select
                          disabled={loading}
                          value={user.status}
                          onChange={(e) => updateStatus(user.id, e.target.value)}
                          className={`form-select status-${user.status}`}
                        >
                          <option value="active">Active</option>
                          <option value="banned">Banned</option>
                        </select>
                      ) : (
                        <span
                          className={`badge bg-${user.status === "active" ? "success" : "danger"}`}
                        >
                          {user.status === "active" ? "Active" : "Banned"}
                        </span>
                      )}
                    </td>

                    {role === "admin" && (
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(user.id)}
                          disabled={loading}
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <p className="text-center text-muted mt-3">No users found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
