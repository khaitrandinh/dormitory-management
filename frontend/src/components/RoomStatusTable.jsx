import React from 'react';
import '../Styles/RoomStatusTable.css'; // file css để chỉnh đẹp

const RoomStatusTable = ({ data }) => {
  const buildings = [...new Set(data.map(item => item.building))]; // danh sách các tòa
  const rooms = [...new Set(data.map(item => item.room))]; // danh sách các phòng

  return (
    <div className="card p-3 mt-4">
      <h5>Trạng thái phòng</h5>
      <table className="table table-bordered text-center mt-3">
        <thead className="thead-dark">
          <tr>
            <th>Tòa/Phòng</th>
            {rooms.map(room => (
              <th key={room}>{room}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {buildings.map(building => (
            <tr key={building}>
              <td><strong>{building}</strong></td>
              {rooms.map(room => {
                const roomStatus = data.find(
                  item => item.building === building && item.room === room
                );
                return (
                  <td
                    key={room}
                    className={roomStatus?.status === 'Trống' ? 'bg-success text-white' : 'bg-danger text-white'}
                  >
                    {roomStatus?.status || 'N/A'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomStatusTable;
