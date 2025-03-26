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
    <div className="student-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-wrapper">
          <h2 className="page-title">Student Information</h2>

          {role !== "student" && (
            <input
              type="text"
              placeholder="Search by name or student code"
              className="form-control mb-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Student Code</th>
                  <th>Full Name</th>
                  <th>Gender</th>
                  <th>Birth Date</th>
                  <th>Class</th>
                  <th>Faculty</th>
                  <th>Phone</th>
                  <th>Room</th>
                  <th>Action</th>
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
                      <td>
                        {canEdit && (
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleUpdate(student)}
                            >
                              <FaEdit /> Save
                            </button>
                            {isEditable && (
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(student.id)}
                              >
                                <FaTrash /> Delete
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
  );
};

export default StudentPage;
