import { NextResponse } from 'next/server';

// Dummy data (replace with DB fetch in production)
const performanceData = {
  basicInputs: [
    { date: '2025-06-10', wakeUpTime: '06:45', meditationDuration: 20, timeWastedRandomly: 45, lastUpdated: '2025-06-10T08:15:00' },
    { date: '2025-06-09', wakeUpTime: '07:00', meditationDuration: 15, timeWastedRandomly: 55, lastUpdated: '2025-06-09T08:30:00' },
    { date: '2025-06-08', wakeUpTime: '06:30', meditationDuration: 25, timeWastedRandomly: 40, lastUpdated: '2025-06-08T07:45:00' },
    { date: '2025-06-07', wakeUpTime: '07:30', meditationDuration: 15, timeWastedRandomly: 70, lastUpdated: '2025-06-07T09:00:00' },
    { date: '2025-06-06', wakeUpTime: '06:15', meditationDuration: 30, timeWastedRandomly: 35, lastUpdated: '2025-06-06T07:30:00' },
  ],
  performanceMetrics: {
    tasks: {
      total: 45,
      completed: 32,
      pending: 13,
      lastCompletedTask: '2025-06-19T14:30:00',
      lastUpdatedTask: '2025-06-19T16:00:00',
      byType: {
        deadline: { total: 15, completed: 11 },
        nonNegotiable: { total: 20, completed: 16 },
        procrastinating: { total: 10, completed: 5 },
      },
      weeklyCompletion: {
        Mon: 5,
        Tue: 4,
        Wed: 6,
        Thu: 4,
        Fri: 3,
        Sat: 2,
        Sun: 3,
      },
    },
    dailyStats: {
      averageWakeUpTime: '06:45',
      averageMeditationTime: 21,
      averageTimeWasted: 48,
      consistencyScore: 82,
      lastWeekImprovement: 12,
    },
  },
  performanceHistory: [
    { date: '2025-06-10', value: 10 },
    { date: '2025-06-11', value: 15 },
    { date: '2025-06-12', value: 12 },
    { date: '2025-06-13', value: 12 },
    { date: '2025-06-14', value: 11 },
    { date: '2025-06-15', value: 13 },
    { date: '2025-06-16', value: 12 },
    { date: '2025-06-17', value: 17 },
    { date: '2025-06-18', value: 21 },
    { date: '2025-06-19', value: 19 },
  ],
};

function prepareCalendarAnalytics(data) {
  const { basicInputs, performanceMetrics, performanceHistory } = data;

  // Wake-up Time Trend
  const wakeUpTimes = basicInputs.map(entry => {
    const [hours, minutes] = entry.wakeUpTime.split(':');
    return parseFloat(hours) + parseFloat(minutes) / 60;
  });
  const dates = basicInputs.map(entry =>
    new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  );
  const wakeUpTimeChart = {
    labels: dates,
    datasets: [
      {
        label: 'Wake-up Time',
        data: wakeUpTimes,
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  // Daily Activities
  const dailyActivitiesChart = {
    labels: dates,
    datasets: [
      {
        label: 'Meditation (minutes)',
        data: basicInputs.map(entry => entry.meditationDuration),
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
      },
      {
        label: 'Time Wasted (minutes)',
        data: basicInputs.map(entry => entry.timeWastedRandomly),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
    ],
  };

  // Task Distribution
  const taskDistributionChart = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [performanceMetrics.tasks.completed, performanceMetrics.tasks.pending],
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Performance History (Stock Chart)
  const perfHistoryLabels = performanceHistory.map(entry =>
    new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  );
  const perfHistoryValues = performanceHistory.map(entry => entry.value);
  const perfHistoryChart = {
    labels: perfHistoryLabels,
    datasets: [
      {
        label: 'Performance (Stock Style)',
        data: perfHistoryValues,
        borderColor: perfHistoryValues[perfHistoryValues.length-1] >= perfHistoryValues[0] ? 'rgb(34,197,94)' : 'rgb(239,68,68)',
        backgroundColor: perfHistoryValues[perfHistoryValues.length-1] >= perfHistoryValues[0] ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
        fill: true,
        tension: 0.2,
        pointRadius: 0,
        borderWidth: 3,
      },
    ],
  };

  // Weekly Task Completion
  const weeklyTaskCompletion = {
    labels: Object.keys(performanceMetrics.tasks.weeklyCompletion),
    datasets: [
      {
        label: 'Tasks Completed',
        data: Object.values(performanceMetrics.tasks.weeklyCompletion),
        backgroundColor: 'rgba(234, 179, 8, 0.5)',
        borderColor: 'rgba(234, 179, 8, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Summary Stats
  const summaryStats = performanceMetrics.dailyStats;

  return {
    wakeUpTimeChart,
    dailyActivitiesChart,
    taskDistributionChart,
    perfHistoryChart,
    weeklyTaskCompletion,
    summaryStats,
  };
}

export async function GET() {
  // In production, fetch and process real DB data here
  const analytics = prepareCalendarAnalytics(performanceData);
  return NextResponse.json(analytics);
} 