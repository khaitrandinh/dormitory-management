import React, { useEffect, useState, useContext } from "react";
import axios from "../services/axios";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../Styles/StudentPage.css";

const StudentPage = () => {
  const { role, user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, []);
  
  const fetchStudents = async () => {
    try {
      const response = await axios.get("/students");
  
      // Fix quan trọng: kiểm tra response có phải mảng
      if (Array.isArray(response.data)) {
        setStudents(response.data);
      } else if (response.data?.id) {
        setStudents([response.data]); // nếu trả về 1 student object → đưa vào mảng
      } else {
        setStudents([]);
      }
  
    } catch (err) {
      setError("Không thể tải danh sách sinh viên");
    }
  };
  

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sinh viên này?")) return;
    try {
      await axios.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      alert("Không thể xóa sinh viên");
    }
  };

  const handleChange = (e, id, field) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, [field]: e.target.value } : s
      )
    );
  };

  const handleUpdate = async (student) => {
    try {
      await axios.put(`/students/${student.id}`, student);
      alert("Cập nhật thành công!");
    } catch (err) {
      alert("Không thể cập nhật sinh viên");
    }
  };

  const filteredStudents = Array.isArray(students)
    ? students.filter((s) =>
        role === "student"
          ? s.user_id === user.id
          : s.student_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="student-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-wrapper">
          <h2 className="page-title">Thông Tin Sinh Viên</h2>

          {role !== "student" && (
            <input
              type="text"
              placeholder="Tìm theo tên hoặc mã sinh viên"
              className="form-control mb-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Mã SV</th>
                  <th>Họ Tên</th>
                  <th>Giới Tính</th>
                  <th>Ngày Sinh</th>
                  <th>Lớp</th>
                  <th>Khoa</th>
                  <th>SĐT</th>
                  <th>Phòng</th>
                  {(role === "admin" || role === "staff" || role === "student") && (
                    <th>Hành động</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const canEdit = role === "admin" || role === "staff" || (role === "student" && student.user_id === user.id);

                  return (
                    <tr key={student.id}>
                      <td>{student.student_code}</td>
                      <td>{student.user?.name}</td>
                      <td>
                        {canEdit ? (
                          <select
                            value={student.gender}
                            onChange={(e) => handleChange(e, student.id, "gender")}
                          >
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                          </select>
                        ) : (
                          student.gender
                        )}
                      </td>
                      <td>
                        <input
                          type="date"
                          value={student.birth_date}
                          onChange={(e) => handleChange(e, student.id, "birth_date")}
                          disabled={!canEdit}
                        />
                      </td>
                      <td>
                        <input
                          value={student.class}
                          onChange={(e) => handleChange(e, student.id, "class")}
                          disabled={!canEdit}
                        />
                      </td>
                      <td>
                        <input
                          value={student.faculty}
                          onChange={(e) => handleChange(e, student.id, "faculty")}
                          disabled={!canEdit}
                        />
                      </td>
                      <td>
                        <input
                          value={student.phone}
                          onChange={(e) => handleChange(e, student.id, "phone")}
                          disabled={!canEdit}
                        />
                      </td>
                      <td>{student.room_code || "-"}</td>
                      <td>
                        {canEdit && (
                          <>
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => handleUpdate(student)}
                            >
                              <FaEdit />
                            </button>
                            {(role === "admin" || role === "staff") && (
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(student.id)}
                              >
                                <FaTrash />
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
