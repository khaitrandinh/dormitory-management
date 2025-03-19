import React from 'react';
import { FaBuilding, FaCheck, FaTimes } from 'react-icons/fa';
import '../Styles/RoomStatusTable.css';

const RoomStatusTable = ({ data }) => {
  const buildings = [...new Set(data.map(item => item.building))];
  const rooms = [...new Set(data.map(item => item.room))];

  return (
    <div className="room-status-card">
      <div className="card-header">
        <h5 className="card-title">
          <FaBuilding className="header-icon" />
          Trạng thái phòng
        </h5>
        <div className="status-legend">
          <span className="legend-item available">
            <FaCheck className="text-success"/> Trống
          </span>
          <span className="legend-item occupied">
            <FaTimes className="text-danger"/> Đã có người ở
          </span>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th className="building-header">Tòa/Phòng</th>
              {rooms.map(room => (
                <th key={room} className="room-header">{room}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {buildings.map(building => (
              <tr key={building}>
                <td className="building-name">
                  <FaBuilding className="building-icon" />
                  <strong>{building}</strong>
                </td>
                {rooms.map(room => {
                  const roomStatus = data.find(
                    item => item.building === building && item.room === room
                  );
                  return (
                    <td
                      key={room}
                      className={`room-status ${roomStatus?.status === 'Trống' ? 'available' : 'occupied'}`}
                    >
                      {roomStatus?.status === 'Trống' ? <FaCheck /> : <FaTimes />}
                      <span className="status-text">{roomStatus?.status || 'N/A'}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomStatusTable;