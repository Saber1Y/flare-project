"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, Badge, Button } from "@/components/ui";

export default function ProofPage() {
  const params = useParams();
  const receiptId = params.id as string;
  const [proofData, setProofData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, you would fetch proof data from ProofRails API
    // For now, we'll show a mock proof page
    const mockProof = {
      id: receiptId,
      status: "anchored",
      isoType: "payment",
      createdAt: new Date().toISOString(),
      anchorTx: "0xmock_anchor_transaction_hash",
      network: "coston2",
      amount: "40 FLR",
      from: "0xba58158a413cee3601295e2e36b826cd965f65b5",
      to: "0xba58158a413cee3601295e2e36b826cd965f65b5",
      purpose: "uncategorized",
      transactionHash: "0xd81d9d8168c05c207827f9b405873a5642a08301ebc01c20ba22e7b6fc43991a"
    };

    setTimeout(() => {
      setProofData(mockProof);
      setLoading(false);
    }, 1000);
  }, [receiptId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51c56] mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading proof...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            ISO 20022 Payment Proof
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Audit-grade payment record anchored on Flare blockchain
          </p>
        </div>

        <Card className="p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Proof Details
              </h2>
              <Badge variant="recorded">
                {proofData.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Receipt ID
                </h3>
                <p className="text-zinc-900 dark:text-zinc-100 font-mono text-sm">
                  {proofData.id}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  ISO Type
                </h3>
                <p className="text-zinc-900 dark:text-zinc-100">
                  {proofData.isoType?.toUpperCase()}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Network
                </h3>
                <p className="text-zinc-900 dark:text-zinc-100">
                  {proofData.network}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Created
                </h3>
                <p className="text-zinc-900 dark:text-zinc-100">
                  {new Date(proofData.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 mb-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Transaction Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Amount
                </h4>
                <p className="text-zinc-900 dark:text-zinc-100 font-semibold">
                  {proofData.amount}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Purpose
                </h4>
                <p className="text-zinc-900 dark:text-zinc-100">
                  {proofData.purpose}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  From
                </h4>
                <p className="text-zinc-900 dark:text-zinc-100 font-mono text-sm">
                  {proofData.from}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  To
                </h4>
                <p className="text-zinc-900 dark:text-zinc-100 font-mono text-sm">
                  {proofData.to}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 mb-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Blockchain Verification
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Original Transaction
                </h4>
                <a
                  href={`https://coston2-explorer.flare.network/tx/${proofData.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#e51c56] hover:underline font-mono text-sm"
                >
                  {proofData.transactionHash.slice(0, 10)}...{proofData.transactionHash.slice(-8)}
                </a>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Anchor Transaction
                </h4>
                <a
                  href={`https://coston2-explorer.flare.network/tx/${proofData.anchorTx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#e51c56] hover:underline font-mono text-sm"
                >
                  {proofData.anchorTx.slice(0, 10)}...{proofData.anchorTx.slice(-8)}
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  Verification Status
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  This proof has been cryptographically anchored on the Flare blockchain
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                >
                  Print Proof
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    // Download proof as JSON
                    const dataStr = JSON.stringify(proofData, null, 2);
                    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                    const exportFileDefaultName = `proof-${receiptId}.json`;
                    const linkElement = document.createElement('a');
                    linkElement.setAttribute('href', dataUri);
                    linkElement.setAttribute('download', exportFileDefaultName);
                    linkElement.click();
                  }}
                >
                  Download Proof
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}