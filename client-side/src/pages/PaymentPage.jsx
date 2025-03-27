import React, { useEffect, useState, useContext } from 'react';
import axios from '../services/axios';
import { AuthContext } from '../context/AuthContext';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { FaFileInvoice, FaMoneyBill, FaTrash } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

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
    setPayments(res.data);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        p.amount + ' VND',
        p.status,
        p.payment_date,
      ]),
    });
    doc.save('invoices.pdf');
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
                {role !== 'student' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.contract?.student?.user?.name}</td>
                  <td>{p.contract?.room?.room_code}</td>
                  <td>{p.amount.toLocaleString()} VND</td>
                  <td>{p.status}</td>
                  <td>{p.payment_date}</td>
                  <td>Monthly rent (contract #{p.contract_id})</td>
                  {role !== 'student' ? (
                    <td>
                      <Button size="sm" variant="danger">
                        <FaTrash />
                      </Button>
                    </td>
                  ) : (
                    <td>
                      {p.status === 'pending' && (
                        <Button size="sm" variant="success" onClick={() => handlePayNow(p)}>
                          <FaMoneyBill /> Pay
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Create New Payment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleCreate}>
                <Form.Group>
                  <Form.Label>Contract ID</Form.Label>
                  <Form.Control name="contract_id" type="number" onChange={handleChange} required />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Amount (VND)</Form.Label>
                  <Form.Control name="amount" type="number" onChange={handleChange} required />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Payment Date</Form.Label>
                  <Form.Control name="payment_date" type="date" onChange={handleChange} required />
                </Form.Group>
                <Button type="submit" className="mt-3" variant="primary">Create</Button>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>        
  );
};

export default PaymentPage;
