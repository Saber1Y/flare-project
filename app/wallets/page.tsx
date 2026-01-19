"use client";

import { Button, Badge, Table, Card, Input } from "@/components/ui";

export default function WalletsPage() {
  const wallets = [
    {
      address: "0x1234567890abcdef1234567890abcdef12345678",
      label: "Main Wallet",
      balance: "5,234.56 FLR",
      transactions: 45,
      isActive: true,
      lastSync: "2026-01-19 14:32"
    },
    {
      address: "0xabcdef1234567890abcdef1234567890abcdef12",
      label: "Treasury",
      balance: "12,789.00 FLR",
      transactions: 23,
      isActive: false,
      lastSync: "2026-01-18 09:15"
    }
  ];

  const columns = [
    { key: "label", header: "Label", className: "" },
    { key: "address", header: "Address", className: "font-mono text-xs" },
    { key: "balance", header: "Balance", className: "font-semibold" },
    { key: "transactions", header: "Transactions", className: "" },
    { key: "lastSync", header: "Last Sync", className: "" },
    { key: "status", header: "Status", className: "" },
    { key: "actions", header: "", className: "text-right" }
  ];

  const tableData = wallets.map((wallet) => ({
    label: (
      <div>
        <div className="font-semibold text-zinc-900 dark:text-zinc-100">{wallet.label}</div>
      </div>
    ),
    address: (
      <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-600 dark:text-zinc-400">
        {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
      </code>
    ),
    balance: wallet.balance,
    transactions: wallet.transactions,
    lastSync: wallet.lastSync,
    status: (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${wallet.isActive ? 'bg-green-500' : 'bg-zinc-400'}`} />
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {wallet.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    ),
    actions: (
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm">
          Sync
        </Button>
        <Button variant="ghost" size="sm">
          Edit
        </Button>
      </div>
    )
  }));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Wallets
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Connect and manage your Flare wallets
          </p>
        </div>
        <Button variant="primary">
          Add Wallet
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Total Balance
          </div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            18,023.56 FLR
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
            Across 2 wallets
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Total Transactions
          </div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            68
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
            2 wallets syncing
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Network Status
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Connected
            </span>
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
            Flare Network (Coston Testnet)
          </div>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Add New Wallet
        </h2>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Wallet Label
            </label>
            <Input placeholder="e.g., Operations, Payroll" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Wallet Address
            </label>
            <Input placeholder="0x..." />
          </div>
          <div className="flex items-end">
            <Button variant="primary" className="w-full lg:w-auto">
              Connect Wallet
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Connected Wallets
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Sync All
            </Button>
          </div>
        </div>
        <Table columns={columns} data={tableData} />
      </Card>

      <Card className="p-6 mt-6 border-2 border-dashed border-zinc-300 dark:border-zinc-700">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔐</div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            Non-Custodial Security
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 max-w-md mx-auto">
            Your private keys never leave your wallet. We only read transaction data from the blockchain.
          </p>
          <Button variant="outline">
            Learn About Security
          </Button>
        </div>
      </Card>
    </div>
  );
}
