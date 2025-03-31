import React, { useEffect, useState, useContext } from 'react';
import axios from '../services/axios';
import { AuthContext } from '../context/AuthContext';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { 
  FaFileInvoice, 
  FaMoneyBill, 
  FaTrash, 
  FaPlus, 
  FaFileExport,
  FaBell 
} from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import '../Styles/PaymentPage.css';

const PaymentPage = () => {
  const { role, user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [users, setUsers] = useState([]);
  const [contracts, setContracts] = useState([]);
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

  const fetchContracts = async () => {
    const res = await axios.get('/contracts');
    setContracts(res.data);
  };

  useEffect(() => {
    fetchPayments();
    if (role === 'admin' || role === 'staff') {
      fetchUsers();
      fetchContracts();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    const newValue = ['user_id', 'contract_id'].includes(name)
      ? value === '' ? '' : Number(value)
      : value;
  
    setFormData({ ...formData, [name]: newValue });
  };
  

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await axios.delete(`/payments/${id}`);
        fetchPayments();
      } catch (error) {
        console.error('Failed to delete payment:', error);
        alert('Failed to delete the payment.');
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!formData.user_id || !formData.contract_id) {
      alert('Please select both student and contract');
      return;
    }

    const contract = contracts.find(c => c.id === formData.contract_id);
    if (!contract || contract.student?.user?.id !== formData.user_id) {
      alert('Invalid contract for selected user');
      return;
    }

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
                    <FaFileInvoice className="page-icon" />
                    Payment Management
                  </h1>
                </div>
                <div className="d-flex gap-2">
                  {(role === 'admin' || role === 'staff') && (
                    <button className="btn btn-primary d-flex align-items-center" onClick={() => setShowModal(true)}>
                      <FaPlus className="me-2" />
                      New Invoice
                    </button>
                  )}
                  <button className="btn btn-danger d-flex align-items-center" onClick={exportPDF}>
                    <FaFileExport className="me-2" />
                    Export PDF
                  </button>
                </div>
              </div>
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
                        <Button size="sm" variant="danger" className="me-2" onClick={() => handleDelete(p.id)}>
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

          <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered className="payment-modal">
            <Modal.Header closeButton className="border-0 pb-0">
              <Modal.Title className="d-flex align-items-center">
                <FaPlus className="text-primary me-2" />
                Create New Payment
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-0">
              <div className="modal-strip"></div>
              <Form onSubmit={handleCreate} className="payment-form">
                {(role === 'admin' || role === 'staff') && (
                  <Form.Group className="mb-3">
                    <Form.Label>Assign to Student</Form.Label>
                    <Form.Select
                      name="user_id"
                      value={formData.user_id || ""}
                      onChange={handleChange}
                      required
                      className="form-control-lg"
                    >
                      <option value="">-- Select user --</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Contract</Form.Label>
                  <Form.Select
                    name="contract_id"
                    value={formData.contract_id || ""}
                    onChange={handleChange}
                    required
                    className="form-control-lg"
                    disabled={!formData.user_id}
                  >
                    <option value="">-- Select contract --</option>
                    {contracts
                      .filter(c => c.student?.user?.id === formData.user_id)
                      .map(c => (
                        <option key={c.id} value={c.id}>
                          #{c.id} - {c.student?.user?.name} - Room {c.room?.room_code}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Amount (VND)</Form.Label>
                  <Form.Control type="number" name="amount" onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Payment Date</Form.Label>
                  <Form.Control type="date" name="payment_date" onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control name="description" type="text" onChange={handleChange} />
                </Form.Group>

                <div className="modal-footer border-0 pt-4">
                  <Button variant="light" onClick={() => setShowModal(false)} className="btn-lg px-4">Cancel</Button>
                  <Button type="submit" variant="primary" className="btn-lg px-4">Create Payment</Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
