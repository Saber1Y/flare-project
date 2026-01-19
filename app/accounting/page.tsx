"use client";

import { Badge, Button, Table, Card } from "@/components/ui";

export default function AccountingPage() {
  const records = [
    {
      id: "REC-001",
      txHash: "0x9f8e7d6c5b4a",
      isoType: "camt.053",
      amount: "250.00 FLR",
      category: "Expense",
      createdAt: "2026-01-18 14:32",
      flareAnchor: "0xabcdef123456",
      status: "verified"
    },
    {
      id: "REC-002",
      txHash: "0x34567890abcd",
      isoType: "camt.053",
      amount: "1000.00 FLR",
      category: "Payroll",
      createdAt: "2026-01-17 09:15",
      flareAnchor: "0x7890123456ab",
      status: "verified"
    }
  ];

  const columns = [
    { key: "id", header: "Record ID", className: "font-mono text-xs" },
    { key: "txHash", header: "Transaction", className: "font-mono text-xs" },
    { key: "isoType", header: "ISO Type", className: "" },
    { key: "amount", header: "Amount", className: "font-semibold" },
    { key: "category", header: "Category", className: "" },
    { key: "createdAt", header: "Created", className: "" },
    { key: "flareAnchor", header: "Flare Anchor", className: "font-mono text-xs" },
    { key: "status", header: "Status", className: "" },
    { key: "actions", header: "", className: "text-right" }
  ];

  const tableData = records.map((record) => ({
    id: record.id,
    txHash: (
      <a
        href={`https://flare-explorer.com/tx/${record.txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#e51c56] hover:underline"
      >
        {record.txHash.slice(0, 16)}...
      </a>
    ),
    isoType: (
      <Badge variant="default">
        {record.isoType}
      </Badge>
    ),
    amount: record.amount,
    category: (
      <Badge variant={record.category.toLowerCase() as any}>
        {record.category}
      </Badge>
    ),
    createdAt: record.createdAt,
    flareAnchor: (
      <a
        href={`https://flare-explorer.com/tx/${record.flareAnchor}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#e51c56] hover:underline"
      >
        {record.flareAnchor.slice(0, 16)}...
      </a>
    ),
    status: (
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-sm text-green-600 dark:text-green-400">Verified</span>
      </div>
    ),
    actions: (
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm">
          Download ISO
        </Button>
        <Button variant="primary" size="sm">
          View Proof
        </Button>
      </div>
    )
  }));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Accounting Records
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          ISO 20022–aligned payment records generated from your transactions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Total Records
          </div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            2
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
            All verified on Flare
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Total Recorded
          </div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            $1,250.00
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
            Across 2 transactions
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            ISO Format
          </div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            camt.053
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
            Bank Account Statement
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Generated Records
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Export All (CSV)
            </Button>
            <Button variant="outline" size="sm">
              Export All (ISO)
            </Button>
          </div>
        </div>
        <Table columns={columns} data={tableData} />
      </Card>
    </div>
  );
}
