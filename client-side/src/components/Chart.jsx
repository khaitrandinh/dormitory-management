import React, { useEffect, useState } from 'react';
import { getStudentChart, getFinanceChart } from '../services/dashboardService';
import { Bar } from 'react-chartjs-2';

const Charts = () => {
  const [studentChart, setStudentChart] = useState(null);
  const [financeChart, setFinanceChart] = useState(null);

  useEffect(() => {
    const fetchCharts = async () => {
      const student = await getStudentChart();
      const finance = await getFinanceChart();
      setStudentChart(student);
      setFinanceChart(finance);
    };
    fetchCharts();
  }, []);

  if (!studentChart || !financeChart) return <p>Loading charts...</p>;

  const studentData = {
    labels: studentChart.months,
    datasets: [{
      label: 'Sinh viên',
      data: studentChart.students,
      backgroundColor: '#007bff'
    }]
  };

  const financeData = {
    labels: financeChart.months,
    datasets: [
      { label: 'Thu', data: financeChart.income, backgroundColor: '#28a745' },
      { label: 'Chi', data: financeChart.expense, backgroundColor: '#dc3545' }
    ]
  };

  return (
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Sinh viên theo tháng</h5>
            <Bar data={studentData} />
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Thu/Chi tài chính</h5>
            <Bar data={financeData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
