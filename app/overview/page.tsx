"use client";

import { MetricCard, Button } from "@/components/ui";

export default function OverviewPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Overview
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            January 2026
          </p>
        </div>
        <Button variant="primary">
          Close Month
        </Button>
      </div>

      <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <WalletConnect />
          <p className="text-sm text-amber-900 dark:text-amber-200">
            Connect your Flare wallet to sync transactions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total In"
          value="$0.00"
          change="No data"
          trend="neutral"
        />
        <MetricCard
          title="Total Out"
          value="$0.00"
          change="No data"
          trend="neutral"
        />
        <MetricCard
          title="Transactions"
          value="0"
          change="0 this month"
          trend="neutral"
        />
        <MetricCard
          title="Recorded"
          value="0%"
          change="0 of 0 transactions"
          trend="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Import Transactions
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Generate Records
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Export Statement
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Category Breakdown
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">Income</span>
              </div>
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">$0.00</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">Expenses</span>
              </div>
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">$0.00</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">Payroll</span>
              </div>
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">$0.00</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">Treasury</span>
              </div>
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">$0.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WalletConnect() {
  return (
    <Button variant="primary" size="sm">
      Connect Wallet
    </Button>
  );
}
