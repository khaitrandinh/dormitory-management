import React, { useEffect, useState, useContext } from "react";
import axios from "../services/axios";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaEdit, FaTrash, FaUserGraduate, FaSearch } from "react-icons/fa";
import "../Styles/StudentPage.css";
const StudentPage = () => {
  const { role, user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("/students");
      if (Array.isArray(response.data)) {
        setStudents(response.data);
      } else if (response.data?.id) {
        setStudents([response.data]);
      } else {
        setStudents([]);
      }
    } catch (err) {
      setError("Failed to load students list.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this student?")) return;
    try {
      await axios.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      alert("Failed to delete student.");
    }
  };

  const handleChange = (e, id, field) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: e.target.value } : s))
    );
  };

  const handleUpdate = async (student) => {
    try {
      await axios.put(`/students/${student.id}`, student);
      alert("Student updated successfully!");
    } catch (err) {
      alert("Failed to update student.");
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
                      <FaUserGraduate className="page-icon" />
                      Student Management
                    </h1>
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                        <li className="breadcrumb-item active">Student Management</li>
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
                    {error && (
                      <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError("")}></button>
                      </div>
                    )}
  
                    {role !== "student" && (
                      <div className="search-box mb-4">
                        <div className="input-group">
                          <span className="input-group-text">
                            <FaSearch />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search by name or student code"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
  
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>Student Code</th>
                            <th>Full Name</th>
                            <th>Gender</th>
                            <th>Birth Date</th>
                            <th>Class</th>
                            <th>Faculty</th>
                            <th>Phone</th>
                            <th>Room</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.map((student) => {
                            const isEditable = role === "admin" || role === "staff";
                            const isSelf = role === "student" && student.user_id === user.id;
                            const canEdit = isEditable || isSelf;
  
                            return (
                              <tr key={student.id}>
                                <td>{student.student_code}</td>
                                <td>{student.user?.name}</td>
                                <td>
                                  {canEdit ? (
                                    <select
                                      value={student.gender}
                                      onChange={(e) => handleChange(e, student.id, "gender")}
                                      className="form-select form-select-sm"
                                    >
                                      <option value="Male">Male</option>
                                      <option value="Female">Female</option>
                                    </select>
                                  ) : (
                                    student.gender
                                  )}
                                </td>
                                <td>
                                  <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    value={student.birth_date}
                                    onChange={(e) => handleChange(e, student.id, "birth_date")}
                                    disabled={!canEdit}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control form-control-sm"
                                    value={student.class}
                                    onChange={(e) => handleChange(e, student.id, "class")}
                                    disabled={!canEdit}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control form-control-sm"
                                    value={student.faculty}
                                    onChange={(e) => handleChange(e, student.id, "faculty")}
                                    disabled={!canEdit}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control form-control-sm"
                                    value={student.phone}
                                    onChange={(e) => handleChange(e, student.id, "phone")}
                                    disabled={!canEdit}
                                  />
                                </td>
                                <td>{student.room_code || "-"}</td>
                                <td className="text-end">
                                  {canEdit && (
                                    <div className="btn-group">
                                      <button
                                        className="btn btn-soft-success btn-sm"
                                        onClick={() => handleUpdate(student)}
                                      >
                                        <FaEdit className="me-1" /> Save
                                      </button>
                                      {isEditable && (
                                        <button
                                          className="btn btn-soft-danger btn-sm ms-2"
                                          onClick={() => handleDelete(student.id)}
                                        >
                                          <FaTrash className="me-1" /> Delete
                                        </button>
                                      )}
                                    </div>
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
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default StudentPage;