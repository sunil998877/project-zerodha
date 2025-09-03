import React from 'react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  DoughnutController 
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

export const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        usePointStyle: true,
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.parsed;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${value} (${percentage}%)`;
        }
      }
    }
  }
};

export function DoughnoutChart({ data }) {
  // Don't render chart if no data
  if (!data || !data.labels || !data.datasets || data.labels.length === 0) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        color: '#666',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        margin: '20px 0',
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p>No doughnut chart data available</p>
      </div>
    );
  }

  // Validate data structure
  try {
    if (!Array.isArray(data.labels) || !Array.isArray(data.datasets)) {
      throw new Error('Invalid data structure');
    }
    
    if (data.datasets[0] && !Array.isArray(data.datasets[0].data)) {
      throw new Error('Invalid dataset data');
    }

    return (
      <div style={{ height: '400px', position: 'relative' }}>
        <Doughnut data={data} options={doughnutOptions} />
      </div>
    );
  } catch (error) {
    console.error('Doughnut chart error:', error);
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        color: '#ff4444',
        backgroundColor: '#ffe6e6',
        borderRadius: '8px',
        margin: '20px 0',
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p>Chart rendering error. Please check console for details.</p>
      </div>
    );
  }
}
