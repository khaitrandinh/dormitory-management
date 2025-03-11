import React from 'react';

const Notifications = ({ notifications }) => (
    <div className="col-md-12">
        <div className="card">
            <div className="card-header">Thông Báo Quan Trọng</div>
            <ul className="list-group list-group-flush">
                {notifications.map((note, index) => (
                    <li key={index} className="list-group-item">{note.message}</li>
                ))}
            </ul>
        </div>
    </div>
);

export default Notifications;
