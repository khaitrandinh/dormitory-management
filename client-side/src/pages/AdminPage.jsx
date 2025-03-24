import React, { useEffect, useState, useContext } from "react";
import axios from "../services/axios";
import { FaTrash } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import "../Styles/AdminPage.css"; // Bạn có thể đổi tên file này thành UserManagement.css

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
      setError("Lỗi khi tải danh sách người dùng.");
      console.error("Lỗi:", err);
    }
  };

  const updateRole = async (id, newRole) => {
    setLoading(true);
    try {
      await axios.put(`/admin/users/${id}`, { role: newRole });
      fetchUsers();
    } catch (err) {
      setError("Không thể cập nhật vai trò người dùng.");
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
      setError("Không thể cập nhật trạng thái người dùng.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    setLoading(true);
    try {
      await axios.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      setError("Không thể xóa người dùng.");
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
          <h2 className="page-title">Quản Lý Người Dùng</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="table-responsive">
            <table className="table table-hover user-table">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Vai Trò</th>
                  <th>Trạng Thái</th>
                  {role === "admin" && <th>Hành Động</th>}
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
                          {user.status === "active" ? "Đang hoạt động" : "Bị cấm"}
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
                          <FaTrash /> Xóa
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <p className="text-center text-muted mt-3">Không có người dùng nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
