"use client";

import { useState, useEffect } from "react";
import { HiPlus, HiDownload, HiDocumentText, HiChartBar } from "react-icons/hi";
import { MetricCard, Button, WalletConnect } from "@/components/ui";

export default function OverviewPage() {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    recordedTransactions: 0,
    totalVolume: 0,
    recordedVolume: 0,
    topCategories: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch transactions stats
        const res = await fetch('/api/transactions/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51c56]"></div>
        </div>
      </div>
    );
  }

  const recordingRate = stats.totalTransactions > 0 
    ? Math.round((stats.recordedTransactions / stats.totalTransactions) * 100) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Dashboard
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            ISO 20022 Payment System Overview
          </p>
        </div>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div> 

      {!stats.totalTransactions ? (
        <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <WalletConnect />
            <p className="text-sm text-amber-900 dark:text-amber-200">
              Connect your Flare wallet to sync transactions and start generating ISO 20022 proofs
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Transactions"
          value={stats.totalTransactions.toLocaleString()}
          change={`${stats.totalTransactions} this period`}
          trend="neutral"
          icon={HiChartBar}
        />
        <MetricCard
          title="Recorded Proofs"
          value={stats.recordedTransactions.toLocaleString()}
          change={`${recordingRate}% of total`}
          trend={recordingRate > 50 ? "up" : "neutral"}
          icon={HiDocumentText}
        />
        <MetricCard
          title="Total Volume"
          value={`${stats.totalVolume.toFixed(2)} FLR`}
          change={`${stats.totalTransactions} transactions`}
          trend="neutral"
        />
        <MetricCard
          title="Recorded Volume"
          value={`${stats.recordedVolume.toFixed(2)} FLR`}
          change={`${recordingRate}% completion rate`}
          trend={recordingRate > 50 ? "up" : "neutral"}
        />
      </div> 

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2" href="/transactions">
              <HiPlus className="w-4 h-4" />
              Manage Transactions
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" href="/transactions">
              <HiDocumentText className="w-4 h-4" />
              Generate New Proof
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" href="/proofs">
              <HiDownload className="w-4 h-4" />
              View All Proofs
            </Button>
          </div>
        </div> 

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Category Breakdown
          </h2>
          <div className="space-y-3">
            {stats.topCategories.length > 0 ? (
              stats.topCategories.map((category: any, index: number) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-green-500' : 
                      index === 1 ? 'bg-red-500' : 
                      index === 2 ? 'bg-blue-500' : 'bg-purple-500'
                    }`} />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{category.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {category.count} transaction{category.count !== 1 ? 's' : ''}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-zinc-500 dark:text-zinc-400 py-4">
                No transactions categorized yet
              </div>
            )}
          </div>
        </div>
      </div>

      {stats.recordedTransactions > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Recent Activity
          </h2>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-green-900 dark:text-green-200">
                ISO 20022 compliance: {stats.recordedTransactions} proof{stats.recordedTransactions !== 1 ? 's' : ''} generated
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}