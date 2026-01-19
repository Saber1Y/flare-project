"use client";

import { useState } from "react";
import { Button, Badge, Table, Select, Input, WalletConnect } from "@/components/ui";

export default function TransactionsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);

  const transactions = [
    {
      hash: "0x1a2b3c4d5e6f",
      date: "2026-01-19",
      from: "0x1234...5678",
      to: "0xabcd...efgh",
      amount: "500.00 FLR",
      category: "income",
      recorded: false
    },
    {
      hash: "0x9f8e7d6c5b4a",
      date: "2026-01-18",
      from: "0xabcd...efgh",
      to: "0x5678...9012",
      amount: "250.00 FLR",
      category: "expense",
      recorded: true
    },
    {
      hash: "0x34567890abcd",
      date: "2026-01-17",
      from: "0x1234...5678",
      to: "0x9012...3456",
      amount: "1000.00 FLR",
      category: "payroll",
      recorded: true
    }
  ];

  const columns = [
    { key: "hash", header: "Transaction Hash", className: "font-mono text-xs" },
    { key: "date", header: "Date", className: "" },
    { key: "from", header: "From", className: "font-mono text-xs" },
    { key: "to", header: "To", className: "font-mono text-xs" },
    { key: "amount", header: "Amount", className: "font-semibold" },
    { key: "category", header: "Category", className: "" },
    { key: "recorded", header: "Status", className: "" },
    { key: "actions", header: "", className: "text-right" }
  ];

  const tableData = transactions.map((tx) => ({
    hash: (
      <a
        href={`https://flare-explorer.com/tx/${tx.hash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#e51c56] hover:underline"
      >
        {tx.hash}
      </a>
    ),
    date: tx.date,
    from: tx.from,
    to: tx.to,
    amount: tx.amount,
    category: (
      <Badge variant={tx.category as any}>
        {tx.category.charAt(0).toUpperCase() + tx.category.slice(1)}
      </Badge>
    ),
    recorded: (
      <Badge variant={tx.recorded ? "recorded" : "unrecorded"}>
        {tx.recorded ? "Recorded" : "Unrecorded"}
      </Badge>
    ),
    actions: (
      <div className="flex items-center justify-end gap-2">
        {!tx.recorded && (
          <Button variant="outline" size="sm">
            Generate Record
          </Button>
        )}
        {tx.recorded && (
          <Button variant="ghost" size="sm">
            View Proof
          </Button>
        )}
      </div>
    )
  }));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Transactions
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Manage and categorize your Flare transactions
          </p>
        </div>
        <WalletConnect />
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-amber-900 dark:text-amber-200">
            <strong>3 transactions</strong> found. <strong>2 recorded</strong>, 1 pending.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by hash, address, or amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full lg:w-48">
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="payroll">Payroll</option>
              <option value="treasury">Treasury</option>
            </Select>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-4">
          <input
            type="checkbox"
            id="select-all"
            className="w-4 h-4 text-[#e51c56] border-zinc-300 rounded focus:ring-[#e51c56]"
          />
          <label htmlFor="select-all" className="text-sm text-zinc-600 dark:text-zinc-400">
            Select All
          </label>
          {selectedTransactions.length > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {selectedTransactions.length} selected
              </span>
              <Button variant="primary" size="sm">
                Generate Records
              </Button>
              <Button variant="outline" size="sm">
                Export Selected
              </Button>
            </div>
          )}
        </div>

        <Table columns={columns} data={tableData} />
      </div>
    </div>
  );
}
