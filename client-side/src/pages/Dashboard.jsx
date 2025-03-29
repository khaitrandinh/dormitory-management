import React, { useEffect, useState, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Notifications from '../components/Notifications';
import RoomStatusTable from '../components/RoomStatusTable';
import { FaHome, FaUserGraduate, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import '../Styles/Dashboard_pages.css';
import axios from '../services/axios';
import { AuthContext } from '../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { role } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = () => {
    setLoading(true);
    axios.get('/dashboard')
      .then(res => setData(res.data))
      .catch(err => console.error("Failed to fetch dashboard data", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!data) return <p className="text-center text-danger">No data available!</p>;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Income & Expenses' },
    },
  };

  const chartData = {
    labels: data.monthlyFinance?.map(item => `Tháng ${item.month}`) || [],
    datasets: [
      {
        label: 'Income',
        data: data.monthlyFinance?.map(item => item.income) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
      },
      {
        label: 'Expenses',
        data: data.monthlyFinance?.map(item => item.expenses) || [],
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
      },
    ],
  };
  

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div className="container-fluid p-4">
            <h1 className="dashboard-title mb-4">Overview</h1>

            {(role === "staff" || role === "admin") && (
              <>
                <div className="row g-4">
                  <div className="col-md-3">
                    <div className="stat-card bg-primary text-white">
                      <div className="stat-card-body">
                        <div className="stat-card-icon"><FaHome /></div>
                        <div className="stat-card-info">
                          <h3>{data.rooms?.empty || 0}</h3>
                          <p>Empty Rooms</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="stat-card bg-success text-white">
                      <div className="stat-card-body">
                        <div className="stat-card-icon"><FaUserGraduate /></div>
                        <div className="stat-card-info">
                          <h3>{data.occupiedStudents || 0}</h3>
                          <p>Students Occupied</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="stat-card bg-info text-white">
                      <div className="stat-card-body">
                        <div className="stat-card-icon"><FaCheckCircle /></div>
                        <div className="stat-card-info">                         
                          <h3>{Number(data.paymentStatus?.paid || 0).toLocaleString('en-US')} VND</h3>
                          <p>Paid</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="stat-card bg-warning text-white">
                      <div className="stat-card-body">
                        <div className="stat-card-icon"><FaTimesCircle /></div>
                        <div className="stat-card-info">
                          <h3>{Number(data.paymentStatus?.unpaid || 0).toLocaleString('en-US')} VND</h3>
                          <p>Unpaid</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-4 g-4">
                  <div className="col-md-6">
                    <div className="content-card mb-4">
                      <Notifications notifications={data.notifications || []} />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="content-card mb-4">
                      <h5 className="content-card-title">This Month's Finance</h5>
                      <div className="finance-summary">
                        <div className="finance-item income">
                          <span>Income:</span>
                          <strong>{Number(data.finance?.income).toLocaleString() || "0"} VND</strong>
                        </div>
                        <div className="finance-item expenses">
                          <span>Expenses:</span>
                          <strong>{Number(data.finance?.expenses).toLocaleString() || "0"} VND</strong>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="col-md-6">
                    <div className="content-card mb-4">
                      <Notifications notifications={data.notifications || []} />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="content-card mb-4">
                      <h5 className="content-card-title">This Month's Finance</h5>
                      <div className="finance-summary">
                        <div className="finance-item income">
                          <span>Income:</span>
                          <strong>{data.finance?.income?.toLocaleString() || "0"} VND</strong>
                        </div>
                        <div className="finance-item expenses">
                          <span>Expenses:</span>
                          <strong>{data.finance?.expenses?.toLocaleString() || "0"} VND</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="content-card mb-4">
                      <Bar data={chartData} options={chartOptions} />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="content-card">
                      <h5 className="content-card-title">Room Status</h5>
                      <RoomStatusTable data={data.roomStatus || []} onRefresh={fetchDashboardData} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {role === "student" && (
              <div className="row g-4">
                <div className="col-md-3">
                  <div className="stat-card bg-success text-white">
                    <div className="stat-card-body">
                      <div className="stat-card-icon"><FaUserGraduate /></div>
                      <div className="stat-card-info">
                        <h3>{data.student?.room || "No room assigned"}</h3>
                        <p>Your Room</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="stat-card bg-info text-white">
                    <div className="stat-card-body">
                      <div className="stat-card-icon"><FaCheckCircle /></div>
                      <div className="stat-card-info">
                        <h3>{data.student?.paymentStatus || "Unpaid"}</h3>
                        <p>Payment Status</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="stat-card bg-primary text-white">
                    <div className="stat-card-body">
                      <div className="stat-card-icon"><FaCheckCircle /></div>
                      <div className="stat-card-info">
                        <h3>{(data.student?.paid || 0).toLocaleString()} VND</h3>
                        <p>Paid Amount</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="stat-card bg-warning text-white">
                    <div className="stat-card-body">
                      <div className="stat-card-icon"><FaTimesCircle /></div>
                      <div className="stat-card-info">
                        <h3>{(data.student?.unpaid || 0).toLocaleString()} VND</h3>
                        <p>Unpaid Amount</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="content-card">
                    <h5 className="content-card-title">Notifications</h5>
                    <Notifications notifications={data.notifications || []} />
                  </div>
                </div>
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
