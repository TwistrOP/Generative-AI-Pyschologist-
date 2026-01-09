// src/components/EmotionChart.tsx
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,     
  Title,
  Tooltip,
  Legend,
  type ChartData,
} from 'chart.js';
import { useMemo } from 'react';
import { Paper, Text, Center } from '@mantine/core';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,  
  Title,
  Tooltip,
  Legend
);

interface Emotion {
  label: string;
  score: number;
}

interface EmotionHistoryRecord {
  timestamp: string;
  emotions: Emotion[];
}

interface EmotionChartProps {
  data: EmotionHistoryRecord[];
}

const emotionColors: Record<string, string> = {
  joy: 'rgba(255, 206, 86, 1)',
  sadness: 'rgba(54, 162, 235, 1)',
  anger: 'rgba(255, 99, 132, 1)',
  fear: 'rgba(75, 192, 192, 1)',
  love: 'rgba(255, 159, 64, 1)',
  surprise: 'rgba(153, 102, 255, 1)',
  neutral: 'rgba(201, 203, 207, 1)',
};

export function EmotionChart({ data }: EmotionChartProps) {
  const chartData = useMemo((): ChartData<'bar'> => {  
    if (!data || data.length === 0) {
      return { labels: [], datasets: [] };
    }

    const labels = data.map((_, index) => `Msg ${index + 1}`);
    const emotionsMap: Record<string, number[]> = {};

    data.forEach((record, recordIndex) => {
      const allLabels = Object.keys(emotionsMap);
      const currentEmotions = new Set(record.emotions.map(e => e.label));

      allLabels.forEach(label => {
        if (!currentEmotions.has(label)) {
          emotionsMap[label][recordIndex] = 0;
        }
      });
      
      record.emotions.forEach(emotion => {
        if (!emotionsMap[emotion.label]) {
          emotionsMap[emotion.label] = new Array(data.length).fill(0);
        }
        emotionsMap[emotion.label][recordIndex] = emotion.score;
      });
    });

    const datasets = Object.keys(emotionsMap).map(label => ({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      data: emotionsMap[label],
      backgroundColor: (emotionColors[label] || 'rgba(0, 0, 0, 1)').replace('1)', '0.8)'), 
    }));

    return { labels, datasets };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <Paper withBorder p="md" mt="md" radius="md">
        <Center>
          <Text c="dimmed">No emotion data available for this conversation yet.</Text>
        </Center>
      </Paper>
    );
  }

  return (
    <Paper withBorder p="md" mt="md" radius="md">
      <Bar
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top' as const,
            },
            title: {
              display: true,
              text: 'Emotion Analysis Over Time',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              max: 1,
              title: {
                display: true,
                text: 'Confidence Score'
              }
            },
            x: {
                title: {
                    display: true,
                    text: 'User Messages'
                }
            }
          }
        }}
        data={chartData}
      />
    </Paper>
  );
}