import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/dashboardService';
import { FaHome, FaUsers, FaChartLine, FaBell } from 'react-icons/fa';
import '../Styles/DashboardCards.css';

const DashboardCards = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const cards = [
    { 
      title: 'Phòng Trống', 
      value: stats.emptyRooms,
      icon: <FaHome />,
      color: 'primary'
    },
    { 
      title: 'Sinh viên đang ở', 
      value: stats.currentStudents,
      icon: <FaUsers />,
      color: 'success'
    },
    { 
      title: 'Thu/Chi tháng này', 
      value: `${stats.finance.income.toLocaleString()}/${stats.finance.expense.toLocaleString()}`,
      icon: <FaChartLine />,
      color: 'info'
    },
    { 
      title: 'Thông báo mới', 
      value: stats.notifications,
      icon: <FaBell />,
      color: 'warning'
    },
  ];

  return (
    <div className="row g-4">
      {cards.map((card, idx) => (
        <div className="col-md-3" key={idx}>
          <div className={`stat-card bg-${card.color} text-white`}>
            <div className="stat-card-body">
              <div className="stat-card-icon">
                {card.icon}
              </div>
              <div className="stat-card-info">
                <h3>{card.value}</h3>
                <p>{card.title}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;