import React, { useEffect, useState, useContext } from 'react';
import axios from '../services/axios';
import { AuthContext } from '../context/AuthContext';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { FaBell, FaTrash, FaPlus } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const NotificationPage = () => {
  const { user, role } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);

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
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="container mt-4">
          <h3><FaBell /> Notifications</h3>

          {(role === 'admin' || role === 'staff') && (
            <Button className="mb-3" onClick={() => setShowModal(true)}>
              <FaPlus /> Send Notification
            </Button>
          )}

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Message</th>
                <th>Sender</th>
                <th>Time</th>
                {role !== 'student' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {notifications.map(n => (
                <tr key={n.id}>
                  <td>{n.title}</td>
                  <td>{n.message}</td>
                  <td>{n.sender?.name || 'System'}</td>
                  <td>{new Date(n.created_at).toLocaleString()}</td>
                  {role !== 'student' && (
                    <td>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(n.id)}><FaTrash /></Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>

          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Send Notification</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    required
                    rows={3}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Recipient</Form.Label>
                  <Form.Select
                    value={formData.user_id}
                    onChange={e => setFormData({ ...formData, user_id: e.target.value })}
                  >
                    <option value="all">All Students</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.email})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Button type="submit" variant="primary">Send</Button>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
