import React, { useEffect, useState, useContext } from "react";
import axios from "../services/axios";
import { FaUsers, FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import "../Styles/AdminPage.css";


const AdminPage = () => {
  const { role } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-wrapper">
          <div className="content-header">
            <div className="container-fluid">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="content-title">
                    <FaUsers className="page-icon" />
                    User Management
                  </h1>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                      <li className="breadcrumb-item active">User Management</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          <div className="content-body">
            <div className="container-fluid">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="search-box mb-4">
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaSearch />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                      {error}
                      <button type="button" className="btn-close" onClick={() => setError("")}></button>
                    </div>
                  )}

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          {role === "admin" && <th className="text-end">Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                              {role === "admin" ? (
                                <select
                                  disabled={loading}
                                  value={user.role}
                                  onChange={(e) => updateRole(user.id, e.target.value)}
                                  className="form-select form-select-sm"
                                >
                                  <option value="admin">Admin</option>
                                  <option value="staff">Staff</option>
                                  <option value="student">Student</option>
                                </select>
                              ) : (
                                <span className="text-capitalize">{user.role}</span>
                              )}
                            </td>
                            <td>
                              {role === "admin" ? (
                                <select
                                  disabled={loading}
                                  value={user.status}
                                  onChange={(e) => updateStatus(user.id, e.target.value)}
                                  className="form-select form-select-sm"
                                >
                                  <option value="active">Active</option>
                                  <option value="banned">Banned</option>
                                </select>
                              ) : (
                                <span className={`badge bg-${user.status === "active" ? "success" : "danger"}`}>
                                  {user.status === "active" ? "Active" : "Banned"}
                                </span>
                              )}
                            </td>
                            {role === "admin" && (
                              <td className="text-end">
                                <button
                                  className="btn btn-soft-danger btn-sm"
                                  onClick={() => handleDelete(user.id)}
                                  disabled={loading}
                                >
                                  <FaTrash className="me-1" />
                                  <span className="ms-1">Delete</span>
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {users.length === 0 && (
                    <div className="text-center text-muted mt-3">
                      No users found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;