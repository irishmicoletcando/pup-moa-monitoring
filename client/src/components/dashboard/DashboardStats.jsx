import React, { useEffect, useState } from 'react';
import { PieGraph } from './PieGraph';
import { BarGraph } from './BarGraph';

export default function DashboardStats() {
  const [typeStats, setTypeStats] = useState({
    practicum: 0,
    employment: 0,
    scholarship: 0,
    research: 0
  });
  
  const [statusStats, setStatusStats] = useState({
    Active: 0,
    Expiry: 0,
    Expired: 0
  });

  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/moa-count-type');
        if (!response.ok) {
          throw new Error('Failed to fetch MOA stats');
        }

        const data = await response.json();
        console.log("Fetched MOA type stats:", data);

        setTypeStats(data);
      } catch (error) {
        console.error('Error fetching MOA stats:', error);
      } finally {
        setLoading(false); // Set loading to false when fetch is done
      }
    };

    fetchStats();
  }, []);

  // Fetch stats for MOA status
  useEffect(() => {
    const fetchStatusStats = async () => {
      try {
        const response = await fetch('/api/moa-count-status');
        if (!response.ok) {
          throw new Error('Failed to fetch MOA status stats');
        }

        const data = await response.json();
        console.log("Fetched MOA status stats:", data);

        setStatusStats(data);
      } catch (error) {
        console.error('Error fetching MOA status stats:', error);
      }
    };

    fetchStatusStats();
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
    <main className="flex-1 px-6 py-5 mb-14 md:mb-0">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
          <MoaCard title="Employment" count={typeStats.employment} description="Total Number"/>
          <MoaCard title="Research" count={typeStats.research} description="Total Number" />
          <MoaCard title="Practicum" count={typeStats.practicum} description="Total Number" />
          <MoaCard title="Scholarship" count={typeStats.scholarship} description="Total Number" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BarGraph stats={typeStats} />
          <PieGraph stats={statusStats}/>
        </div>
      </div>
    </main>
  );
}

const MoaCard = ({ title, count, description}) => (
  <div className="p-4 rounded-xl shadow-md hover:shadow-md transition bg-white border-2 border-gray-200 dark:bg-gray-800">
    <p className="text-md font-bold text-gray-900 dark:text-white mb-2">{title}</p>
    <div className="p-2 rounded-lg flex flex-row justify-center items-center space-x-4">
      <p className="text-4xl font-bold text-gray-900 dark:text-white">{count}</p>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold">{description}</p>
  </div>
);
