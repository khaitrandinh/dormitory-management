import React, { useEffect, useState } from 'react';
import { getDashboardData } from '../services/dashboardService';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Bar } from 'react-chartjs-2';
import Notifications from '../components/Notifications'; // thêm tb
import RoomStatusTable from '../components/RoomStatusTable';
import { FaHome, FaUserGraduate, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import '../Styles/Dashboard_pages.css';

const Dashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getDashboardData();
            setData(result);
        };
        fetchData();
    }, []);

    if (!data) return (
        <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    const studentChartData = {
        labels: data.studentStats.map(s => s.month),
        datasets: [{
            label: 'Số lượng sinh viên',
            data: data.studentStats.map(s => s.count),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
        }]
    };
    const roomStatusData = [
        { building: 'A', room: '101', status: 'Trống' },
        { building: 'A', room: '102', status: 'Đã thuê' },
        { building: 'A', room: '103', status: 'Trống' },
        { building: 'B', room: '101', status: 'Đã thuê' },
        { building: 'B', room: '102', status: 'Đã thuê' },
        { building: 'B', room: '103', status: 'Trống' },
        { building: 'C', room: '101', status: 'Trống' },
        { building: 'C', room: '102', status: 'Đã thuê' },
        { building: 'C', room: '103', status: 'Trống' },
      ];

      return (
        <div className="dashboard-wrapper">
            <Sidebar />
            <div className="dashboard-main">
                <Navbar />
                <div className="dashboard-content">
                    <div className="container-fluid p-4">
                        <h1 className="dashboard-title mb-4">Tổng quan</h1>

                        <div className="row g-4">
                            <div className="col-md-3">
                                <div className="stat-card bg-primary text-white">
                                    <div className="stat-card-body">
                                        <div className="stat-card-icon">
                                            <FaHome />
                                        </div>
                                        <div className="stat-card-info">
                                            <h3>{data.availableRooms}</h3>
                                            <p>Phòng trống</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="stat-card bg-success text-white">
                                    <div className="stat-card-body">
                                        <div className="stat-card-icon">
                                            <FaUserGraduate />
                                        </div>
                                        <div className="stat-card-info">
                                            <h3>{data.occupiedStudents}</h3>
                                            <p>SV đang ở</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="stat-card bg-info text-white">
                                    <div className="stat-card-body">
                                        <div className="stat-card-icon">
                                            <FaCheckCircle />
                                        </div>
                                        <div className="stat-card-info">
                                            <h3>{data.paymentStatus.paid}</h3>
                                            <p>Đã thanh toán</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="stat-card bg-warning text-white">
                                    <div className="stat-card-body">
                                        <div className="stat-card-icon">
                                            <FaTimesCircle />
                                        </div>
                                        <div className="stat-card-info">
                                            <h3>{data.paymentStatus.unpaid}</h3>
                                            <p>Chưa thanh toán</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-4 g-4">
                            <div className="col-md-8">
                                <div className="content-card">
                                    <h5 className="content-card-title">Biểu đồ sinh viên theo tháng</h5>
                                    <div className="chart-container">
                                        <Bar data={studentChartData} options={{
                                            responsive: true,
                                            maintainAspectRatio: false
                                        }} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                {/* <div className="content-card mb-4">
                                    <h5 className="content-card-title">Thông báo mới</h5>
                                    <div className="notification-list">
                                        {data.notifications.map(n => (
                                            <div key={n.id} className="notification-item">
                                                {n.message}
                                            </div>
                                        ))}
                                    </div>
                                </div> */}
                                <div className="content-card mb-4">
                                    {/* <h5 className="content-card-title">Thông báo mới</h5> */}
                                    <Notifications notifications={data.notifications} />
                                </div>

                                <div className="content-card">
                                    <h5 className="content-card-title">Thu chi tháng này</h5>
                                    <div className="finance-summary">
                                        <div className="finance-item income">
                                            <span>Thu:</span>
                                            <strong>{data.finance.income.toLocaleString()} VND</strong>
                                        </div>
                                        <div className="finance-item expenses">
                                            <span>Chi:</span>
                                            <strong>{data.finance.expenses.toLocaleString()} VND</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="content-card">
                                    <h5 className="content-card-title">Trạng thái phòng</h5>
                                    <RoomStatusTable data={roomStatusData} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
