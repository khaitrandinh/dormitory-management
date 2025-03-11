import React, { useEffect, useState } from 'react';
import { getDashboardData } from '../services/dashboardService';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Bar, Line } from 'react-chartjs-2';

const Dashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getDashboardData();
            setData(result);
        };
        fetchData();
    }, []);

    if (!data) return <p>Loading...</p>;

    const studentChartData = {
        labels: data.studentStats.map(s => s.month),
        datasets: [{
            label: 'Số lượng sinh viên',
            data: data.studentStats.map(s => s.count),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
        }]
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ marginLeft: '250px' }}>
                <Navbar />
                <div className="container mt-4">
                    <div className="row">
                        <div className="col-md-3 mb-3">
                            <div className="card shadow-sm p-3">
                                <h5>Phòng trống</h5>
                                <p>{data.availableRooms}</p>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="card shadow-sm p-3">
                                <h5>SV đang ở</h5>
                                <p>{data.occupiedStudents}</p>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="card shadow-sm p-3">
                                <h5>Đã thanh toán</h5>
                                <p>{data.paymentStatus.paid}</p>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="card shadow-sm p-3">
                                <h5>Chưa thanh toán</h5>
                                <p>{data.paymentStatus.unpaid}</p>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-md-8">
                            <div className="card p-3 shadow-sm">
                                <h5>Sinh viên theo tháng</h5>
                                <Bar data={studentChartData} />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card p-3 shadow-sm mb-3">
                                <h5>Thông báo</h5>
                                <ul className="list-group">
                                    {data.notifications.map(n => (
                                        <li key={n.id} className="list-group-item">{n.message}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="card p-3 shadow-sm">
                                <h5>Thu chi tháng này</h5>
                                <p>Thu: {data.finance.income} VND</p>
                                <p>Chi: {data.finance.expenses} VND</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
