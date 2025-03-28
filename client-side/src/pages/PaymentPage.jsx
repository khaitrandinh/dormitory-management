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
  FaSearch 
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
  const [formData, setFormData] = useState({
    contract_id: '',
    amount: '',
    payment_date: '',
    status: 'pending',
  });

  const fetchPayments = async () => {
    const res = await axios.get('/payments');
    const all = res.data;

    // Nếu là student thì chỉ hiện payment của user đó
    if (role === 'student') {
      const filtered = all.filter(p => p.contract?.student?.user?.id === user?.id);
      setPayments(filtered);
    } else {
      setPayments(all);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await axios.delete(`/payments/${id}`);
        fetchPayments(); // Refresh the payment list after deletion
      } catch (error) {
        console.error('Failed to delete payment:', error);
        alert('Failed to delete the payment.');
      }
    }
  };
  
  const handleCreate = async (e) => {
    e.preventDefault();
    await axios.post('/payments', formData);
    setShowModal(false);
    fetchPayments();
  };

  const handlePayNow = async (payment) => {
    const res = await axios.post('/payos/initiate', {
      contract_id: payment.contract_id,
      amount: payment.amount,
    });

    if (res.data.payment_url) {
      window.open(res.data.payment_url, '_blank');
    } else {
      alert('Không thể tạo link thanh toán');
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
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                      <li className="breadcrumb-item active">Payment Management</li>
                    </ol>
                  </nav>
                </div>

                <div className="d-flex gap-2">
                  {(role === 'admin' || role === 'staff') && (
                    <button
                      className="btn btn-primary d-flex align-items-center"
                      onClick={() => setShowModal(true)}
                    >
                      <FaPlus className="me-2" />
                      New Invoice
                    </button>
                  )}
                  <button
                    className="btn btn-danger d-flex align-items-center"
                    onClick={exportPDF}
                  >
                    <FaFileExport className="me-2" />
                    Export PDF
                  </button>
                </div>
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
                        placeholder="Search payments..."
                      />
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Student</th>
                          <th>Room</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Pay Date</th>
                          <th>Description</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map(p => (
                          <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.contract?.student?.user?.name}</td>
                            <td>{p.contract?.room?.room_code}</td>
                            <td>{p.amount?.toLocaleString()} VND</td>
                            <td>
                              <span className={`badge status-${p.status.toLowerCase()}`}>
                                {p.status}
                              </span>
                            </td>
                            <td>{p.payment_date}</td>
                            <td>Monthly rent (contract #{p.contract_id})</td>
                            <td className="text-end">
                              {role !== 'student' ? (
                                <button 
                                  className="btn btn-soft-danger btn-sm"
                                  onClick={() => handleDelete(p.id)}
                                >
                                  <FaTrash className="me-1" />
                                  <span className="ms-1">Delete</span>
                                </button>
                              ) : (
                                p.status === 'pending' && (
                                  <button 
                                    className="btn btn-soft-success btn-sm"
                                    onClick={() => handlePayNow(p)}
                                  >
                                    <FaMoneyBill className="me-1" />
                                    <span className="ms-1">Pay Now</span>
                                  </button>
                                )
                              )}
                            </td>
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
            <div className="form-section mb-4">
              <h6 className="section-title">
                <span className="section-icon">📋</span>
                Contract Information
              </h6>
              <div className="row g-3">
                <div className="col-md-12">
                  <Form.Group>
                    <Form.Label>Contract ID</Form.Label>
                    <Form.Control
                      type="number"
                      name="contract_id"
                      onChange={handleChange}
                      required
                      placeholder="Enter contract ID"
                      className="form-control-lg"
                    />
                  </Form.Group>
                </div>
              </div>
            </div>

            <div className="form-section mb-4">
              <h6 className="section-title">
                <span className="section-icon">💰</span>
                Payment Details
              </h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Amount (VND)</Form.Label>
                    <Form.Control
                      type="number"
                      name="amount"
                      onChange={handleChange}
                      required
                      placeholder="Enter amount"
                      className="form-control-lg"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Payment Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="payment_date"
                      onChange={handleChange}
                      required
                      className="form-control-lg"
                    />
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
                Create Payment
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PaymentPage;
