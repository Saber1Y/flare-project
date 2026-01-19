"use client";

import { useState } from "react";
import { Button, Badge, Table, Card, Select } from "@/components/ui";

export default function StatementsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2026-01");

  const statements = [
    {
      id: "STMT-001",
      period: "2025-12",
      totalIn: "5,000.00 FLR",
      totalOut: "2,500.00 FLR",
      net: "+2,500.00 FLR",
      transactions: 12,
      createdAt: "2026-01-01",
      status: "closed"
    },
    {
      id: "STMT-002",
      period: "2025-11",
      totalIn: "3,200.00 FLR",
      totalOut: "1,800.00 FLR",
      net: "+1,400.00 FLR",
      transactions: 8,
      createdAt: "2025-12-01",
      status: "closed"
    }
  ];

  const columns = [
    { key: "period", header: "Period", className: "" },
    { key: "totalIn", header: "Total In", className: "font-semibold text-green-600 dark:text-green-400" },
    { key: "totalOut", header: "Total Out", className: "font-semibold text-red-600 dark:text-red-400" },
    { key: "net", header: "Net", className: "font-semibold" },
    { key: "transactions", header: "Transactions", className: "" },
    { key: "createdAt", header: "Created", className: "" },
    { key: "status", header: "Status", className: "" },
    { key: "actions", header: "", className: "text-right" }
  ];

  const tableData = statements.map((stmt) => ({
    period: stmt.period,
    totalIn: stmt.totalIn,
    totalOut: stmt.totalOut,
    net: (
      <span className={stmt.net.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
        {stmt.net}
      </span>
    ),
    transactions: stmt.transactions,
    createdAt: stmt.createdAt,
    status: (
      <Badge variant="recorded">
        Closed
      </Badge>
    ),
    actions: (
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm">
          Download CSV
        </Button>
        <Button variant="outline" size="sm">
          Download ISO
        </Button>
        <Button variant="primary" size="sm">
          View Details
        </Button>
      </div>
    )
  }));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Statements
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Generate and export monthly financial statements
        </p>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Close Month
        </h2>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Select Period
            </label>
            <Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="2026-01">January 2026</option>
              <option value="2025-12">December 2025</option>
              <option value="2025-11">November 2025</option>
            </Select>
          </div>
          <div className="flex items-end">
            <Button variant="primary" className="w-full lg:w-auto">
              Close January 2026
            </Button>
          </div>
        </div>
        <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Summary for January 2026
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-zinc-500 dark:text-zinc-500">Total In</div>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">$0.00</div>
            </div>
            <div>
              <div className="text-zinc-500 dark:text-zinc-500">Total Out</div>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">$0.00</div>
            </div>
            <div>
              <div className="text-zinc-500 dark:text-zinc-500">Transactions</div>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">0</div>
            </div>
            <div>
              <div className="text-zinc-500 dark:text-zinc-500">Recorded</div>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">0%</div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Historical Statements
          </h2>
          <Button variant="outline" size="sm">
            Export All
          </Button>
        </div>
        <Table columns={columns} data={tableData} />
      </Card>
    </div>
  );
}
