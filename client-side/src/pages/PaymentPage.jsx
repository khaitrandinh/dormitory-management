import React, { useEffect, useState, useContext } from 'react';
import axios from '../services/axios';
import { AuthContext } from '../context/AuthContext';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { FaFileInvoice, FaMoneyBill, FaTrash, FaBell } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const PaymentPage = () => {
  const { role, user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    contract_id: '',
    amount: '',
    payment_date: '',
    status: 'pending',
    description: '',
    user_id: '',
  });

  const fetchPayments = async () => {
    const res = await axios.get('/payments');
    const all = res.data;
    if (role === 'student') {
      const filtered = all.filter(p => p.contract?.student?.user?.id === user?.id);
      setPayments(filtered);
    } else {
      setPayments(all);
    }
  };

  const fetchUsers = async () => {
    const res = await axios.get('/users');
    setUsers(res.data);
  };

  useEffect(() => {
    fetchPayments();
    if (role === 'admin' || role === 'staff') {
      fetchUsers();
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await axios.post('/payments', formData);
    setShowModal(false);
    setFormData({
      contract_id: '',
      amount: '',
      payment_date: '',
      status: 'pending',
      description: '',
      user_id: '',
    });
    fetchPayments();
  };

  const handleRemind = async (payment) => {
    const confirm = window.confirm(`Send reminder for invoice #${payment.id}?`);
    if (!confirm) return;

    try {
      const res = await axios.post(`/payments/${payment.id}/remind`);
      alert(res.data.message || 'Reminder sent successfully');
    } catch (err) {
      alert('Failed to send reminder!');
      console.error(err);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Payment Invoices', 14, 16);
    autoTable(doc, {
      head: [['ID', 'Student', 'Room', 'Amount', 'Status', 'Date']],
      body: payments.map((p) => [
        p.id,
        p.contract?.student?.user?.name || '',
        p.contract?.room?.room_code || '',
        p.amount?.toLocaleString() + ' VND',
        p.status,
        p.payment_date,
      ]),
    });
    doc.save('invoices.pdf');
  };

  const getStudentBankInfo = (payment) => {
    const studentName = payment.contract?.student?.user?.name || 'Student';
    return `Bank Transfer Info:\n\nBank: ABC Bank\nAccount Number: 123456789\nRecipient: ${studentName}\nNote: PAY#${payment.id}`;
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="container mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2><FaFileInvoice /> Payment Management</h2>
            <div>
              {(role === 'admin' || role === 'staff') && (
                <Button variant="primary" onClick={() => setShowModal(true)}>+ New Invoice</Button>
              )}
              <Button variant="outline-secondary" className="ms-2" onClick={exportPDF}>
                Export PDF
              </Button>
            </div>
          </div>

          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Room</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Pay Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.contract?.student?.user?.name}</td>
                  <td>{p.contract?.room?.room_code}</td>
                  <td>{p.amount?.toLocaleString()} VND</td>
                  <td>{p.status}</td>
                  <td>{p.payment_date}</td>
                  <td>{p.description || `Monthly rent (contract #${p.contract_id})`}</td>
                  <td>
                    {role === 'student' && p.status === 'pending' && (
                      <Button size="sm" variant="success" onClick={() => {
                        setSelectedPayment(p);
                        setShowPayModal(true);
                      }}>
                        <FaMoneyBill /> Pay
                      </Button>
                    )}
                    {(role === 'admin' || role === 'staff') && (
                      <>
                        <Button size="sm" variant="danger" className="me-2">
                          <FaTrash />
                        </Button>
                        {p.status === 'pending' && (
                          <Button size="sm" variant="warning" onClick={() => handleRemind(p)}>
                            <FaBell /> Remind
                          </Button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Create New Payment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleCreate}>
                <Form.Group className="mb-3">
                  <Form.Label>Contract ID</Form.Label>
                  <Form.Control name="contract_id" type="number" onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Amount (VND)</Form.Label>
                  <Form.Control name="amount" type="number" onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Date</Form.Label>
                  <Form.Control name="payment_date" type="date" onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control name="description" type="text" onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Assign to Student (optional)</Form.Label>
                  <Form.Select name="user_id" value={formData.user_id} onChange={handleChange}>
                    <option value="">-- No specific user --</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Button type="submit" variant="primary">Create</Button>
              </Form>
            </Modal.Body>
          </Modal>

          <Modal show={showPayModal} onHide={() => setShowPayModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Select Payment Method</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Please choose how you want to pay for invoice #{selectedPayment?.id}:</p>
              <div className="d-flex justify-content-between">
                <Button variant="outline-primary" onClick={() => {
                  setShowPayModal(false);
                  alert(getStudentBankInfo(selectedPayment));
                }}>
                  Manual Bank Transfer
                </Button>
                <Button variant="primary" onClick={async () => {
                  setShowPayModal(false);
                  try {
                    const res = await axios.post('/payos/initiate', {
                      contract_id: selectedPayment.contract_id,
                      amount: selectedPayment.amount,
                    });
                    if (res.data.payment_url) {
                      window.open(res.data.payment_url, '_blank');
                    } else {
                      alert("Failed to get PayOS link.");
                    }
                  } catch (err) {
                    alert("Error creating payment link.");
                  }
                }}>
                  Pay with PayOS
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
