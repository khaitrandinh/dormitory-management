import React, { useEffect, useState } from 'react';
import { FaBuilding, FaCheck, FaTimes, FaTools, FaBed } from 'react-icons/fa';
import '../Styles/RoomStatusTable.css';
import axios from '../services/axios';
import { Tooltip } from 'react-tooltip';

const RoomStatusTable = ({ data, onRefresh }) => {
  const [rooms, setRooms] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const updatedRooms = data.map(room => ({
        ...room,
        status_display:  room.status || 'N/A',
        user_status: room.status || 'N/A' // preserve original user-set status for dropdown
      }));
      setRooms(updatedRooms);
    }
  }, [data]);

  const handleStatusChange = async (roomId, newStatus) => {
    try {
      const response = await axios.put(`/rooms/${roomId}`, { status: newStatus });
  
      if (response.status === 200) {
        alert("Room status updated");
  
        // Cập nhật trực tiếp trong danh sách rooms
        setRooms(prevRooms =>
          prevRooms.map(room =>
            room.id === roomId
              ? {
                  ...room,
                  user_status: newStatus,
                  status_display:
                    newStatus === 'Maintenance'
                      ? 'Maintenance'
                      : room.bed_available <= 0
                      ? 'Full'
                      : room.bed_available === room.bed_count
                      ? 'Available'
                      : 'Occupied'
                }
              : room
          )
        );
  
        // Optional: Nếu bạn muốn đảm bảo đồng bộ dữ liệu server
        if (onRefresh) await onRefresh();
      }
    } catch (error) {
      alert("Failed to update room status.");
      console.error(error.response?.data || error.message);
    }
  };
  

  const statusOptions = [
    { value: 'Available', label: 'Available', icon: <FaCheck className="text-success" /> },
    { value: 'Occupied', label: 'Occupied', icon: <FaTimes className="text-danger" /> },
    { value: 'Maintenance', label: 'Maintenance', icon: <FaTools className="text-warning" /> },
    { value: 'Full', label: 'Full', icon: <FaTimes className="text-danger" /> },
  ];

  const getStatusBadgeClass = (statusDisplay) => {
    switch (statusDisplay?.toLowerCase()) {
      case 'available': return 'bg-success';
      case 'occupied': return 'bg-warning';
      case 'maintenance': return 'bg-secondary';
      case 'full': return 'bg-danger';
      default: return 'bg-dark';
    }
  };

  const filteredRooms = filterStatus
    ? rooms.filter(room => room.status_display?.toLowerCase() === filterStatus.toLowerCase())
    : rooms;

  const formatStatus = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : 'N/A';
  };

  return (
    <div className="room-status-card">
      <div className="card-header">
        <h5 className="card-title">
          <FaBuilding className="header-icon" />
          Room Status
        </h5>
        <select
          className="form-select mt-2"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">-- All Statuses --</option>
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Full">Full</option>
        </select>
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
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => {
                return (
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
                      <span
                        data-tooltip-id={`tooltip-${room.id}`}
                        className={`badge ${getStatusBadgeClass(room.status_display)}`}
                        style={{ cursor: 'pointer' }}
                      >
                        {formatStatus(room.status_display)}
                      </span>
                      <Tooltip id={`tooltip-${room.id}`} place="top" effect="solid">
                        <div><b>Status (System):</b> {formatStatus(room.status_display)}</div>
                        <div><b>Status (User):</b> {formatStatus(room.user_status)}</div>
                      </Tooltip>
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={room.user_status || ''}
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
                );
              })
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
