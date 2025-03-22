import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title);

const StudentChart = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.month),
        datasets: [
            {
                label: 'Số lượng sinh viên',
                data: data.map(item => item.count),
                fill: false,
                borderColor: 'blue'
            }
        ]
    };

    return <Line data={chartData} />;
};

export default StudentChart;
