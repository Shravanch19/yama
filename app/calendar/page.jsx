"use client"
import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

// Set default chart theme
ChartJS.defaults.color = '#E5E7EB' // text color
ChartJS.defaults.scale.grid.color = '#374151' // grid lines
ChartJS.defaults.borderColor = '#4B5563' // borders

const Calendar = () => {
  // Dummy data for performance tracking
  const performanceData = {
    basicInputs: [
      {
        date: new Date('2025-06-19'),
        wakeUpTime: '06:30',
        meditationDuration: 20,
        timeWastedRandomly: 45,
        lastUpdated: new Date('2025-06-19T08:00:00')
      },
      {
        date: new Date('2025-06-18'),
        wakeUpTime: '07:00',
        meditationDuration: 15,
        timeWastedRandomly: 60,
        lastUpdated: new Date('2025-06-18T09:30:00')
      },
      {
        date: new Date('2025-06-17'),
        wakeUpTime: '06:45',
        meditationDuration: 25,
        timeWastedRandomly: 30,
        lastUpdated: new Date('2025-06-17T07:45:00')
      },
      {
        date: new Date('2025-06-16'),
        wakeUpTime: '06:15',
        meditationDuration: 30,
        timeWastedRandomly: 40,
        lastUpdated: new Date('2025-06-16T08:15:00')
      },
      {
        date: new Date('2025-06-15'),
        wakeUpTime: '07:30',
        meditationDuration: 15,
        timeWastedRandomly: 75,
        lastUpdated: new Date('2025-06-15T09:00:00')
      },
      {
        date: new Date('2025-06-14'),
        wakeUpTime: '06:45',
        meditationDuration: 20,
        timeWastedRandomly: 35,
        lastUpdated: new Date('2025-06-14T08:30:00')
      },
      {
        date: new Date('2025-06-13'),
        wakeUpTime: '06:30',
        meditationDuration: 25,
        timeWastedRandomly: 50,
        lastUpdated: new Date('2025-06-13T07:30:00')
      },
      {
        date: new Date('2025-06-12'),
        wakeUpTime: '07:15',
        meditationDuration: 15,
        timeWastedRandomly: 65,
        lastUpdated: new Date('2025-06-12T08:45:00')
      },
      {
        date: new Date('2025-06-11'),
        wakeUpTime: '06:00',
        meditationDuration: 30,
        timeWastedRandomly: 30,
        lastUpdated: new Date('2025-06-11T07:00:00')
      },
      {
        date: new Date('2025-06-10'),
        wakeUpTime: '06:45',
        meditationDuration: 20,
        timeWastedRandomly: 45,
        lastUpdated: new Date('2025-06-10T08:15:00')
      },
      {
        date: new Date('2025-06-09'),
        wakeUpTime: '07:00',
        meditationDuration: 15,
        timeWastedRandomly: 55,
        lastUpdated: new Date('2025-06-09T08:30:00')
      },
      {
        date: new Date('2025-06-08'),
        wakeUpTime: '06:30',
        meditationDuration: 25,
        timeWastedRandomly: 40,
        lastUpdated: new Date('2025-06-08T07:45:00')
      },
      {
        date: new Date('2025-06-07'),
        wakeUpTime: '07:30',
        meditationDuration: 15,
        timeWastedRandomly: 70,
        lastUpdated: new Date('2025-06-07T09:00:00')
      },
      {
        date: new Date('2025-06-06'),
        wakeUpTime: '06:15',
        meditationDuration: 30,
        timeWastedRandomly: 35,
        lastUpdated: new Date('2025-06-06T07:30:00')
      }
    ],
    performanceMetrics: {
      tasks: {
        total: 45,
        completed: 32,
        pending: 13,
        lastCompletedTask: new Date('2025-06-19T14:30:00'),
        lastUpdatedTask: new Date('2025-06-19T16:00:00'),
        byType: {
          deadline: { total: 15, completed: 11 },
          nonNegotiable: { total: 20, completed: 16 },
          procrastinating: { total: 10, completed: 5 }
        },
        weeklyCompletion: {
          'Mon': 5,
          'Tue': 4,
          'Wed': 6,
          'Thu': 4,
          'Fri': 3,
          'Sat': 2,
          'Sun': 3
        }
      },
      dailyStats: {
        averageWakeUpTime: '06:45',
        averageMeditationTime: 21,
        averageTimeWasted: 48,
        consistencyScore: 82, // percentage
        lastWeekImprovement: 12 // percentage
      }
    }
  }

  // Dummy performance history for stock-like chart
  const performanceHistory = [
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
  ];

  const { basicInputs, performanceMetrics } = performanceData

  // Prepare data for Wake-up Time Trend
  const wakeUpTimes = basicInputs.map(entry => {
    const [hours, minutes] = entry.wakeUpTime.split(':')
    return parseFloat(hours) + parseFloat(minutes) / 60
  })

  const dates = basicInputs.map(entry => {
    return new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })

  const wakeUpTimeChart = {
    labels: dates,
    datasets: [
      {
        label: 'Wake-up Time',
        data: wakeUpTimes,
        borderColor: 'rgb(37, 99, 235)', // blue-600
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.1,
        fill: true,
      },
    ],
  }

  // Prepare data for Daily Activities
  const dailyActivitiesChart = {
    labels: dates,
    datasets: [
      {
        label: 'Meditation (minutes)',
        data: basicInputs.map(entry => entry.meditationDuration),
        backgroundColor: 'rgba(139, 92, 246, 0.5)', // violet-500
      },
      {
        label: 'Time Wasted (minutes)',
        data: basicInputs.map(entry => entry.timeWastedRandomly),
        backgroundColor: 'rgba(239, 68, 68, 0.5)', // red-500
      },
    ],
  }

  // Prepare data for Task Distribution
  const taskDistributionChart = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [performanceMetrics.tasks.completed, performanceMetrics.tasks.pending],
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)', // green-500
          'rgba(239, 68, 68, 0.5)', // red-500
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  // Prepare data for Stock Market-like Performance Chart
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
        borderColor: perfHistoryValues[perfHistoryValues.length-1] >= perfHistoryValues[0] ? 'rgb(34,197,94)' : 'rgb(239,68,68)', // green if up, red if down
        backgroundColor: perfHistoryValues[perfHistoryValues.length-1] >= perfHistoryValues[0] ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
        fill: true,
        tension: 0.2,
        pointRadius: 0,
        borderWidth: 3,
      },
    ],
  };

  const perfHistoryOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: '📈 Performance Over Time (Stock Chart)',
        color: '#E5E7EB',
        font: { family: "'Inter', sans-serif", size: 18, weight: 'bold' },
      },
      tooltip: {
        callbacks: {
          label: (context) => `Score: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: '#374151' },
        ticks: { color: '#E5E7EB' },
      },
      y: {
        grid: { color: '#374151' },
        ticks: { color: '#E5E7EB' },
        beginAtZero: false,
      },
    },
    elements: {
      line: { borderJoinStyle: 'round' },
    },
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#E5E7EB',
          font: {
            family: "'Inter', sans-serif",
          }
        }
      },
      title: {
        color: '#E5E7EB',
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: 'bold'
        }
      }
    }
  }

  const lineOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        display: true,
        text: 'Wake-up Time Trend',
      },
    },
    scales: {
      y: {
        min: 5,
        max: 8,
        grid: {
          color: '#374151'
        },
        ticks: {
          callback: (value) => {
            const hours = Math.floor(value)
            const minutes = Math.round((value - hours) * 60)
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
          },
          color: '#E5E7EB'
        }
      },
      x: {
        grid: {
          color: '#374151'
        },
        ticks: {
          color: '#E5E7EB'
        }
      }
    }
  }

  const barOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        display: true,
        text: 'Daily Activities',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#374151'
        },
        ticks: {
          color: '#E5E7EB'
        }
      },
      x: {
        grid: {
          color: '#374151'
        },
        ticks: {
          color: '#E5E7EB'
        }
      }
    }
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-300 mb-8">📊 Performance Analytics</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stock Market-like Performance Chart */}
          <div className="col-span-1 lg:col-span-2 bg-gray-800 rounded-xl shadow-lg p-6 border border-green-600">
            <Line data={perfHistoryChart} options={perfHistoryOptions} height={80} />
          </div>
          {/* Wake-up Time Trend */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-blue-600">
            <Line data={wakeUpTimeChart} options={lineOptions} />
          </div>

          {/* Daily Activities */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-violet-600">
            <Bar data={dailyActivitiesChart} options={barOptions} />
          </div>

          {/* Task Distribution */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-green-600">
            <Doughnut 
              data={taskDistributionChart} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    display: true,
                    text: 'Task Completion Status',
                  },
                }
              }} 
            />
          </div>

          {/* Weekly Task Completion */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-yellow-600">
            <Bar 
              data={{
                labels: Object.keys(performanceMetrics.tasks.weeklyCompletion),
                datasets: [{
                  label: 'Tasks Completed',
                  data: Object.values(performanceMetrics.tasks.weeklyCompletion),
                  backgroundColor: 'rgba(234, 179, 8, 0.5)', // yellow-500
                  borderColor: 'rgba(234, 179, 8, 1)',
                  borderWidth: 1,
                }]
              }}
              options={{
                ...barOptions,
                plugins: {
                  ...barOptions.plugins,
                  title: {
                    ...barOptions.plugins.title,
                    text: 'Weekly Task Completion',
                  },
                }
              }}
            />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-blue-600">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Consistency Score</h3>
            <p className="text-3xl font-bold text-blue-400">{performanceMetrics.dailyStats.consistencyScore}%</p>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-green-600">
            <h3 className="text-lg font-semibold text-green-300 mb-2">Average Wake-up</h3>
            <p className="text-3xl font-bold text-green-400">{performanceMetrics.dailyStats.averageWakeUpTime}</p>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-violet-600">
            <h3 className="text-lg font-semibold text-violet-300 mb-2">Avg. Meditation</h3>
            <p className="text-3xl font-bold text-violet-400">{performanceMetrics.dailyStats.averageMeditationTime}min</p>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-yellow-600">
            <h3 className="text-lg font-semibold text-yellow-300 mb-2">Weekly Improvement</h3>
            <p className="text-3xl font-bold text-yellow-400">+{performanceMetrics.dailyStats.lastWeekImprovement}%</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Calendar