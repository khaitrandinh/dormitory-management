import React, { useState } from 'react';
import { FaExpandAlt, FaTimes, FaBell } from 'react-icons/fa';
import '../Styles/Notifications.css';

const Notifications = ({ notifications }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="notifications-wrapper">
      <div className="notifications-header">
        <h5 className="header-title">New Notification</h5>
        {notifications.length > 0 && (
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
              <h5>All Notification</h5>
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