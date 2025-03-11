import React from 'react';

const DashboardCards = () => {
  const cards = [
    { title: 'Phòng Trống', value: 12 },
    { title: 'Sinh viên đang ở', value: 58 },
    { title: 'Thu/Chi tháng này', value: '25M/10M' },
    { title: 'Thông báo mới', value: 3 },
  ];

  return (
    <div className="row">
      {cards.map((card, idx) => (
        <div className="col-md-3 mb-4" key={idx}>
          <div className="card shadow-sm">
            <div className="card-body">
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
