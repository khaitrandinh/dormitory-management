import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/dashboardService';

const DashboardCards = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getDashboardStats();
      setStats(data);
    };
    fetchStats();
  }, []);

  if (!stats) return <p>Loading...</p>;

  const cards = [
    { title: 'Phòng Trống', value: stats.emptyRooms },
    { title: 'Sinh viên đang ở', value: stats.currentStudents },
    { title: 'Thu/Chi tháng này', value: `${stats.finance.income}/${stats.finance.expense}` },
    { title: 'Thông báo mới', value: stats.notifications },
  ];

  return (
    <div className="row">
      {cards.map((card, idx) => (
        <div className="col-md-3 mb-4" key={idx}>
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">{card.title}</h5>
              <p className="card-text display-6">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
