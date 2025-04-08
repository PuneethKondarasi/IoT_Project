import { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SensorChart = ({ title, data, color, unit }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const dataHistory = useRef([]);

  useEffect(() => {
    if (data) {
      const now = new Date();
      const timestamp = now.toLocaleTimeString(); // e.g., "14:05:09"

      // Add new data point to history
      dataHistory.current.push({
        label: timestamp,
        value: data.values[data.values.length - 1] // latest value
      });

      // Keep only the last 20 seconds worth of data (assuming 1 data/sec)
      if (dataHistory.current.length > 20) {
        dataHistory.current.shift();
      }

      // Separate labels and values
      const labels = dataHistory.current.map(d => d.label);
      const values = dataHistory.current.map(d => d.value);

      setChartData({
        labels,
        datasets: [
          {
            label: title,
            data: values,
            borderColor: color,
            backgroundColor: `${color}20`,
            borderWidth: 2,
            pointBackgroundColor: color,
            pointBorderColor: '#fff',
            pointRadius: 3,
            tension: 0.3,
            fill: true
          }
        ]
      });
    }
  }, [data, title, color]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#FFF',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}${unit}`;
          }
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#CCC'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#CCC'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md h-64">
      <h3 className="text-lg font-medium text-white mb-4">{title} History</h3>
      <div className="h-48">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SensorChart;
