"use client";

import { useState, useEffect } from "react";
import { HiLink, HiEye, HiDownload, HiExternalLink } from "react-icons/hi";
import { Button, Badge, Table, Card, Input } from "@/components/ui";

interface Proof {
  receiptId: string;
  txHash: string;
  amount: string;
  category: string;
  createdAt: string;
  status: string;
  views?: number;
}

export default function ProofsPage() {
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProofs = async () => {
      try {
        const res = await fetch('/api/proofs/list');
        if (res.ok) {
          const data = await res.json();
          setProofs(data.proofs);
        }
      } catch (error) {
        console.error('Failed to fetch proofs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProofs();
  }, []);

  const filteredProofs = proofs.filter(proof =>
    proof.receiptId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proof.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proof.amount.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51c56]"></div>
        </div>
      </div>
    );
  }

  const columns = [
    { key: "receiptId", header: "Proof ID", className: "font-mono text-xs" },
    { key: "txHash", header: "Transaction", className: "font-mono text-xs" },
    { key: "amount", header: "Amount", className: "font-semibold" },
    { key: "category", header: "Category", className: "" },
    { key: "createdAt", header: "Created", className: "" },
    { key: "status", header: "Status", className: "" },
    { key: "actions", header: "", className: "text-right" }
  ];

  const exportAllProofs = async () => {
    try {
      const csvContent = [
        'Receipt ID,Transaction Hash,Amount,Category,Created,Status',
        ...proofs.map(p => 
          `"${p.receiptId}","${p.txHash}","${p.amount}","${p.category}","${new Date(p.createdAt).toLocaleDateString()}","${p.status}"`
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `iso-proofs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const showSharingGuide = () => {
    setShowModal(true);
  };

  const tableData = filteredProofs.map((proof) => ({
    receiptId: (
      <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-600 dark:text-zinc-400">
        {proof.receiptId}
      </code>
    ),
    txHash: (
      <a
        href={`https://coston2-flare-explorer.com/tx/${proof.txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#e51c56] hover:underline font-mono text-xs"
      >
        {proof.txHash.slice(0, 10)}...
      </a>
    ),
    amount: proof.amount,
    category: (
      <Badge variant={proof.category.toLowerCase() as any}>
        {proof.category}
      </Badge>
    ),
    createdAt: new Date(proof.createdAt).toLocaleDateString(),
    status: (
      <Badge variant={proof.status === 'anchored' ? 'recorded' : proof.status === 'failed' ? 'failed' : 'pending'}>
        {proof.status}
      </Badge>
    ),
    actions: (
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          href={`/proof/${proof.receiptId}`}
        >
          <HiEye className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(`${window.location.origin}/proof/${proof.receiptId}`, proof.receiptId)}
        >
          {copied === proof.receiptId ? "Copied!" : "Copy"}
        </Button>
      </div>
    )
  }));

  const totalAmount = proofs.reduce((sum, proof) => {
    const value = parseFloat(proof.amount.replace(' FLR', ''));
    return sum + value;
  }, 0);

  const anchoredCount = proofs.filter(p => p.status === 'anchored').length;

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Share ISO 20022 Proofs
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
              <p><strong>For Accountants:</strong> Share proof links from the Proofs page. Accountants can verify transactions and download ISO XML without wallet access.</p>
              <p><strong>For Auditors:</strong> Each proof contains cryptographically verifiable ISO 20022 data anchored on Flare blockchain.</p>
              <p><strong>Step 1:</strong> Copy proof URL from Proofs page</p>
              <p><strong>Step 2:</strong> Share with accountant/auditor</p>
              <p><strong>Step 3:</strong> They verify transaction authenticity and download ISO 20022 records</p>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3 mt-4">
                <p className="text-green-900 dark:text-green-200 font-medium">✅ Read-only access maintains security while providing full audit trail</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          ISO 20022 Proofs
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Manage and share your audit-grade payment records
        </p>
      </div> 

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-6">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Total Proofs
          </div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {proofs.length}
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Anchored
          </div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {anchoredCount}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
            Successfully recorded
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Total Amount
          </div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {totalAmount.toFixed(2)} FLR
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Success Rate
          </div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {proofs.length > 0 ? Math.round((anchoredCount / proofs.length) * 100) : 0}%
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
            Completion rate
          </div>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Generated Proofs
          </h2>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search proofs by ID or hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            {/* <Button variant="outline" href="/transactions">
              Generate New Proof
            </Button> */}
          </div>
        </div>
        
        {proofs.length > 0 ? (
          <Table columns={columns} data={tableData} />
        ) : (
          <div className="text-center py-12">
            <HiLink className="w-16 h-16 mx-auto mb-4 text-[#e51c56]" />
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              No proofs generated yet
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 max-w-md mx-auto">
              Start by generating ISO 20022 proofs for your transactions. Each proof becomes a verifiable audit record anchored on the Flare blockchain.
            </p>
            <Button variant="primary" href="/transactions">
              Generate Your First Proof
            </Button>
          </div>
        )}
      </Card>

      <Card className="p-6 mt-6 border-2 border-dashed border-zinc-300 dark:border-zinc-700">
        <div className="text-center py-8">
          <HiExternalLink className="w-16 h-16 mx-auto mb-4 text-[#e51c56]" />
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            Share with Accountants
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 max-w-md mx-auto">
            Share read-only proof links with accountants. They can verify transactions and download ISO 20022 records without needing wallet access.
          </p>
          <div className="flex items-center gap-3 justify-center">
            <Button variant="outline" onClick={exportAllProofs}>
              <HiDownload className="w-4 h-4 mr-2" />
              Export All Proofs
            </Button>
            <Button variant="primary" onClick={showSharingGuide}>
              <HiLink className="w-4 h-4 mr-2" />
              Sharing Guide
            </Button>
          </div>
        </div>
      </Card>
      </div>
    </>
  );
}