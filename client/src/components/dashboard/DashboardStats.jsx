import React, { useEffect, useState } from 'react';
import { PieGraph } from './PieGraph';
import {BarGraph} from './BarGraph';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    practicum: 0,
    employment: 0,
    scholarship: 0,
    research: 0
  });
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/moastats');
        if (!response.ok) {
          throw new Error('Failed to fetch MOA stats');
        }

        const data = await response.json();
        console.log("Fetched MOA stats:", data);

        setStats(data);
      } catch (error) {
        console.error('Error fetching MOA stats:', error);
      } finally {
        setLoading(false); // Set loading to false when fetch is done
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <main className="flex-1 px-6 py-5">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="flex justify-center items-center space-x-2">
          <div className="w-8 h-8 border-4 border-maroon border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading stats...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-6 py-5">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MoaCard title="Employment" count={stats.employment} description="Total Number:" />
          <MoaCard title="Research" count={stats.research} description="Total Number:" />
          <MoaCard title="Practicum" count={stats.practicum} description="Total Number:" />
          <MoaCard title="Scholarship" count={stats.scholarship} description="Total Number:" />
        </div>
        <BarGraph stats={stats} />
      </div>
        <PieGraph stats={stats} />
    </main>
  );
}

const MoaCard = ({ title, count, description }) => (
  <div className="p-4 rounded-xl shadow-md hover:shadow-md transition bg-white border-2 border-gray-200 dark:bg-gray-800">
    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
    <div className="p-4 rounded-lg flex flex-row justify-center items-center space-x-4">
      <p className="text-gray-600 dark:text-gray-300 font-semibold">{description}</p>
      <p className="text-7xl font-bold text-gray-900 dark:text-white">{count}</p>
    </div>
  </div>
);
