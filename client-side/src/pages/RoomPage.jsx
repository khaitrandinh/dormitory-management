import React, { useEffect, useState, useContext } from "react";
import axios from "../services/axios";
import RoomTable from "../components/RoomTable";
import RoomForm from "../components/ARoomForm";
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { FaPlus, FaBuilding } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext'; // ✅ Import AuthContext
import "../Styles/RoomPage.css";

const apiEndpoint = "/rooms";

const RoomPage = () => {
  const { role } = useContext(AuthContext); // ✅ Lấy role từ AuthContext
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
      console.error("Lỗi khi lấy danh sách phòng:", error);
    }
  };

  const handleEdit = (room) => {
    if (role !== "manager") return; // ✅ Chặn student chỉnh sửa phòng
    setSelectedRoom(room);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (role !== "manager") return; // ✅ Chặn student xóa phòng
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng này?")) {
      try {
        await axios.delete(`${apiEndpoint}/${id}`);
        fetchRooms();
      } catch (error) {
        console.error("Lỗi khi xóa phòng:", error);
      }
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
                    Quản Lý Phòng
                  </h1>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item"><a href="/dashboard">Dashboard</a></li>
                      <li className="breadcrumb-item active">Quản lý phòng</li>
                    </ol>
                  </nav>
                </div>
                
                {/* ✅ Ẩn nút "Thêm phòng" nếu không phải Manager */}
                {role === "manager" && (
                  <button
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => {
                      setSelectedRoom(null);
                      setShowForm(true);
                    }}
                  >
                    <FaPlus className="me-2" />
                    Thêm Phòng
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
                  <RoomTable rooms={rooms} onEdit={handleEdit} onDelete={handleDelete} role={role} />
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
                    onSubmit={() => {}}
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
