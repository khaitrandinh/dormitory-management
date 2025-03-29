import React, { useEffect, useState } from "react";
import axios from "../services/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaCheckCircle, FaTimesCircle, FaClipboardList } from "react-icons/fa";
import "../Styles/RoomApproval.css";
const RoomApprovalPage = () => {
  const [requests, setRequests] = useState([]);
  const [cancelRequests, setCancelRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  useEffect(() => {
    fetchRoomRequests();
  }, []);

  const fetchRoomRequests = async () => {
    try {
      const res = await axios.get("/students");
      const all = res.data;
      setRequests(all.filter(s => s.room_request_status === "pending"));
      setCancelRequests(all.filter(s => s.room_cancel_status === "pending")); 
    } catch (err) {
      console.error("Failed to fetch room requests", err);
    }
  };
  

  const handleApprove = async (studentId) => {
    try {
      await axios.put(`/students/${studentId}/approve-room`);
      setMessage("Room request approved.");
      fetchRoomRequests();
    } catch (err) {
      console.error("Approval failed", err);
      setMessage(" Failed to approve request.");
    }
  };

  const handleReject = async (studentId) => {
    try {
      await axios.put(`/students/${studentId}/reject-room`);
      setMessage(" Room request rejected.");
      fetchRoomRequests();
    } catch (err) {
      console.error("Rejection failed", err);
      setMessage(" Failed to reject request.");
    }
  };

  const handleApproveCancel = async (studentId) => {
    try {
      await axios.put(`/students/${studentId}/approve-cancel-room`);
      setMessage("Cancel request approved.");
      fetchRoomRequests();
    } catch (err) {
      console.error("Approve cancel failed", err);
      setMessage("Failed to approve cancel request.");
    }
  };

  const handleRejectCancel = async (studentId) => {
    try {
      await axios.put(`/students/${studentId}/reject-cancel-room`);
      setMessage("Cancel request rejected.");
      fetchRoomRequests();
    } catch (err) {
      console.error("Reject cancel failed", err);
      setMessage("Failed to reject cancel request.");
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
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
                    <FaClipboardList className="page-icon" />
                    Room Approval Management
                  </h1>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                      <li className="breadcrumb-item active">Room Approvals</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          <div className="content-body">
            <div className="container-fluid">
              {message && (
                <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
                  {message}
                  <button type="button" className="btn-close" onClick={() => setMessage("")}></button>
                </div>
              )}

              {/* Room Selection Requests Section */}
              <div className="card shadow-sm mb-4">
                <div className="card-header">
                  <h5 className="card-title mb-0">Room Selection Requests</h5>
                </div>
                <div className="card-body">
                  {requests.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted mb-0">No pending room selection requests</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>Student Name</th>
                            <th>Room Code</th>
                            <th>Faculty</th>
                            <th>Phone</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requests.map((student) => (
                            <tr key={student.id}>
                              <td>{student.user?.name}</td>
                              <td>{student.room_code}</td>
                              <td>{student.faculty}</td>
                              <td>{student.phone}</td>
                              <td className="text-end">
                                <button
                                  className="btn btn-soft-success btn-sm me-2"
                                  onClick={() => handleApprove(student.id)}
                                >
                                  <FaCheckCircle className="me-1" /> Approve
                                </button>
                                <button
                                  className="btn btn-soft-danger btn-sm"
                                  onClick={() => handleReject(student.id)}
                                >
                                  <FaTimesCircle className="me-1" /> Reject
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Cancel Room Requests Section */}
              <div className="card shadow-sm">
                <div className="card-header">
                  <h5 className="card-title mb-0">Cancel Room Requests</h5>
                </div>
                <div className="card-body">
                  {cancelRequests.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted mb-0">No pending cancel requests</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>Student Name</th>
                            <th>Room Code</th>
                            <th>Faculty</th>
                            <th>Phone</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cancelRequests.map((student) => (
                            <tr key={student.id}>
                              <td>{student.user?.name}</td>
                              <td>{student.room_code}</td>
                              <td>{student.faculty}</td>
                              <td>{student.phone}</td>
                              <td className="text-end">
                                <button
                                  className="btn btn-soft-warning btn-sm me-2"
                                  onClick={() => handleApproveCancel(student.id)}
                                >
                                  <FaCheckCircle className="me-1" /> Approve Cancel
                                </button>
                                <button
                                  className="btn btn-soft-secondary btn-sm"
                                  onClick={() => handleRejectCancel(student.id)}
                                >
                                  <FaTimesCircle className="me-1" /> Reject Cancel
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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

export default RoomApprovalPage;
