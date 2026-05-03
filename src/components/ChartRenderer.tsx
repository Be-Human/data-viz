import { createMemo } from 'solid-js';
import type { Component } from 'solid-js';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Line, Pie } from 'solid-chartjs';
import type { ParsedData } from '../utils/csvParser';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type ChartType = 'bar' | 'line' | 'pie';

interface ChartRendererProps {
  data: ParsedData;
  chartType: ChartType;
}

const colors = [
  'rgba(99, 102, 241, 0.8)',
  'rgba(139, 92, 246, 0.8)',
  'rgba(236, 72, 153, 0.8)',
  'rgba(34, 197, 94, 0.8)',
  'rgba(59, 130, 246, 0.8)',
  'rgba(251, 146, 60, 0.8)',
  'rgba(20, 184, 166, 0.8)',
  'rgba(244, 63, 94, 0.8)',
];

const borderColors = [
  'rgba(99, 102, 241, 1)',
  'rgba(139, 92, 246, 1)',
  'rgba(236, 72, 153, 1)',
  'rgba(34, 197, 94, 1)',
  'rgba(59, 130, 246, 1)',
  'rgba(251, 146, 60, 1)',
  'rgba(20, 184, 166, 1)',
  'rgba(244, 63, 94, 1)',
];

export const ChartRenderer: Component<ChartRendererProps> = (props) => {
  const chartData = createMemo(() => {
    const datasets = props.data.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: props.chartType === 'pie' 
        ? colors.slice(0, props.data.labels.length)
        : colors[index % colors.length],
      borderColor: props.chartType === 'pie'
        ? borderColors.slice(0, props.data.labels.length)
        : borderColors[index % borderColors.length],
      borderWidth: 2,
      tension: 0.4,
      fill: props.chartType === 'line',
      pointBackgroundColor: borderColors[index % borderColors.length],
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }));

    if (props.chartType === 'pie') {
      return {
        labels: props.data.labels,
        datasets: [{
          label: props.data.datasets[0]?.label || '数据',
          data: props.data.datasets[0]?.data || [],
          backgroundColor: colors.slice(0, props.data.labels.length),
          borderColor: borderColors.slice(0, props.data.labels.length),
          borderWidth: 2,
        }]
      };
    }

    return {
      labels: props.data.labels,
      datasets,
    };
  });

  const options = createMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: props.chartType === 'bar' 
          ? '柱状图' 
          : props.chartType === 'line' 
            ? '折线图' 
            : '饼图',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: props.chartType === 'pie' ? undefined : {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(226, 232, 240, 0.8)',
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#64748b',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#64748b',
        },
      },
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart' as const,
    },
  }));

  return (
    <div class="chart-wrapper">
      {props.chartType === 'bar' && <Bar data={chartData()} options={options()} />}
      {props.chartType === 'line' && <Line data={chartData()} options={options()} />}
      {props.chartType === 'pie' && <Pie data={chartData()} options={options()} />}
    </div>
  );
};
