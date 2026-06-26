import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GrafikDonasi({ danaTerkumpul, targetDana }) {
  const persen = Math.min(100, (danaTerkumpul / targetDana) * 100);
  const sisaTarget = Math.max(0, targetDana - danaTerkumpul);

  const dataChart = {
    labels: ['Dana Terkumpul', 'Sisa Target'],
    datasets: [
      {
        data: [danaTerkumpul, sisaTarget],
        backgroundColor: ['#3b82f6', '#ef4444'],
        hoverBackgroundColor: ['#2563eb', '#dc2626'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: '#f3f4f6',
          font: { family: 'sans-serif', size: 12 }
        }
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed} ETH`
        }
      }
    },
    cutout: '75%',
    maintainAspectRatio: true,
  };

  // Plugin untuk teks di tengah donat
  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw(chart) {
      const { width, height, ctx } = chart;
      ctx.restore();
      const fontSize = (height / 130).toFixed(2);
      ctx.font = `bold ${fontSize}em sans-serif`;
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#f3f4f6';
      const text = `${persen.toFixed(0)}%`;
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;
      ctx.fillText(text, textX, textY);
      
      ctx.font = `${(fontSize * 0.55).toFixed(2)}em sans-serif`;
      ctx.fillStyle = '#9ca3af';
      const subText = 'Terpenuhi';
      const subX = Math.round((width - ctx.measureText(subText).width) / 2);
      ctx.fillText(subText, subX, textY + 22);
      ctx.save();
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '280px', margin: '0 auto' }}>
      <Doughnut data={dataChart} options={options} plugins={[centerTextPlugin]} />
    </div>
  );
}