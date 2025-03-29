import React, { useEffect, useState, useContext } from 'react';
import axios from '../services/axios';
import {
  Button, Modal, Form, Table, Pagination,
  InputGroup, FormControl, Accordion
} from 'react-bootstrap';
import {
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaFileExport, 
  FaFileContract,
  FaSearch,
  FaChevronDown
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../Styles/ContractPage.css";

const ContractPage = () => {
  const { role, user } = useContext(AuthContext);
  const [contracts, setContracts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [expandedIds, setExpandedIds] = useState(new Set());
  
  const toggleDetails = (id) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
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
                    <FaFileContract className="page-icon" />
                    Contract Management
                  </h1>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                      <li className="breadcrumb-item active">Contract Management</li>
                    </ol>
                  </nav>
                </div>
  
                {(role === 'staff' || role === 'admin') && (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success d-flex align-items-center"
                      onClick={() => handleExport('excel')}
                    >
                      <FaFileExport className="me-2" />
                      Export Excel
                    </button>
                    <button
                      className="btn btn-danger d-flex align-items-center"
                      onClick={() => handleExport('pdf')}
                    >
                      <FaFileExport className="me-2" />
                      Export PDF
                    </button>
                    <button
                      className="btn btn-primary d-flex align-items-center"
                      onClick={() => {
                        setEditing(null);
                        setShowModal(true);
                      }}
                    >
                      <FaPlus className="me-2" />
                      Add Contract
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
  
          <div className="content-body">
            <div className="container-fluid">
              <div className="card shadow-sm">
                <div className="card-body">
                  {(role === 'staff' || role === 'admin') && (
                    <div className="search-box mb-4">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaSearch />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by student name or code"
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
  
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Student</th>
                          <th>Room</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Status</th>
                          {(role === 'staff' || role === 'admin') && <th className="text-end">Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedContracts.map(contract => (
                          <React.Fragment key={contract.id}>
                            <tr>
                              <td>{contract.id}</td>
                              <td>{contract.student?.user?.name || 'N/A'}</td>
                              <td>{contract.room?.room_code || 'N/A'}</td>
                              <td>{new Date(contract.start_date).toLocaleDateString()}</td>
                              <td>{new Date(contract.end_date).toLocaleDateString()}</td>
                              <td>
                                <span className={`badge bg-${contract.status === 'active' ? 'success' : 
                                  contract.status === 'expired' ? 'danger' : 
                                  'warning'}`}>
                                  {contract.status}
                                </span>
                              </td>
                              {(role === 'staff' || role === 'admin') && (
                                <td className="text-end">
                                  <button
                                    className="btn btn-soft-info btn-sm me-2"
                                    onClick={() => toggleDetails(contract.id)}
                                  >
                                    <FaChevronDown className={expandedIds.has(contract.id) ? 'expanded' : ''} />
                                    <span className="ms-1">View</span>
                                  </button>
                                  <button
                                    className="btn btn-soft-warning btn-sm me-2"
                                    onClick={() => handleEdit(contract)}
                                  >
                                    <FaEdit className="me-1" />
                                    <span className="ms-1">Edit</span>
                                  </button>
                                  <button
                                    className="btn btn-soft-danger btn-sm"
                                    onClick={() => handleDelete(contract.id)}
                                  >
                                    <FaTrash className="me-1" />
                                    <span className="ms-1">Delete</span>
                                  </button>
                                </td>
                              )}
                            </tr>
                            {expandedIds.has(contract.id) && (
                              <tr>
                                <td colSpan={(role === 'staff' || role === 'admin') ? 7 : 6}>
                                  <div className="contract-details">
                                    <div className="row g-3">
                                      <div className="col-md-6">
                                        <h6 className="mb-3">Student Information</h6>
                                        <p><strong>Student ID:</strong> {contract.student?.student_code}</p>
                                        <p><strong>Name:</strong> {contract.student?.user?.name}</p>
                                        <p><strong>Email:</strong> {contract.student?.user?.email}</p>
                                        <p><strong>Phone:</strong> {contract.student?.phone}</p>
                                      </div>
                                      <div className="col-md-6">
                                        <h6 className="mb-3">Room Information</h6>
                                        <p><strong>Room Code:</strong> {contract.room?.room_code}</p>
                                        <p><strong>Building:</strong> {contract.room?.building}</p>
                                        <p><strong>Floor:</strong> {contract.room?.floor}</p>
                                        <p><strong>Type:</strong> {contract.room?.room_type}</p>
                                      </div>
                                      <div className="col-12">
                                        <h6 className="mb-3">Contract Details</h6>
                                        <div className="table-responsive">
                                          <table className="table table-sm table-bordered mb-0">
                                            <tbody>
                                              <tr>
                                                <th width="200">Contract Created</th>
                                                <td>{new Date(contract.created_at).toLocaleString()}</td>
                                              </tr>
                                              <tr>
                                                <th>Last Updated</th>
                                                <td>{new Date(contract.updated_at).toLocaleString()}</td>
                                              </tr>
                                              <tr>
                                                <th>Duration</th>
                                                <td>{Math.ceil((new Date(contract.end_date) - new Date(contract.start_date)) / (1000 * 60 * 60 * 24 * 30))} months</td>
                                              </tr>
                                              <tr>
                                                <th>Status</th>
                                                <td>{contract.status}</td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
  
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div className="text-muted">
                      Showing {paginatedContracts.length} of {filteredContracts.length} entries
                    </div>
                    <Pagination>
                      {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item
                          key={i}
                          active={i + 1 === currentPage}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </Pagination.Item>
                      ))}
                    </Pagination>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered className="contract-modal">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="d-flex align-items-center">
            {editing ? (
              <>
                <FaEdit className="text-warning me-2" />
                Edit Contract
              </>
            ) : (
              <>
                <FaPlus className="text-primary me-2" />
                New Contract
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <div className="modal-strip"></div>
          <Form onSubmit={handleSubmit} className="contract-form">
            <div className="form-section mb-4">
              <h6 className="section-title">
                <span className="section-icon">👤</span>
                Student Information
              </h6>
              <div className="row g-3">
                <div className="col-md-12">
                  <Form.Group>
                    <Form.Label>Student ID</Form.Label>
                    <Form.Control
                      type="number"
                      name="student_id"
                      value={formData.student_id}
                      onChange={handleChange}
                      required
                      placeholder="Enter student ID"
                      className="form-control-lg"
                    />
                  </Form.Group>
                </div>
              </div>
            </div>

            <div className="form-section mb-4">
              <h6 className="section-title">
                <span className="section-icon">🏠</span>
                Room Information
              </h6>
              <div className="row g-3">
                <div className="col-md-12">
                  <Form.Group>
                    <Form.Label>Room ID</Form.Label>
                    <Form.Control
                      type="number"
                      name="room_id"
                      value={formData.room_id}
                      onChange={handleChange}
                      required
                      placeholder="Enter room ID"
                      className="form-control-lg"
                    />
                  </Form.Group>
                </div>
              </div>
            </div>

            <div className="form-section mb-4">
              <h6 className="section-title">
                <span className="section-icon">📅</span>
                Contract Period
              </h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      required
                      className="form-control-lg"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      required
                      className="form-control-lg"
                    />
                  </Form.Group>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h6 className="section-title">
                <span className="section-icon">⭐</span>
                Contract Status
              </h6>
              <div className="row g-3">
                <div className="col-md-12">
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select 
                      name="status" 
                      value={formData.status} 
                      onChange={handleChange}
                      className="form-control-lg"
                    >
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                      <option value="canceled">Canceled</option>
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
                variant={editing ? "warning" : "primary"}
                className="btn-lg px-4"
              >
                {editing ? 'Update Contract' : 'Create Contract'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ContractPage;
