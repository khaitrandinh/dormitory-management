import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats, getImportantNotifications, getFinanceReport, getStudentStatsByMonth } from '../services/dashboardService';
import StudentChart from '../components/StudentChart';
import FinanceChart from '../components/FinanceChart';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({});
    const [notifications, setNotifications] = useState([]);
    const [finance, setFinance] = useState([]);
    const [studentStats, setStudentStats] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setStats(await getDashboardStats());
            setNotifications(await getImportantNotifications());
            setFinance(await getFinanceReport());
            setStudentStats(await getStudentStatsByMonth());
        };
        fetchData();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Dashboard</h2>
            <p>Xin chào: <b>{user?.name}</b> - Role: <b>{user?.role}</b></p>

            {/* 1. Role ADMIN mới được xem toàn bộ */}
            {user.role === 'admin' && (
                <>
                    <h4>Thống kê tổng quan</h4>
                    <p>Phòng trống: {stats.emptyRooms}</p>
                    <p>Sinh viên đang ở: {stats.totalStudents}</p>
                    <p>Sinh viên nợ phí: {stats.pendingPayments}</p>

                    <h4>Thông báo</h4>
                    {notifications.map((n, idx) => <p key={idx}>- {n.message}</p>)}

                    <h4>Biểu đồ sinh viên theo tháng</h4>
                    <StudentChart data={studentStats} />

                    <h4>Báo cáo tài chính</h4>
                    <FinanceChart data={finance} />
                </>
            )}

            {/* 2. Role MANAGER chỉ xem được thông báo + thu chi */}
            {user.role === 'manager' && (
                <>
                    <h4>Thông báo</h4>
                    {notifications.map((n, idx) => <p key={idx}>- {n.message}</p>)}

                    <h4>Báo cáo tài chính</h4>
                    <FinanceChart data={finance} />
                </>
            )}

            {/* 3. Role STUDENT chỉ xem được thông báo */}
            {user.role === 'student' && (
                <>
                    <h4>Thông báo</h4>
                    {notifications.map((n, idx) => <p key={idx}>- {n.message}</p>)}
                </>
            )}
        </div>
    );
};

export default Dashboard;
