import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title);

const FinanceChart = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.month),
        datasets: [
            {
                label: 'Thu',
                data: data.map(item => item.income),
                backgroundColor: 'green'
            },
            {
                label: 'Chi',
                data: data.map(item => item.expense),
                backgroundColor: 'red'
            }
        ]
    };

    return <Bar data={chartData} />;
};

export default FinanceChart;
