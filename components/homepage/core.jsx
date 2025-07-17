// Filename: Core.jsx

"use client";
import React, { useState, useEffect, useMemo } from "react";
import CircularProgress from "@/components/ui/CircularProgress";
import DeadlineTaskCard from "../ui/DeadlineTaskCard";
import TaskListPanel from "../ui/TaskListPanel";
import useDashboardData from "@/hooks/useDashboardData";
import useBasicInputs from "@/hooks/useBasicInputs";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import PerformanceChart from "@/components/ui/PerformanceChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LearningCard = ({ title, level }) => {
  const progress = parseInt(level.match(/\d+/)?.[0] || "0", 10);
  return (
    <div className="bg-gray-700 p-4 rounded-lg hover:scale-105 transition-transform">
      <p className="text-cyan-200 font-semibold">{title}</p>
      <div className="mt-2 bg-gray-600 h-2 rounded overflow-hidden">
        <div
          className="h-full bg-cyan-400 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-cyan-300 text-right mt-1">{progress}%</p>
    </div>
  );
};

const Core = () => {
  const { data, loading, error, completeTask } = useDashboardData();
  const {
    basicInputs,
    handleBasicInputChange,
    handleBasicInputSubmit,
    loading: basicLoading,
    error: basicError,
  } = useBasicInputs();

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="container mx-auto px-6 py-12 my-10 rounded-3xl shadow-inner bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700">
        <div className="mb-12 bg-gray-800 rounded-xl shadow-lg p-6 border border-green-600">
          <PerformanceChart />
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
          <section className="col-span-2 bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-700">
            <h1 className="text-3xl font-bold text-cyan-400 mb-8">⚙️ Core Projects & Plans</h1>

            <div className="mb-12 p-6 shadow-xl border rounded-xl border-blue-600">
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">🚀 Project Progress</h2>
              <div className="flex flex-wrap justify-center gap-6">
                {loading ? (
                  <p className="text-gray-400">Loading...</p>
                ) : error ? (
                  <p className="text-red-400">{error}</p>
                ) : (
                  data.projects.map(({ name, progress }) => (
                    <CircularProgress key={name} name={name} progress={progress} />
                  ))
                )}
              </div>
            </div>

            <div className="mb-12 p-6 shadow-xl border rounded-xl border-green-600">
              <h2 className="text-2xl font-semibold text-blue-300 mb-4">📚 New Learnings</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {loading ? (
                  <p className="text-gray-400">Loading...</p>
                ) : (
                  data.learnings.map((item, idx) => (
                    <LearningCard key={idx} {...item} />
                  ))
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-pink-300 mb-4">🛑 Deadline Tasks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                  <p className="text-gray-400">Loading...</p>
                ) : (
                  data.tasks.deadline.slice(0, 4).map((task) => (
                    <DeadlineTaskCard
                      key={task._id}
                      task={task}
                      onComplete={completeTask}
                      loading={false}
                    />
                  ))
                )}
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-8">
            <TaskListPanel
              title="🕒 Procrastinating Tasks"
              tasks={data.tasks.procrastinating}
              loading={loading}
              error={error}
              type="procrastinating"
              color="red"
              completeTask={completeTask}
            />

            <TaskListPanel
              title="💪 Non-Negotiable Tasks"
              tasks={data.tasks.nonNegotiable}
              loading={loading}
              error={error}
              type="nonNegotiable"
              color="green"
              completeTask={completeTask}
            />

            <div className="bg-gray-800 p-6 rounded-2xl border border-blue-600 shadow-xl">
              <h2 className="text-2xl font-bold text-blue-300 mb-4">🧘 Basic Inputs</h2>
              <div className="space-y-4">
                {["wakeUpTime", "meditationDuration", "timeWastedRandomly"].map((field) => (
                  <div key={field} className="flex flex-col">
                    <label className="text-sm font-medium text-blue-100 mb-1">
                      {field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                    </label>
                    <input
                      type="text"
                      value={basicInputs[field]}
                      onChange={(e) => handleBasicInputChange(field, e.target.value)}
                      placeholder="HH:MM"
                      className="px-4 py-2 bg-gray-900 border border-blue-500 text-white rounded-lg shadow"
                    />
                    <span className="text-xs text-blue-300 mt-1">Format: HH:MM</span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleBasicInputSubmit}
                disabled={basicLoading}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
              >
                {basicLoading ? "Saving..." : "Update"}
              </button>
              {basicError && <p className="mt-2 text-red-400 text-sm">{basicError}</p>}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
};

export default Core;
