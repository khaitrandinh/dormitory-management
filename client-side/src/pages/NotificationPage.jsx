import React, { useEffect, useState, useContext } from 'react';
import axios from '../services/axios';
import { AuthContext } from '../context/AuthContext';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { FaBell, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import '../Styles/NotificationPage.css';

const NotificationPage = () => {
  const { user, role } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    user_id: 'all' // default: send to all
  });

  useEffect(() => {
    fetchNotifications();

    // Chỉ gọi khi là admin hoặc staff
    if (role === 'admin' || role === 'staff') {
      fetchStudents();
    }
  }, []);

  const filteredNotifications = notifications.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.message.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get('/users?role=student');
      setStudents(res.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete this notification?')) {
      // await axios.delete(/notifications/${id});
      await axios.delete(`/notifications/${id}`);
      fetchNotifications();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      sender_id: user?.id,
      title: formData.title,
      message: formData.message,
      user_id: formData.user_id === 'all' ? null : formData.user_id
    };

    await axios.post('/notifications', payload);

    setShowModal(false);
    setFormData({ title: '', message: '', user_id: 'all' });
    fetchNotifications();
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-wrapper">
          <div className="content-header">
            <div className="container-fluid">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="content-title">
                    <FaBell className="page-icon" />
                    Notification Management
                  </h1>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                      <li className="breadcrumb-item active">Notification Management</li>
                    </ol>
                  </nav>
                </div>

                {(role === 'admin' || role === 'staff') && (
                  <button
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => setShowModal(true)}
                  >
                    <FaPlus className="me-2" />
                    Send Notification
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="content-body">
            <div className="container-fluid">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="search-box mb-4">
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaSearch />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search notifications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Title</th>
                          <th>Message</th>
                          <th>Sender</th>
                          <th>Time</th>
                          {role !== 'student' && <th className="text-end">Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredNotifications.map(n => (
                          <tr key={n.id}>
                            <td>{n.title}</td>
                            <td>{n.message}</td>
                            <td>{n.sender?.name || 'System'}</td>
                            <td>{new Date(n.created_at).toLocaleString()}</td>
                            {role !== 'student' && (
                              <td className="text-end">
                                <button 
                                  className="btn btn-soft-danger btn-sm"
                                  onClick={() => handleDelete(n.id)}
                                >
                                  <FaTrash className="me-1" />
                                  <span className="ms-1">Delete</span>
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered className="notification-modal">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="d-flex align-items-center">
            <FaBell className="text-primary me-2" />
            Send New Notification
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <div className="modal-strip"></div>
          <Form onSubmit={handleSubmit} className="notification-form">
            <div className="form-section mb-4">
              <h6 className="section-title">
                <span className="section-icon">📝</span>
                Notification Details
              </h6>
              <div className="row g-3">
                <div className="col-md-12">
                  <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="form-control-lg"
                      placeholder="Enter notification title"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-12">
                  <Form.Group>
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      required
                      rows={3}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="form-control-lg"
                      placeholder="Enter your message"
                    />
                  </Form.Group>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h6 className="section-title">
                <span className="section-icon">👥</span>
                Recipient Information
              </h6>
              <div className="row g-3">
                <div className="col-md-12">
                  <Form.Group>
                    <Form.Label>Send To</Form.Label>
                    <Form.Select
                      value={formData.user_id}
                      onChange={e => setFormData({ ...formData, user_id: e.target.value })}
                      className="form-control-lg"
                    >
                      <option value="all">All Students</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.email})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
              </div>
            </div>
            
            <div className="modal-footer border-0 pt-4">
              <Button 
                variant="light" 
                onClick={() => setShowModal(false)}
                className="btn-lg px-4"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                className="btn-lg px-4"
              >
                Send Notification
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default NotificationPage;