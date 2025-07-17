"use client"
import React, { useEffect, useState } from 'react'
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
import PerformanceChart from "@/components/ui/PerformanceChart";

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
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/calendar-data');
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><p>Loading...</p></main>;
  }
  if (error) {
    return <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><p>Error: {error}</p></main>;
  }
  if (!analytics) {
    return <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><p>No data available</p></main>;
  }

  const {
    wakeUpTimeChart,
    dailyActivitiesChart,
    taskDistributionChart,
    perfHistoryChart,
    weeklyTaskCompletion,
    summaryStats
  } = analytics;

  // Chart options (same as before)
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
  };

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
  };

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
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-10">
          <PerformanceChart />
        </div>
        <h1 className="text-3xl font-bold text-blue-300 mb-8">📊 Performance Analytics</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              data={weeklyTaskCompletion}
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
            <p className="text-3xl font-bold text-blue-400">{summaryStats.consistencyScore}%</p>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-green-600">
            <h3 className="text-lg font-semibold text-green-300 mb-2">Average Wake-up</h3>
            <p className="text-3xl font-bold text-green-400">{summaryStats.averageWakeUpTime}</p>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-violet-600">
            <h3 className="text-lg font-semibold text-violet-300 mb-2">Avg. Meditation</h3>
            <p className="text-3xl font-bold text-violet-400">{summaryStats.averageMeditationTime}min</p>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-yellow-600">
            <h3 className="text-lg font-semibold text-yellow-300 mb-2">Weekly Improvement</h3>
            <p className="text-3xl font-bold text-yellow-400">+{summaryStats.lastWeekImprovement}%</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Calendar