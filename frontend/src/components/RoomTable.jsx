import React from "react";
import { FaEdit, FaTrash, FaBed, FaBuilding } from "react-icons/fa";
import "../Styles/RoomTable.css";

const RoomTable = ({ rooms, onEdit, onDelete }) => {
  const role = "manager"; // Lấy role từ context đúng cách

  return (
    <div className="table-responsive">
      <table className="table table-hover custom-table">
        <thead>
          <tr>
            <th>Tên Phòng</th>
            <th>Tầng</th>
            <th>Tòa Nhà</th>
            <th>Số Giường</th>
            <th>Loại</th>
            <th>Giá (VNĐ)</th>
            <th>Trạng Thái</th>
            {role === "manager" && <th className="text-center">Hành Động</th>}
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td className="room-name">
                <FaBuilding className="icon text-primary" />
                {room.name}
              </td>
              <td>{room.floor}</td>
              <td>{room.building}</td>
              <td>
                <FaBed className="icon text-info" />
                {room.bed_count}
              </td>
              <td>
                <span className="badge bg-secondary">{room.type}</span>
              </td>
              <td className="price">
                {room.price.toLocaleString()} đ
              </td>
              <td>
                <span className={`status-badge status-${room.status.toLowerCase()}`}>
                  {room.status}
                </span>
              </td>
              {role === "manager" && (
                <td className="action-buttons">
                  <button 
                    className="btn btn-outline-warning btn-sm me-2" 
                    onClick={() => onEdit(room)}
                  >
                    <FaEdit /> Sửa
                  </button>
                  <button 
                    className="btn btn-outline-danger btn-sm" 
                    onClick={() => onDelete(room.id)}
                  >
                    <FaTrash /> Xóa
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomTable;