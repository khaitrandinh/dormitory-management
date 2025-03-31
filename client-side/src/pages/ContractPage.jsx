import React, { useEffect, useState, useContext } from 'react';
import axios from '../services/axios';
import {
  Button, Table, Pagination
} from 'react-bootstrap';
import {
  FaFileExport,
  FaFileContract
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

  const handleExport = (format = 'excel') => {
    const exportData = contracts.map(c => ({
      ID: c.id,
      Student: c.student?.user?.name || 'N/A',
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

  const filteredContracts = contracts.filter(c => {
    const keyword = searchTerm.toLowerCase();
    return role === 'student'
      ? c.student?.user_id === user?.id
      : (c.student?.user?.name?.toLowerCase().includes(keyword) ||
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
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="content-title">
              <FaFileContract className="page-icon" />
              Contract Management
            </h1>
            {(role === 'staff' || role === 'admin') && (
              <div className="d-flex gap-2">
                <Button variant="success" onClick={() => handleExport('excel')}>
                  <FaFileExport className="me-2" /> Export Excel
                </Button>
                <Button variant="danger" onClick={() => handleExport('pdf')}>
                  <FaFileExport className="me-2" /> Export PDF
                </Button>
              </div>
            )}
          </div>

          <Table bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Room</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedContracts.map(contract => (
                <tr key={contract.id}>
                  <td>{contract.id}</td>
                  <td>{contract.student?.user?.name}</td>
                  <td>{contract.room?.room_code}</td>
                  <td>{new Date(contract.start_date).toLocaleDateString()}</td>
                  <td>{new Date(contract.end_date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge bg-${contract.status === 'active' ? 'success' : contract.status === 'expired' ? 'danger' : 'warning'}`}>
                      {contract.status}
                    </span>
                  </td>
                </tr>
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
        </div>
      </div>
    </div>
  );
};

export default ContractPage;