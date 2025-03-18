import React, { useEffect, useState } from "react";
import axios from "axios";
import RoomTable from "../components/RoomTable";
import RoomForm from "../components/ARoomForm";
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { FaPlus, FaBuilding } from 'react-icons/fa';
import "../Styles/RoomPage.css";

const apiEndpoint = "http://localhost:8004/api/rooms";

const RoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const role = "manager";
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
    setSelectedRoom(room);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng này?")) {
      try {
        await axios.delete(`${apiEndpoint}/${id}`);
        fetchRooms();
      } catch (error) {
        console.error("Lỗi khi xóa phòng:", error);
      }
    }
  };

  const handleFormSubmit = async (data) => {
    console.log("📤 Dữ liệu gửi lên API:", { ...data, status: data.status || "available" });
  
    try {
      let response;
      if (data.id) {
        response = await axios.put(`${apiEndpoint}/${data.id}`, { ...data, status: data.status || "available" });
      } else {
        response = await axios.post(apiEndpoint, { ...data, status: data.status || "available" });
      }
  
      console.log("✅ Phản hồi từ API:", response.data);
  
      if (response && (response.status === 200 || response.status === 201)) {
        await fetchRooms(); // 👉 CHỜ cập nhật danh sách phòng xong
        setErrorMessage(""); // Xóa lỗi khi thành công
        return { success: true, message: "Thêm phòng thành công!" };
      }
    } catch (error) {
      console.error("❌ Lỗi khi thêm phòng:", error);
  
      if (error.response) {
        console.log("📩 Lỗi chi tiết từ API:", error.response.data);
        setErrorMessage(error.response.data.message || "Có lỗi xảy ra từ backend.");
      } else {
        setErrorMessage("Không thể kết nối với server.");
      }
  
      return { success: false, message: "Lỗi từ API hoặc kết nối." };
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
                  <RoomTable rooms={rooms} onEdit={handleEdit} onDelete={handleDelete} />
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
                    onSubmit={handleFormSubmit}
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