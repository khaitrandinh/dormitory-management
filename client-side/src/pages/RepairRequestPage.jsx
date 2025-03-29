import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import '../Styles/RepairRequestPage.css';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const statusOptions = ['pending', 'in-progress', 'completed', 'canceled'];

const RepairRequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = () => {
    setLoading(true);
    axios.get('/repair-requests')
      .then(res => setRequests(res.data))
      .catch(err => console.error('Failed to fetch repair requests', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    axios.put(`/repair-requests/${id}`, { status: newStatus })
      .then(() => fetchRequests())
      .catch(err => console.error('Failed to update status', err));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this repair request?')) return;
    axios.delete(`/repair-requests/${id}`)
      .then(() => fetchRequests())
      .catch(err => console.error('Failed to delete repair request', err));
  };

  if (loading) return <p>Loading repair requests...</p>;

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
            <div className="container py-4">
            <h2 className="mb-4">Repair Requests</h2>
            {requests.length === 0 ? (
                <p>No repair requests found.</p>
            ) : (
                <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Student</th>
                        <th>Room</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Change Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {requests.map((r, index) => (
                        <tr key={r.id}>
                        <td>{index + 1}</td>
                        <td>{r.user?.name || 'N/A'}</td>
                        <td>{r.room?.room_code || 'N/A'}</td>
                        <td>{r.description}</td>
                        <td><span className={`badge bg-${getStatusColor(r.status)}`}>{r.status}</span></td>
                        <td>
                            <select
                            className="form-select"
                            value={r.status}
                            onChange={(e) => handleStatusChange(r.id, e.target.value)}
                            >
                            {statusOptions.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                            </select>
                        </td>
                        <td>
                            <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(r.id)}
                            >
                            Delete
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
            </div>
        </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'warning';
    case 'in-progress': return 'primary';
    case 'completed': return 'success';
    case 'canceled': return 'secondary';
    default: return 'light';
  }
};

export default RepairRequestPage;
