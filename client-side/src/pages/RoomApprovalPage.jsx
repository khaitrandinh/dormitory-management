
import React, { useEffect, useState } from "react";
import axios from "../services/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../Styles/RoomApproval.css";

const RoomApprovalPage = () => {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRoomRequests();
  }, []);

  const fetchRoomRequests = async () => {
    try {
      const res = await axios.get("/students");
      const pendingRequests = res.data.filter(
        (s) => s.room_request_status === "pending"
      );
      setRequests(pendingRequests);
    } catch (err) {
      console.error("Failed to fetch room requests", err);
    }
  };

  const handleApprove = async (studentId) => {
    try {
      await axios.put(`/students/${studentId}/approve-room`);
      setMessage("✅ Room request approved.");
      fetchRoomRequests();
    } catch (err) {
      console.error("Approval failed", err);
      setMessage("❌ Failed to approve request.");
    }
  };

  const handleReject = async (studentId) => {
    try {
      await axios.put(`/students/${studentId}/reject-room`);
      setMessage("❌ Room request rejected.");
      fetchRoomRequests();
    } catch (err) {
      console.error("Rejection failed", err);
      setMessage("❌ Failed to reject request.");
    }
  };

  return (
    <div className="room-approval-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-wrapper">
          <h2 className="page-title">Room Approval Requests</h2>
          {message && <div className="alert alert-info">{message}</div>}

          {requests.length === 0 ? (
            <p className="text-muted">No pending requests.</p>
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
        </div>
      </div>
    </div>
  );
};

export default RoomApprovalPage;
