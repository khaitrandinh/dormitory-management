import React, { useEffect, useState, useContext } from "react";
import axios from "../services/axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext"; // Lấy thông tin user đăng nhập
import "../Styles/AdminPage.css";

const AdminPage = () => {
  const { role } = useContext(AuthContext); // Lấy role của user
  const [users, setUsers] = useState([]);
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

  // ✅ Cập nhật vai trò hoặc trạng thái người dùng
  const handleUpdate = async (id, field, value) => {
    try {
      await axios.put(`/admin/users/${id}`, { [field]: value });
      fetchUsers();
    } catch (err) {
      setError("Không thể cập nhật người dùng.");
      console.error("Lỗi cập nhật:", err);
    }
  };

  // ✅ Xóa người dùng
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await axios.delete(`/admin/users/${id}`);
        fetchUsers();
      } catch (err) {
        setError("Không thể xóa người dùng.");
        console.error("Lỗi xóa:", err);
      }
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
                    
                    {/* Dropdown Chỉnh Vai Trò */}
                    <td>
                      {role === "admin" ? (
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdate(user.id, "role", e.target.value)}
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

                    {/* Dropdown Chỉnh Trạng Thái */}
                    <td>
                      {role === "admin" ? (
                        <select
                          value={user.status}
                          onChange={(e) => handleUpdate(user.id, "status", e.target.value)}
                          className={`form-select status-${user.status}`}
                        >
                          <option value="active">Active</option>
                          <option value="banned">Banned</option>
                        </select>
                      ) : (
                        <span className={`badge status-${user.status}`}>
                          {user.status}
                        </span>
                      )}
                    </td>

                    {/* Nút Hành Động */}
                    {role === "admin" && (
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(user.id)}
                        >
                          <FaTrash /> Xóa
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
