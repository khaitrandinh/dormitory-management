import React, { useState } from 'react';
import { FaExpandAlt, FaTimes, FaBell } from 'react-icons/fa';
import '../Styles/Notifications.css';

const Notifications = ({ notifications }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="notifications-wrapper">
      <div className="notifications-header d-flex justify-content-between align-items-center">
        <h5 className="header-title mb-0">📢 New Notifications</h5>
        {notifications.length > 2 && (
          <button 
            className="expand-button btn btn-sm btn-outline-primary"
            onClick={() => setShowModal(true)}
            title="Xem tất cả"
          >
            <FaExpandAlt />View All
          </button>
        )}
      </div>

      <div className="notification-list mt-2">
        {notifications.slice(0, 2).map((note, index) => (
          <div key={note.id || index} className="notification-item border rounded p-2 mb-2 bg-light shadow-sm">
            <strong className="d-block">{note.title || 'Thông báo'}</strong>
            <span>{note.message}</span>
          </div>
        ))}
      </div>

      {/* Modal full list */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <FaBell className="modal-icon" />
                <h5 className="mb-0">All Notifications</h5>
              </div>
              <button 
                className="close-button btn btn-sm btn-danger"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body mt-3">
              {notifications.map((note, index) => (
                <div key={note.id || index} className="modal-item border-bottom pb-2 mb-2">
                  <strong className="d-block">{note.title || 'Thông báo'}</strong>
                  <span>{note.message}</span>
                  <div className="text-muted small mt-1">
                    {new Date(note.created_at).toLocaleString()}
                  </div>
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
