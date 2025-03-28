import React, { useEffect, useState, useContext } from "react";
import axios from "../services/axios";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { 
  FaBed, 
  FaBuilding, 
  FaCheckCircle, 
  FaTimesCircle,
  FaDoorOpen 
} from "react-icons/fa";
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
                    <FaDoorOpen className="page-icon" />
                    Room Selection
                  </h1>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                      <li className="breadcrumb-item active">Room Selection</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          <div className="content-body">
            <div className="container-fluid">
              {message && (
                <div className={`alert ${message.includes('❌') ? 'alert-danger' : 'alert-success'} alert-dismissible fade show`}>
                  {message}
                  <button type="button" className="btn-close" onClick={() => setMessage("")}></button>
                </div>
              )}

              {studentData?.room_code && studentData.room_request_status === "approved" ? (
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="current-room">
                      <div className="room-header">
                        <h5 className="room-title">
                          <FaBuilding className="text-primary me-2" />
                          Current Room Assignment
                        </h5>
                        <span className="badge bg-success">
                          <FaCheckCircle className="me-1" />
                          Approved
                        </span>
                      </div>
                      
                      <div className="room-details mt-4">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="info-group">
                              <label>Room Code</label>
                              <p className="h5">{rooms[0]?.room_code}</p>
                            </div>
                            <div className="info-group">
                              <label>Building</label>
                              <p>{rooms[0]?.building}</p>
                            </div>
                            <div className="info-group">
                              <label>Floor</label>
                              <p>{rooms[0]?.floor}</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="info-group">
                              <label>Room Type</label>
                              <p>{rooms[0]?.room_type}</p>
                            </div>
                            <div className="info-group">
                              <label>Availability</label>
                              <p>
                                <span className={`badge ${rooms[0]?.bed_available === 0 ? "bg-danger" : "bg-success"}`}>
                                  <FaBed className="me-1" />
                                  {rooms[0]?.bed_available}/{rooms[0]?.bed_count} beds available
                                </span>
                              </p>
                            </div>
                            <div className="info-group">
                              <label>Price</label>
                              <p className="text-primary fw-bold">
                                {rooms[0]?.price?.toLocaleString()} VND
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="room-actions mt-4">
                        <button 
                          className="btn btn-outline-danger"
                          onClick={handleCancelRequest}
                        >
                          <FaTimesCircle className="me-2" />
                          Request Room Cancellation
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : studentData?.room_code && studentData.room_request_status === "pending" ? (
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="pending-request">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="text-warning mb-0">
                            <FaBuilding className="me-2" />
                            Pending Room Request
                          </h5>
                          <p className="text-muted mb-0 mt-2">
                            Room Code: <strong>{studentData.room_code}</strong>
                          </p>
                        </div>
                        <button 
                          className="btn btn-outline-danger"
                          onClick={handleCancelRequest}
                        >
                          <FaTimesCircle className="me-2" />
                          Cancel Request
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : studentData?.room_cancel_status === "pending" ? (
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="alert alert-info mb-0">
                      <FaTimesCircle className="me-2" />
                      Your room cancellation request is being reviewed by admin/staff.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title mb-4">
                      <FaBed className="me-2" />
                      Available Rooms
                    </h5>
                    
                    <div className="row g-4">
                      {rooms.map((room) => (
                        <div className="col-md-4" key={room.id}>
                          <div className="room-card">
                            <div className="room-card-header">
                              <h6 className="room-code">{room.room_code}</h6>
                              <span className="badge bg-success">
                                <FaBed className="me-1" />
                                {room.bed_available}/{room.bed_count}
                              </span>
                            </div>
                            
                            <div className="room-info">
                              <p><strong>Building:</strong> {room.building}</p>
                              <p><strong>Floor:</strong> {room.floor}</p>
                              <p><strong>Type:</strong> {room.room_type}</p>
                              <p className="price">
                                <strong>Price:</strong> 
                                <span className="text-primary">
                                  {room.price?.toLocaleString()} VND
                                </span>
                              </p>
                            </div>

                            <button
                              className="btn btn-primary w-100"
                              onClick={() => handleSelectRoom(room.room_code)}
                            >
                              Select Room
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {rooms.length === 0 && (
                        <div className="col-12">
                          <div className="text-center text-muted py-5">
                            <FaBed className="mb-3" size={32} />
                            <p className="mb-0">No rooms available at the moment.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomSelectionPage;