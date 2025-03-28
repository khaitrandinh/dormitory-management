
import React, { useEffect, useState, useContext } from "react";
import axios from "../services/axios";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaBed, FaBuilding, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../Styles/RoomSelection.css";

const RoomSelectionPage = () => {
  const { user } = useContext(AuthContext);
  const [studentId, setStudentId] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchStudentInfo();

    const interval = setInterval(() => {
      fetchStudentInfo();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchStudentInfo = async () => {
    try {
      const res = await axios.get("/students");
      const student = res.data;

      if (student) {
        setStudentId(student.id);
        setStudentData(student);

        if (student.room_cancel_status === "pending") {
          setRooms([]);
        } else if (!student.room_code && student.room_cancel_status === null) {
          fetchAvailableRooms(); // ✅ chỉ gọi khi đã được duyệt
        } else if (student.room_code) {
          // Nếu vẫn còn room_code và không đang pending huỷ thì hiển thị phòng
          const roomRes = await axios.get(`/rooms`);
          const matchedRoom = roomRes.data.find(
            (room) => room.room_code === student.room_code
          );
          setRooms([matchedRoom]);
        }
        
        
      }
    } catch (error) {
      console.error("Failed to fetch student info:", error);
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const res = await axios.get("/rooms");
      const available = res.data.filter(
        (room) => room.status_display !== "Maintenance" && room.bed_available > 0
      );
      setRooms(available);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
  };
  

  const handleSelectRoom = async (roomCode) => {
    if (!studentId) {
      setMessage("❌ You are not recognized as a student.");
      return;
    }

    try {
      await axios.put(`/students/${studentId}`, {
        room_code: roomCode,
      });
      setMessage("Room selection request submitted successfully!");
      fetchStudentInfo();
    } catch (error) {
      console.error("Room selection failed:", error);
      setMessage("❌ Room selection failed!");
    }
  };

  const handleCancelRequest = async () => {
    if (!studentId) return;

    try {
      await axios.put(`/students/${studentId}`, {
        cancel_request: true,
      });
      setMessage("❌ Room cancellation request submitted. Waiting for admin approval.");
      fetchStudentInfo();
    } catch (error) {
      console.error("Cancel request failed:", error);
      setMessage("❌ Cancel request failed.");
    }
  };

  return (
    <div className="room-selection-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-wrapper">
          <h2 className="page-title">Select Your Room</h2>
          {message && <div className="alert alert-info">{message}</div>}

          {studentData?.room_code && studentData.room_request_status === "approved" ? (
            <div className="card room-card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">
                  <FaBuilding className="text-primary me-2" />
                  {rooms[0]?.room_code}
                </h5>
                <p><strong>Building:</strong> {rooms[0]?.building}</p>
                <p><strong>Floor:</strong> {rooms[0]?.floor}</p>
                <p><strong>Type:</strong> {rooms[0]?.room_type}</p>
                <p>
                  <strong>Beds:</strong>{" "}
                  <span className={`badge ${rooms[0]?.bed_available === 0 ? "bg-danger" : "bg-success"}`}>
                    <FaBed className="me-1" />
                    {rooms[0]?.bed_available}/{rooms[0]?.bed_count} available
                  </span>
                </p>
                <p><strong>Price:</strong> {rooms[0]?.price?.toLocaleString()} VND</p>
                <div className="text-success mt-2 mb-2">
                  <FaCheckCircle className="me-1" />
                  You have already selected this room.
                </div>
                <button className="btn btn-outline-danger btn-sm" onClick={handleCancelRequest}>
                  <FaTimesCircle /> Request Cancel Room
                </button>
              </div>
            </div>
          ) : studentData?.room_code && studentData.room_request_status === "pending" ? (
            <div className="alert alert-warning d-flex align-items-center justify-content-between">
              <span>
                You have a pending room request for: <strong>{studentData.room_code}</strong>
              </span>
              <button className="btn btn-outline-danger btn-sm" onClick={handleCancelRequest}>
                <FaTimesCircle /> Cancel Request
              </button>
            </div>
          ) : studentData?.room_cancel_status === "pending" ? (
            <div className="alert alert-info">
              Your request to cancel the room is being reviewed by admin/staff.
            </div>
          ) : (
            <div className="row">
              {rooms.map((room) => (
                <div className="col-md-4" key={room.id}>
                  <div className="card room-card shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">
                        <FaBuilding className="text-primary me-2" />
                        {room.room_code}
                      </h5>
                      <p><strong>Building:</strong> {room.building}</p>
                      <p><strong>Floor:</strong> {room.floor}</p>
                      <p><strong>Type:</strong> {room.room_type}</p>
                      <p>
                        <strong>Beds:</strong>{" "}
                        <span className="badge bg-success">
                          <FaBed className="me-1" />
                          {room.bed_available}/{room.bed_count} available
                        </span>
                      </p>
                      <p><strong>Price:</strong> {room.price?.toLocaleString()} VND</p>
                      <button
                        className="btn btn-success w-100"
                        onClick={() => handleSelectRoom(room.room_code)}
                      >
                        Select Room
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {rooms.length === 0 && (
                <p className="text-muted">No available rooms at the moment.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomSelectionPage;
