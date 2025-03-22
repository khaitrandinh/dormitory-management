import React, { useEffect, useState, useContext } from "react";
import axios from "../services/axios";
import RoomTable from "../components/RoomTable";
import RoomForm from "../components/ARoomForm";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaPlus, FaBuilding } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import "../Styles/RoomPage.css";

const apiEndpoint = "/rooms";

const RoomPage = () => {
  const { role } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(apiEndpoint);
      setRooms(response.data);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
  };

  const handleEdit = (room) => {
    if (role !== "staff" && role !== "admin") return; // ✅ Only staff/admin can edit
    setSelectedRoom(room);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (role !== "staff" && role !== "admin") return; // ✅ Only staff/admin can delete
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axios.delete(`${apiEndpoint}/${id}`);
        fetchRooms();
      } catch (error) {
        console.error("Failed to delete room:", error);
        alert("Failed to delete the room.");
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      let response;
      if (data.id) {
        response = await axios.put(`${apiEndpoint}/${data.id}`, data);
      } else {
        response = await axios.post(apiEndpoint, data);
      }
      await fetchRooms();
      return { success: true, message: "Room saved successfully." };
    } catch (error) {
      console.error("Room save error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred.",
      };
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
                    <FaBuilding className="page-icon" />
                    Room Management
                  </h1>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item"><a href="/dashboard">Dashboard</a></li>
                      <li className="breadcrumb-item active">Room Management</li>
                    </ol>
                  </nav>
                </div>

                {(role === "staff" || role === "admin") && (
                  <button
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => {
                      setSelectedRoom(null);
                      setShowForm(true);
                    }}
                  >
                    <FaPlus className="me-2" />
                    Add Room
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="content-body">
            <div className="container-fluid">
              <div className="card shadow-sm">
                <div className="card-body">
                  {errorMessage && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                      {errorMessage}
                      <button type="button" className="btn-close" onClick={() => setErrorMessage("")}></button>
                    </div>
                  )}
                  <RoomTable
                    rooms={rooms}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    role={role}
                  />
                </div>
              </div>
            </div>
          </div>

          {showForm && (
            <div className="modal-backdrop">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <RoomForm
                    roomData={selectedRoom || {}}
                    onSubmit={handleSubmit}
                    onClose={() => setShowForm(false)}
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default RoomPage;
