import React, { useEffect, useState } from "react";
import axios from "axios";
import RoomTable from "../components/RoomTable";
import RoomForm from "../components/ARoomForm"; // Đổi tên import nếu cần
import "../Styles/RoomPage.css";
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

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
    <div className="d-flex">
      <Sidebar />
        <div className="flex-grow-1" style={{ marginLeft: '250px' }}>
          <Navbar />
          <div className="container mt-4">
            <h1 className="mb-3">Dashboard Quản Lý Phòng</h1>
            {role === "manager" && (
              <button
                className="btn btn-primary mb-3"
                onClick={() => {
                  setSelectedRoom(null);
                  setShowForm(true);
                }}
              >
                Thêm Phòng
              </button>
            )}
            <RoomTable rooms={rooms} onEdit={handleEdit} onDelete={handleDelete} />
            {showForm && (
              <RoomForm
                roomData={selectedRoom || {}}
                onSubmit={handleFormSubmit}
                onClose={() => setShowForm(false)}
              />
            )}
          </div>
        </div>
    </div>
  );
};

export default RoomPage;
