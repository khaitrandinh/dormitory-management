// import React from 'react';

// const Notifications = ({ notifications }) => (
//     <div className="col-md-12">
//         <div className="card">
//             <div className="card-header">Thông Báo Quan Trọng</div>
//             <ul className="list-group list-group-flush">
//                 {notifications.map((note, index) => (
//                     <li key={index} className="list-group-item">{note.message}</li>
//                 ))}
//             </ul>
//         </div>
//     </div>
// );

// export default Notifications;
import React, { useState } from 'react';
import { FaExpandAlt, FaTimes, FaBell } from 'react-icons/fa';
import '../Styles/Notifications.css';

const Notifications = ({ notifications }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="notifications-wrapper">
      <div className="notifications-header">
        <h5 className="header-title">Thông báo mới</h5>
        {notifications.length > 2 && (
          <button 
            className="expand-button"
            onClick={() => setShowModal(true)}
            title="Xem tất cả"
          >
            <FaExpandAlt /> Xem tất cả
          </button>
        )}
      </div>
      <div className="notification-list">
        {notifications.slice(0, 2).map((note, index) => (
          <div key={note.id || index} className="notification-item">
            <div className="notification-content">{note.message}</div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <FaBell className="modal-icon" />
              <h5>Tất Cả Thông Báo</h5>
              <button 
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              {notifications.map((note, index) => (
                <div key={note.id || index} className="modal-item">
                  {note.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;