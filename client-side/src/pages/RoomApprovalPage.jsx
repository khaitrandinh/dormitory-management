import React, { useEffect, useState } from "react";
import axios from "../services/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../Styles/RoomApproval.css";

const RoomApprovalPage = () => {
  const [requests, setRequests] = useState([]);
  const [cancelRequests, setCancelRequests] = useState([]);
  const [message, setMessage] = useState("");

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

  return (
    <div className="room-approval-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-wrapper">
          <h2 className="page-title">Room Selection Requests</h2>
          {message && <div className="alert alert-info">{message}</div>}

          {requests.length === 0 ? (
            <p className="text-muted">No room selection requests.</p>
          ) : (
            <table className="table table-bordered table-striped mb-5">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Room Code</th>
                  <th>Faculty</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((student) => (
                  <tr key={student.id}>
                    <td>{student.user?.name}</td>
                    <td>{student.room_code}</td>
                    <td>{student.faculty}</td>
                    <td>{student.phone}</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleApprove(student.id)}
                      >
                        <FaCheckCircle /> Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleReject(student.id)}
                      >
                        <FaTimesCircle /> Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h2 className="page-title mt-4">Cancel Room Requests</h2>

          {cancelRequests.length === 0 ? (
            <p className="text-muted">No cancel requests.</p>
          ) : (
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Room Code</th>
                  <th>Faculty</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cancelRequests.map((student) => (
                  <tr key={student.id}>
                    <td>{student.user?.name}</td>
                    <td>{student.room_code}</td>
                    <td>{student.faculty}</td>
                    <td>{student.phone}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleApproveCancel(student.id)}
                      >
                        <FaCheckCircle /> Approve Cancel
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleRejectCancel(student.id)}
                      >
                        <FaTimesCircle /> Reject Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomApprovalPage;
