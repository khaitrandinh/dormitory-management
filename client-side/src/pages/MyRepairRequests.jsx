import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MyRepairRequests = () => {
  const [description, setDescription] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  //Get current user from backend
  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get('/me');
      setCurrentUserId(res.data.id);
    } catch (err) {
      console.error('Failed to fetch current user:', err);
    }
  };

  // Get repair requests
  const fetchMyRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/repair-requests');
      const filtered = res.data.filter(r => r.user_id === currentUserId);
      setRequests(filtered);
    } catch (err) {
      console.error('Failed to fetch repair requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchMyRequests();
    }
  }, [currentUserId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await axios.post('/repair-requests', { description });
      setMessage({ type: 'success', text: res.data.message });
      setDescription('');
      fetchMyRequests();
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit repair request.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;

    try {
      await axios.put(`/repair-requests/${id}`, { status: 'canceled' });
      setMessage({ type: 'success', text: 'Request canceled successfully.' });
      fetchMyRequests();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to cancel the request.' });
    }
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

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="container py-4">
          <h2 className="mb-4">My Repair Requests</h2>

          {message && (
            <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Describe the issue in your room:
              </label>
              <textarea
                id="description"
                className="form-control"
                rows="4"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Repair Request'}
            </button>
          </form>

          {/* Request List */}
          <h5 className="mb-3">Request History</h5>
          {loading ? (
            <p>Loading requests...</p>
          ) : requests.length === 0 ? (
            <p>No repair requests submitted yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Room</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r, index) => (
                    <tr key={r.id}>
                      <td>{index + 1}</td>
                      <td>{r.room?.room_code || 'N/A'}</td>
                      <td>{r.description}</td>
                      <td>
                        <span className={`badge bg-${getStatusColor(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        {r.status === 'pending' ? (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleCancel(r.id)}
                          >
                            Cancel
                          </button>
                        ) : (
                          <span>-</span>
                        )}
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

export default MyRepairRequests;
