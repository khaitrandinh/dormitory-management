import React, { useState } from 'react';
import { FaBuilding, FaCheck, FaTimes, FaTools } from 'react-icons/fa';
import '../Styles/RoomStatusTable.css';
import axios from '../services/axios'; // ✅ Gọi API để cập nhật trạng thái

const RoomStatusTable = ({ data }) => {
  // ✅ Cập nhật state để lưu trữ danh sách phòng
  const [rooms, setRooms] = useState(data || []);

  // ✅ Xử lý cập nhật trạng thái phòng
  const handleStatusChange = async (roomId, newStatus) => {
    if (!roomId) {
      console.error("❌ Lỗi: ID phòng không hợp lệ!", roomId);
      return;
    }

    try {
      const response = await axios.put(`/rooms/${roomId}`, { status: newStatus });

      if (response.status === 200) {
        // ✅ Cập nhật trạng thái trong state ngay lập tức
        setRooms(prevRooms =>
          prevRooms.map(room => 
            room.room_id === roomId ? { ...room, status: newStatus } : room
          )
        );
      }
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái phòng:", error.response?.data || error.message);
      alert(`⚠ Không thể cập nhật trạng thái phòng! Lỗi: ${error.response?.data?.message || "Lỗi không xác định"}`);
    }
  };

  // ✅ Danh sách trạng thái với biểu tượng
  const statusOptions = [
    { value: 'Trống', label: 'Trống', icon: <FaCheck className="text-success" /> },
    { value: 'Đã thuê', label: 'Đã thuê', icon: <FaTimes className="text-danger" /> },
    { value: 'Bảo trì', label: 'Bảo trì', icon: <FaTools className="text-warning" /> }
  ];

  return (
    <div className="room-status-card">
      <div className="card-header">
        <h5 className="card-title">
          <FaBuilding className="header-icon" />
          Trạng thái phòng
        </h5>
      </div>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Tòa</th>
              <th>Phòng</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length > 0 ? (
              rooms.map((room, index) => (
                room.room_id ? ( // ✅ Kiểm tra nếu room_id tồn tại
                  <tr key={room.room_id || index}> 
                    <td>{room.building}</td>
                    <td>{room.room}</td>
                    <td>
                      <select 
                        className={`form-select status-select ${room.status}`} 
                        value={room.status} 
                        onChange={(e) => handleStatusChange(room.room_id, e.target.value)}
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ) : null
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted">Không có dữ liệu phòng</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomStatusTable;
