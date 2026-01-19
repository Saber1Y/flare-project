"use client";

import { useState } from "react";
import { Button, Badge, Table, Card, Input } from "@/components/ui";

export default function ProofsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const proofs = [
    {
      id: "PROOF-001",
      recordId: "REC-001",
      txHash: "0x9f8e7d6c5b4a",
      amount: "250.00 FLR",
      category: "Expense",
      createdAt: "2026-01-18",
      publicUrl: "https://flare-accounting.com/proof/abc123",
      views: 24
    },
    {
      id: "PROOF-002",
      recordId: "REC-002",
      txHash: "0x34567890abcd",
      amount: "1000.00 FLR",
      category: "Payroll",
      createdAt: "2026-01-17",
      publicUrl: "https://flare-accounting.com/proof/def456",
      views: 156
    }
  ];

  const columns = [
    { key: "id", header: "Proof ID", className: "font-mono text-xs" },
    { key: "recordId", header: "Record ID", className: "font-mono text-xs" },
    { key: "txHash", header: "Transaction", className: "font-mono text-xs" },
    { key: "amount", header: "Amount", className: "font-semibold" },
    { key: "category", header: "Category", className: "" },
    { key: "publicUrl", header: "Public URL", className: "" },
    { key: "views", header: "Views", className: "" },
    { key: "actions", header: "", className: "text-right" }
  ];

  const tableData = proofs.map((proof) => ({
    id: proof.id,
    recordId: proof.recordId,
    txHash: (
      <a
        href={`https://flare-explorer.com/tx/${proof.txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#e51c56] hover:underline"
      >
        {proof.txHash.slice(0, 16)}...
      </a>
    ),
    amount: proof.amount,
    category: (
      <Badge variant={proof.category.toLowerCase() as any}>
        {proof.category}
      </Badge>
    ),
    publicUrl: (
      <div className="flex items-center gap-2">
        <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-600 dark:text-zinc-400">
          {proof.publicUrl.slice(0, 32)}...
        </code>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(proof.publicUrl, proof.id)}
        >
          {copied === proof.id ? "Copied!" : "Copy"}
        </Button>
      </div>
    ),
    views: proof.views,
    actions: (
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm">
          View Proof
        </Button>
        <Button variant="ghost" size="sm">
          Share
        </Button>
      </div>
    )
  }));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Proof Links
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Manage and share read-only proof-of-payment links
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Total Proofs
          </div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            2
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
            All publicly accessible
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Total Views
          </div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            180
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
            Across all proofs
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Recorded Amount
          </div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            $1,250
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
            Verifiable on Flare
          </div>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Create New Proof
        </h2>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Select Record
            </label>
            <select className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#e51c56] focus:border-transparent">
              <option>REC-001 - 250.00 FLR (Expense)</option>
              <option>REC-002 - 1000.00 FLR (Payroll)</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button variant="primary" className="w-full lg:w-auto">
              Generate Proof Link
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Active Proofs
          </h2>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search proofs..."
              className="w-64"
            />
          </div>
        </div>
        <Table columns={columns} data={tableData} />
      </Card>

      <Card className="p-6 mt-6 border-2 border-dashed border-zinc-300 dark:border-zinc-700">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔗</div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            Share with Accountants
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 max-w-md mx-auto">
            Share read-only proof links with your accountant. They can view transactions and download ISO records without wallet access.
          </p>
          <Button variant="outline">
            Learn More
          </Button>
        </div>
      </Card>
    </div>
  );
}
