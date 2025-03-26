import React, { useState, useEffect } from 'react';
import { FaBuilding, FaCheck, FaTimes, FaTools, FaBed } from 'react-icons/fa';
import '../Styles/RoomStatusTable.css';
import axios from '../services/axios';

const RoomStatusTable = ({ data, onRefresh }) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    setRooms(data || []);
  }, [data]);

  const handleStatusChange = async (roomId, newStatus) => {
    try {
      const response = await axios.put(`/rooms/${roomId}`, { status: newStatus });

      if (response.status === 200) {
        alert("Room status updated");

        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.id === roomId ? { ...room, status: newStatus } : room
          )
        );

        if (onRefresh) onRefresh();
      }
    } catch (error) {
      alert("Failed to update room status.");
      console.error(error.response?.data || error.message);
    }
  };

  const statusOptions = [
    { value: 'Available', label: 'Available', icon: <FaCheck className="text-success" /> },
    { value: 'Occupied', label: 'Occupied', icon: <FaTimes className="text-danger" /> },
    { value: 'Maintenance', label: 'Maintenance', icon: <FaTools className="text-warning" /> }
  ];

  const getDisplayStatus = (room) => {
    if (room.bed_available === 0) return 'Full';
    return room.status;
  };

  const getStatusBadgeClass = (room) => {
    if (room.bed_available === 0) return 'bg-danger';
    switch (room.status) {
      case 'Available': return 'bg-success';
      case 'Occupied': return 'bg-warning';
      case 'Maintenance': return 'bg-secondary';
      default: return 'bg-light';
    }
  };

  return (
    <div className="room-status-card">
      <div className="card-header">
        <h5 className="card-title">
          <FaBuilding className="header-icon" />
          Room Status
        </h5>
      </div>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Building</th>
              <th>Room</th>
              <th>Bed</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.building}</td>
                  <td>{room.room_code || room.room || "N/A"}</td>
                  <td>
                    <span className="badge bg-info">
                      <FaBed className="me-1" />
                      {room.bed_available}/{room.bed_count} available
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(room)}`}>
                      {getDisplayStatus(room)}
                    </span>
                  </td>
                  <td>
                    <select
                      className={`form-select form-select-sm`}
                      value={room.status}
                      onChange={(e) => handleStatusChange(room.id, e.target.value)}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No room data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomStatusTable;
