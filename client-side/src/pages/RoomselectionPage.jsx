
import React, { useEffect, useState, useContext } from "react";
import axios from "../services/axios";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaBed, FaBuilding, FaCheckCircle } from "react-icons/fa";
import "../Styles/RoomSelection.css";

const RoomSelectionPage = () => {
    const { user } = useContext(AuthContext);
    const [studentId, setStudentId] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [studentRoom, setStudentRoom] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchStudentInfo();
    }, []);

    const fetchStudentInfo = async () => {
        try {
          const res = await axios.get(`/students`);
          const student = res.data; // ✅ vì đây là object sinh viên
      
          if (student) {
            setStudentId(student.id);
            if (student.room_code) {
              const roomRes = await axios.get(`/rooms`);
              const matchedRoom = roomRes.data.find(
                (room) => room.room_code === student.room_code
              );
              setStudentRoom(matchedRoom);
            } else {
              fetchAvailableRooms();
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
                (room) => room.status === "Available" && room.bed_available > 0
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
            setMessage("✅ Room selected successfully!");
            fetchStudentInfo();
        } catch (error) {
            console.error("Room selection failed:", error);
            setMessage("❌ Room selection failed!");
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

                    {studentRoom ? (
                        <div className="card room-card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">
                                    <FaBuilding className="text-primary me-2" />
                                    {studentRoom.room_code}
                                </h5>
                                <p><strong>Building:</strong> {studentRoom.building}</p>
                                <p><strong>Floor:</strong> {studentRoom.floor}</p>
                                <p><strong>Type:</strong> {studentRoom.room_type}</p>
                                <p>
                                    <strong>Beds:</strong>{" "}
                                    <span className={`badge ${studentRoom.bed_available === 0 ? "bg-danger" : "bg-success"}`}>
                                        <FaBed className="me-1" />
                                        {studentRoom.bed_available}/{studentRoom.bed_count} available
                                    </span>
                                </p>
                                <p><strong>Price:</strong> {studentRoom.price?.toLocaleString()} VND</p>
                                <div className="text-success mt-2">
                                    <FaCheckCircle className="me-1" />
                                    You have already selected this room.
                                </div>
                            </div>
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
