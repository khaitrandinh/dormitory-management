import React, { useContext, useState, useEffect } from "react";
// import { FaEdit, FaTrash, FaBed, FaBuilding } from "react-icons/fa";
import { FaEdit, FaTrash, FaBed, FaBuilding, FaSave, FaTimes } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import axios from "../services/axios";
import "../Styles/RoomTable.css";



const RoomTable = ({ rooms, onDelete }) => {
  const { role } = useContext(AuthContext);
  const [editRoomId, setEditRoomId] = useState(null);
  const [editedRooms, setEditedRooms] = useState({});
  const [roomList, setRoomList] = useState([]);

  useEffect(() => {
    setRoomList(rooms);
  }, [rooms]);

  const handleChange = (e, roomId, field) => {
    const value = e.target.value;
    setEditedRooms((prev) => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [field]: value,
      },
    }));
  };

  const handleEditClick = (room) => {
    setEditRoomId(room.id);
    setEditedRooms((prev) => ({
      ...prev,
      [room.id]: { ...room },
    }));
  };

  const handleCancel = () => setEditRoomId(null);

  const handleSave = async (roomId) => {
    const edited = editedRooms[roomId];
    const original = roomList.find((r) => r.id === roomId);
    const payload = {};

    for (const key in edited) {
      if (edited[key] !== original[key]) {
        payload[key] = edited[key];
      }
    }

    if (Object.keys(payload).length === 0) {
      alert("No changes to update.");
      setEditRoomId(null);
      return;
    }

    try {
      const res = await axios.put(`/rooms/${roomId}`, payload);
      alert("Room updated successfully!");
      setEditRoomId(null);
      const updatedRoom = res.data.data;
      setRoomList((prev) =>
        prev.map((r) => (r.id === roomId ? { ...r, ...updatedRoom } : r))
      );
    } catch (error) {
      alert("Failed to update room!");
      console.error(error.response?.data || error.message);
    }
  };

  const formatStatus = (room) => {
    if (room.bed_available === 0) return "Full";
    return room.status.charAt(0).toUpperCase() + room.status.slice(1);
  };

  const statusBadgeClass = (room) => {
    if (room.bed_available === 0) return "bg-danger";
    switch (room.status.toLowerCase()) {
      case "available":
        return "bg-success";
      case "occupied":
        return "bg-warning";
      case "maintenance":
        return "bg-secondary";
      default:
        return "bg-light";
    }
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover custom-table">
        <thead>
          <tr>
            <th>Room Code</th>
            <th>Floor</th>
            <th>Building</th>
            <th>Bed Count</th>
            <th>Type</th>
            <th>Price (VND)</th>
            <th>Status</th>
            {(role === "staff" || role === "admin") && (
              <th className="text-center">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {roomList.map((room) => {
            const isEditing = editRoomId === room.id;
            const edited = editedRooms[room.id] || room;

            return (
              
              <tr key={room.id} className={isEditing ? 'editing-row' : ''}>
                <td>
                  {isEditing ? (
                    <div className="form-group">
                      <div className="input-group input-group-sm">
                        <span className="input-group-text">
                          <FaBuilding className="text-primary" />
                        </span>
                        <input
                          className="form-control form-control-sm"
                          value={edited.room_code}
                          onChange={(e) => handleChange(e, room.id, "room_code")}
                          placeholder="Room Code"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center">
                      <FaBuilding className="icon text-primary me-2" />
                      {room.room_code}
                    </div>
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={edited.floor}
                      onChange={(e) => handleChange(e, room.id, "floor")}
                      placeholder="Floor"
                    />
                  ) : (
                    room.floor
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      className="form-control form-control-sm"
                      value={edited.building}
                      onChange={(e) => handleChange(e, room.id, "building")}
                      placeholder="Building"
                    />
                  ) : (
                    room.building
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={edited.bed_count}
                      onChange={(e) => handleChange(e, room.id, "bed_count")}
                      placeholder="Bed Count"
                    />
                  ) : (
                    <span className={`badge ${room.bed_available === 0 ? 'bg-danger' : 'bg-success'}`}>
                      {room.bed_available}/{room.bed_count} available
                    </span>
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <select
                      className="form-select form-select-sm"
                      value={edited.room_type}
                      onChange={(e) => handleChange(e, room.id, "room_type")}
                    >
                      <option value="">Select Type</option>
                      <option value="standard">Standard</option>
                      <option value="vip">VIP</option>
                    </select>
                  ) : (
                    <span className="badge bg-secondary">
                      {formatStatus({ status: room.room_type })}
                    </span>
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <div className="input-group input-group-sm">
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={edited.price}
                        onChange={(e) => handleChange(e, room.id, "price")}
                        placeholder="Price"
                      />
                      <span className="input-group-text">đ</span>
                    </div>
                  ) : (
                    `${room.price?.toLocaleString() || 0} đ`
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <select
                      className="form-select form-select-sm"
                      value={edited.status}
                      onChange={(e) => handleChange(e, room.id, "status")}
                    >
                      <option value="">Select Status</option>
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  ) : (
                    <span className={`badge ${statusBadgeClass(room)}`}>
                      {formatStatus(room)}
                    </span>
                  )}
                </td>
                {(role === "staff" || role === "admin") && (
                  <td className="text-center">
                    {isEditing ? (
                      <div className="btn-group">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleSave(room.id)}
                          title="Save changes"
                        >
                          <FaSave /> Save
                        </button>
                        <button
                          className="btn btn-light btn-sm"
                          onClick={handleCancel}
                          title="Cancel editing"
                        >
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="btn-group">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleEditClick(room)}
                          title="Edit room"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => onDelete(room.id)}
                          title="Delete room"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RoomTable;


