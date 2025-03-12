import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../Styles/RoomTable.css";


const RoomTable = ({ rooms, onEdit, onDelete }) => {
  const role = "manager"; // Lấy role từ context đúng cách


  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Tên Phòng</th>
          <th>Tầng</th>
          <th>Tòa Nhà</th>
          <th>Số Giường</th>
          <th>Loại</th>
          <th>Giá (VNĐ)</th>
          <th>Trạng Thái</th>
          {role === "manager" && <th>Hành Động</th>}
        </tr>
      </thead>
      <tbody>
        {rooms.map((room) => (
          <tr key={room.id}>
            <td>{room.name}</td>
            <td>{room.floor}</td>
            <td>{room.building}</td>
            <td>{room.bed_count}</td>
            <td>{room.type}</td>
            <td>{room.price.toLocaleString()}</td>
            <td>
              <span className={`status ${room.status}`}>{room.status}</span>
            </td>
            {role === "manager" && (
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => onEdit(room)}>
                  <FaEdit /> Sửa
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(room.id)}>
                  <FaTrash /> Xóa
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RoomTable;
