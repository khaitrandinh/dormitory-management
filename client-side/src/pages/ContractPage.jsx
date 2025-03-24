import React, { useEffect, useState, useContext } from 'react';
import axios from '../services/axios';
import {
  Button, Modal, Form, Table, Pagination,
  InputGroup, FormControl, Accordion
} from 'react-bootstrap';
import {
  FaPlus, FaEdit, FaTrash, FaFileExport
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const ContractPage = () => {
  const { role, user } = useContext(AuthContext);
  const [contracts, setContracts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    student_id: '',
    room_id: '',
    start_date: '',
    end_date: '',
    status: 'active'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const contractsPerPage = 5;

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    const res = await axios.get('/contracts');
    setContracts(res.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (contract) => {
    setEditing(contract);
    setFormData({
      student_id: contract.student_id,
      room_id: contract.room_id,
      start_date: contract.start_date,
      end_date: contract.end_date,
      status: contract.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete this contract?')) {
      await axios.delete(`/contracts/${id}`);
      fetchContracts();
    }
  };

  const handleExport = (format = 'excel') => {
    const exportData = contracts.map(c => ({
      ID: c.id,
      Student: c.student?.full_name || c.student?.student_code || 'N/A',
      Room: c.room?.room_code || 'N/A',
      'Start Date': c.start_date,
      'End Date': c.end_date,
      Status: c.status
    }));

    if (format === 'excel') {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Contracts');
      XLSX.writeFile(wb, 'contracts.xlsx');
    } else {
      const doc = new jsPDF();
      doc.text('Contracts', 14, 16);
      autoTable(doc, {
        head: [Object.keys(exportData[0])],
        body: exportData.map(Object.values)
      });
      doc.save('contracts.pdf');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.student_id || !formData.room_id) return;

    if (editing) {
      if (!window.confirm('Are you sure to update this contract?')) return;
      await axios.put(`/contracts/${editing.id}`, formData);
    } else {
      await axios.post('/contracts', formData);
    }

    setShowModal(false);
    setEditing(null);
    setFormData({
      student_id: '', room_id: '', start_date: '', end_date: '', status: 'active'
    });
    fetchContracts();
  };

  const filteredContracts = contracts.filter(c => {
    const keyword = searchTerm.toLowerCase();
    return role === 'student'
      ? c.student?.user_id === user?.id
      : (c.student?.full_name?.toLowerCase().includes(keyword) ||
         c.student?.student_code?.toLowerCase().includes(keyword));
  });
  

  const totalPages = Math.ceil(filteredContracts.length / contractsPerPage);
  const paginatedContracts = filteredContracts.slice(
    (currentPage - 1) * contractsPerPage,
    currentPage * contractsPerPage
  );

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
            <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Contract Management</h2>
                {(role === 'staff' || role === 'admin') && (
                <div>
                    <Button variant="success" className="me-2" onClick={() => handleExport('excel')}>
                    <FaFileExport /> Excel
                    </Button>
                    <Button variant="danger" className="me-2" onClick={() => handleExport('pdf')}>
                    <FaFileExport /> PDF
                    </Button>
                    <Button onClick={() => setShowModal(true)}>
                    <FaPlus /> Add Contract
                    </Button>
                </div>
                )}
            </div>

            {(role === 'staff' || role === 'admin') && (
                <InputGroup className="mb-3">
                <FormControl
                    placeholder="Search by student name"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                </InputGroup>
            )}

            <Table responsive bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Room</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    {(role === 'staff' || role === 'admin') && <th>Actions</th>}
                </tr>
                </thead>
                <tbody>
                {paginatedContracts.map(c => (
                    <React.Fragment key={c.id}>
                    <tr>
                        <td>{c.id}</td>
                        <td>{c.student?.full_name || c.student?.student_code || 'N/A'}</td>
                        <td>{c.student?.user?.name || 'N/A'}</td>
                        <td>{c.room?.room_code || 'N/A'}</td>
                        <td>{c.start_date}</td>
                        <td>{c.end_date}</td>
                        <td>{c.status}</td>
                        {(role === 'staff' || role === 'admin') && (
                        <td>
                            <Button size="sm" variant="warning" onClick={() => handleEdit(c)}>
                            <FaEdit />
                            </Button>{' '}
                            <Button size="sm" variant="danger" onClick={() => handleDelete(c.id)}>
                            <FaTrash />
                            </Button>
                        </td>
                        )}
                    </tr>
                    <tr>
                        <td colSpan={role === 'staff' || role === 'admin' ? 7 : 6} className="bg-light">
                        <Accordion flush>
                            <Accordion.Item eventKey={c.id.toString()}>
                            <Accordion.Header>View Details</Accordion.Header>
                            <Accordion.Body>
                                <p><strong>Contract ID:</strong> {c.id}</p>
                                <p><strong>Student ID:</strong> {c.student?.student_code || 'N/A'}</p>
                                <p><strong>Name:</strong> {c.student?.user?.name || 'N/A'}</p>
                                <p><strong>Room:</strong> {c.room?.room_code || 'N/A'}</p>
                                <p><strong>Period:</strong> {c.start_date} → {c.end_date}</p>
                                <p><strong>Status:</strong> {c.status}</p>
                                <p><strong>Payments:</strong></p>
                                <ul>
                                {c.payments?.length > 0
                                    ? c.payments.map(p => (
                                        <li key={p.id}>Amount: {p.amount} - Status: {p.status} - Date: {p.payment_date}</li>
                                    ))
                                    : <li>No payments linked</li>}
                                </ul>
                            </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                        </td>
                    </tr>
                    </React.Fragment>
                ))}
                </tbody>
            </Table>

            <Pagination>
                {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item key={i} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                </Pagination.Item>
                ))}
            </Pagination>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                <Modal.Title>{editing ? 'Edit Contract' : 'Add Contract'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                    <Form.Label>Student ID</Form.Label>
                    <Form.Control
                        type="number"
                        name="student_id"
                        value={formData.student_id}
                        onChange={handleChange}
                        required
                    />
                    </Form.Group>

                    <Form.Group className="mb-3">
                    <Form.Label>Room ID</Form.Label>
                    <Form.Control
                        type="number"
                        name="room_id"
                        value={formData.room_id}
                        onChange={handleChange}
                        required
                    />
                    </Form.Group>

                    <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        required
                    />
                    </Form.Group>

                    <Form.Group className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        required
                    />
                    </Form.Group>

                    <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="status" value={formData.status} onChange={handleChange}>
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="canceled">Canceled</option>
                    </Form.Select>
                    </Form.Group>

                    <Button type="submit" variant="primary">{editing ? 'Update' : 'Create'}</Button>
                </Form>
                </Modal.Body>
            </Modal>
            </div>
        </div>
    </div>
  );
};

export default ContractPage;
