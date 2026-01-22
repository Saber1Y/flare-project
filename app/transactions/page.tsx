"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Badge,
  Table,
  Select,
  Input,
  WalletConnect,
  Card,
} from "@/components/ui";

export default function TransactionsPage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [isTestnet, setIsTestnet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    [],
  );
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('flare-wallet-address')
    const savedTestnet = localStorage.getItem('flare-is-testnet')
    const savedTransactions = localStorage.getItem('flare-transactions')
    
    if (savedWallet) setWalletAddress(savedWallet)
    if (savedTestnet) setIsTestnet(savedTestnet === 'true')
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions))
  }, [])

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('flare-wallet-address', walletAddress)
    localStorage.setItem('flare-is-testnet', String(isTestnet))
    localStorage.setItem('flare-transactions', JSON.stringify(transactions))
  }, [walletAddress, isTestnet, transactions])

  const fetchTransactions = async () => {
    if (!walletAddress) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/transactions?wallet=${walletAddress}&testnet=${isTestnet}`,
      );
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setTransactions(data.transactions);
        console.log(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (hash: string, category: string) => {
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash, category }),
      });

      if (res.ok) {
        // Update local state
        setTransactions((txs) =>
          txs.map((tx) => (tx.hash === hash ? { ...tx, category } : tx)),
        );
      }
    } catch (err: any) {
      console.error("Failed to update category:", err);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTransactions(filteredTransactions.map(tx => tx.hash));
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleSelectTransaction = (hash: string, checked: boolean) => {
    if (checked) {
      setSelectedTransactions(prev => [...prev, hash]);
    } else {
      setSelectedTransactions(prev => prev.filter(h => h !== hash));
    }
  };

  const bulkUpdateCategory = async (category: string) => {
    try {
      const res = await fetch("/api/transactions/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hashes: selectedTransactions, category }),
      });

      if (res.ok) {
        // Update local state
        setTransactions((txs) =>
          txs.map((tx) =>
            selectedTransactions.includes(tx.hash) ? { ...tx, category } : tx
          )
        );
        setSelectedTransactions([]);
      }
    } catch (err: any) {
      console.error("Failed to bulk update category:", err);
    }
  };

  const exportSelected = () => {
    const selectedTxs = transactions.filter(tx =>
      selectedTransactions.includes(tx.hash)
    );
    
    const csv = [
      ['Hash', 'From', 'To', 'Value', 'Category', 'Date'].join(','),
      ...selectedTxs.map(tx => [
        tx.hash,
        tx.from_address,
        tx.to_address || '',
        tx.value,
        tx.category,
        new Date(tx.timestamp * 1000).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${walletAddress.slice(0,8)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesCategory =
      selectedCategory === "all" || tx.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.from_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.to_address?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const recordedCount = transactions.filter((tx) => tx.recorded).length;
  const recorded = transactions.filter((tx) => tx.recorded);

  const columns = [
    { key: "select", header: "", className: "w-10" },
    { key: "hash", header: "Transaction Hash", className: "font-mono text-xs" },
    { key: "date", header: "Date", className: "" },
    { key: "from", header: "From", className: "font-mono text-xs" },
    { key: "to", header: "To", className: "font-mono text-xs" },
    { key: "amount", header: "Amount", className: "font-semibold" },
    { key: "category", header: "Category", className: "" },
    { key: "recorded", header: "Status", className: "" },
    { key: "actions", header: "", className: "text-right" },
  ];

  const tableData = filteredTransactions.map((tx) => ({
    select: (
      <input
        type="checkbox"
        checked={selectedTransactions.includes(tx.hash)}
        onChange={(e) => handleSelectTransaction(tx.hash, e.target.checked)}
        className="w-4 h-4 text-[#e51c56] border-zinc-300 rounded focus:ring-[#e51c56]"
      />
    ),
    hash: (
      <a
        href={`https://${isTestnet ? "coston-" : ""}flare-explorer.com/tx/${tx.hash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#e51c56] hover:underline"
      >
        {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
      </a>
    ),
    date: new Date(tx.timestamp * 1000).toLocaleDateString(),
    from: (
      <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-600 dark:text-zinc-400">
        {tx.from_address.slice(0, 8)}...{tx.from_address.slice(-6)}
      </code>
    ),
    to: tx.to_address ? (
      <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-600 dark:text-zinc-400">
        {tx.to_address.slice(0, 8)}...{tx.to_address.slice(-6)}
      </code>
    ) : (
      "-"
    ),
    amount: `${tx.value} FLR`,
    category: (
      <select
        value={tx.category}
        onChange={(e) => updateCategory(tx.hash, e.target.value)}
        className="text-sm border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
      >
        <option value="uncategorized">Uncategorized</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
        <option value="payroll">Payroll</option>
        <option value="treasury">Treasury</option>
      </select>
    ),
    recorded: (
      <Badge variant={tx.recorded ? "recorded" : "unrecorded"}>
        {tx.recorded ? "Recorded" : "Unrecorded"}
      </Badge>
    ),
    actions: (
      <div className="flex items-center justify-end gap-2">
        {!tx.recorded && (
          <Button variant="outline" size="sm" disabled>
            Generate Record
          </Button>
        )}
        {tx.recorded && (
          <Button variant="ghost" size="sm" disabled>
            View Proof
          </Button>
        )}
      </div>
    ),
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

      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Fetch Transactions
        </h2>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Wallet Address
            </label>
            <Input
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>
          <div className="w-full lg:w-48">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Network
            </label>
            <Select
              value={isTestnet ? "testnet" : "mainnet"}
              onChange={(e) => setIsTestnet(e.target.value === "testnet")}
            >
              <option value="mainnet">Flare Mainnet</option>
              <option value="testnet">Coston Testnet</option>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              variant="primary"
              onClick={fetchTransactions}
              disabled={!walletAddress || loading}
              className="w-full lg:w-auto"
            >
              {loading ? "Fetching..." : "Fetch Transactions"}
            </Button>
          </div>
        </div>
        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-900 dark:text-red-200">{error}</p>
          </div>
        )}
      </Card>

      {transactions.length > 0 && (
        <>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-amber-600 dark:text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-amber-900 dark:text-amber-200">
                <strong>{transactions.length} transactions</strong> found.{" "}
                <strong>{recordedCount} recorded</strong>,{" "}
                {transactions.length - recordedCount} pending.
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
                  <option value="uncategorized">Uncategorized</option>
                </Select>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-4">
              <input
                type="checkbox"
                id="select-all"
                checked={selectedTransactions.length > 0 && selectedTransactions.length === filteredTransactions.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4 h-4 text-[#e51c56] border-zinc-300 rounded focus:ring-[#e51c56]"
              />
              <label
                htmlFor="select-all"
                className="text-sm text-zinc-600 dark:text-zinc-400"
              >
                Select All
              </label>
              {selectedTransactions.length > 0 && (
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {selectedTransactions.length} selected
                  </span>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        bulkUpdateCategory(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="text-sm border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="">Bulk Set Category</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                    <option value="payroll">Payroll</option>
                    <option value="treasury">Treasury</option>
                    <option value="uncategorized">Uncategorized</option>
                  </select>
                  <Button variant="outline" size="sm" onClick={exportSelected}>
                    Export Selected
                  </Button>
                </div>
              )}
            </div>

            <Table columns={columns} data={tableData} />
          </div>
        </>
      )}

      {transactions.length === 0 && !loading && walletAddress && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Enter a wallet address above and click &apos;Fetch
            Transactions&apos; to get started
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            We&apos;ll fetch all transactions involving that wallet
          </p>
        </div>
      )}
    </div>
  );
}
