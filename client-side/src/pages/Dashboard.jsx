import React, { useEffect, useState, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Notifications from '../components/Notifications';
import RoomStatusTable from '../components/RoomStatusTable';
import { FaHome, FaUserGraduate, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import '../Styles/Dashboard_pages.css';
import axios from '../services/axios';
import { AuthContext } from '../context/AuthContext'; // ✅ Import AuthContext

const Dashboard = () => {
  const { role } = useContext(AuthContext); // ✅ Lấy role từ context
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/dashboard')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Lỗi khi lấy dữ liệu dashboard", error);
        setLoading(false);
      });
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

  if (!data) return <p className="text-center text-danger">Không có dữ liệu!</p>;

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div className="container-fluid p-4">
            <h1 className="dashboard-title mb-4">Tổng quan</h1>

            {/* ✅ Nếu là Manager -> Hiển thị full dữ liệu */}
            {role === "staff" && (
              <>
                {/* Thống kê chính */}
                <div className="row g-4">
                  <div className="col-md-3">
                    <div className="stat-card bg-primary text-white">
                      <div className="stat-card-body">
                        <div className="stat-card-icon"><FaHome /></div>
                        <div className="stat-card-info">
                          <h3>{data.rooms?.empty || 0}</h3>
                          <p>Phòng trống</p>
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
                          <p>SV đang ở</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="stat-card bg-info text-white">
                      <div className="stat-card-body">
                        <div className="stat-card-icon"><FaCheckCircle /></div>
                        <div className="stat-card-info">
                          <h3>{data.paymentStatus?.paid || 0}</h3>
                          <p>Đã thanh toán</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="stat-card bg-warning text-white">
                      <div className="stat-card-body">
                        <div className="stat-card-icon"><FaTimesCircle /></div>
                        <div className="stat-card-info">
                          <h3>{data.paymentStatus?.unpaid || 0}</h3>
                          <p>Chưa thanh toán</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thống kê tài chính và thông báo */}
                <div className="row mt-4 g-4">
                  <div className="col-md-4">
                    <div className="content-card mb-4">
                      <Notifications notifications={data.notifications || []} />
                    </div>

                    <div className="content-card">
                      <h5 className="content-card-title">Thu chi tháng này</h5>
                      <div className="finance-summary">
                        <div className="finance-item income">
                          <span>Thu:</span>
                          <strong>{data.finance?.income?.toLocaleString() || "0"} VND</strong>
                        </div>
                        <div className="finance-item expenses">
                          <span>Chi:</span>
                          <strong>{data.finance?.expenses?.toLocaleString() || "0"} VND</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ✅ Hiển thị bảng trạng thái phòng */}
                  <div className="col-12">
                    <div className="content-card">
                      <h5 className="content-card-title">Trạng thái phòng</h5>
                      <RoomStatusTable data={data.roomStatus || []} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ✅ Nếu là Student -> Chỉ hiển thị thông tin của họ */}
            {role === "student" && (
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="stat-card bg-success text-white">
                    <div className="stat-card-body">
                      <div className="stat-card-icon"><FaUserGraduate /></div>
                      <div className="stat-card-info">
                        <h3>{data.student?.room || "Chưa có phòng"}</h3>
                        <p>Phòng của bạn</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="stat-card bg-info text-white">
                    <div className="stat-card-body">
                      <div className="stat-card-icon"><FaCheckCircle /></div>
                      <div className="stat-card-info">
                        <h3>{data.student?.paymentStatus || "Chưa thanh toán"}</h3>
                        <p>Trạng thái thanh toán</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ✅ Thông báo cá nhân */}
                <div className="col-12">
                  <div className="content-card">
                    <h5 className="content-card-title">Thông báo</h5>
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
