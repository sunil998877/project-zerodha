import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Holdings',
    },
  },
};



export function VerticalGraph({ data }) {
  // Don't render chart if no data
  if (!data || !data.labels || !data.datasets || data.labels.length === 0) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        color: '#666',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <p>No chart data available</p>
      </div>
    );
  }

  return <Bar options={options} data={data} />;
}
