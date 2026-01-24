"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, Badge, Button } from "@/components/ui";

export default function ProofPage() {
  const params = useParams();
  const receiptId = params.id as string;
  const [proofData, setProofData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProofData = async (shouldRefresh = false) => {
    try {
      const res = await fetch(`/api/proof/${receiptId}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();

      if (data.error) {
        console.error("API Error:", data.error);
      } else {
        setProofData(data.proof);
        
        // If proof is still pending and we haven't tried refreshing, try to refresh status
        if (data.proof?.status === 'pending' && !shouldRefresh) {
          await refreshProofStatus();
        }
      }
    } catch (error) {
      console.error("Error fetching proof:", error);
      setProofData(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshProofStatus = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/proof/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiptId })
      });
      
      if (res.ok) {
        const refreshData = await res.json();
        console.log("Proof status refreshed:", refreshData);
        
        // Fetch updated proof data
        await fetchProofData(true);
      }
    } catch (error) {
      console.error("Error refreshing proof status:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (receiptId) {
      fetchProofData();
    }
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

  if (!proofData) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Proof Not Found
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            The proof you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Button
            variant="primary"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
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
                 <p className="text-zinc-900 dark:text-zinc-100 capitalize">
                   {proofData.network}
                    ({proofData.network === 'flare' ? 'Mainnet' : 'Testnet'})
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
               
               {proofData.recordHash && (
                 <div>
                   <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                     Record Hash
                   </h3>
                   <p className="text-zinc-900 dark:text-zinc-100 font-mono text-sm">
                     {proofData.recordHash.slice(0, 10)}...{proofData.recordHash.slice(-8)}
                   </p>
                 </div>
               )}
               
               <div>
                 <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                   Block Number
                 </h3>
                 <p className="text-zinc-900 dark:text-zinc-100">
                   #{proofData.blockNumber}
                 </p>
               </div>
             </div>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 mb-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              ISO 20022 Evidence
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  ISO Message Type
                </h4>
                <p className="text-zinc-900 dark:text-zinc-100">
                  camt.053 (Bank-To-Customer Statement)
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Record Hash
                </h4>
                <p className="text-zinc-900 dark:text-zinc-100 font-mono text-sm">
                  {proofData.recordHash || 'Generating...'}
                </p>
              </div>
              
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  ISO 20022 XML
                </h4>
                <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                    {`<!-- ISO 20022 camt.053 Bank Statement -->
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.053.001.08">
  <BkToCstmrStmt>
    <Stmt>
      <Id>STATEMENT-${proofData.id}</Id>
      <CreDtTm>${new Date(proofData.createdAt).toISOString()}</CreDtTm>
      <Ntry>
        <Amt Ccy="FLR">${proofData.amount}</Amt>
        <CdtDbtInd>DBIT</CdtDbtInd>
        <BookgDt>
          <Dt>${new Date(proofData.createdAt).toISOString().split('T')[0]}</Dt>
        </BookgDt>
        <RltdPties>
          <Dbtr><Nm>${proofData.from}</Nm></Dbtr>
          <Cdtr><Nm>${proofData.to}</Nm></Cdtr>
        </RltdPties>
        <RmtInf>
          <Ustrd>${proofData.purpose}</Ustrd>
        </RmtInf>
      </Ntry>
    </Stmt>
  </BkToCstmrStmt>
</Document>`}
                  </pre>
                </div>
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
                  href={`https://${proofData.network === "flare" ? "" : "coston-"}flare-explorer.com/tx/${proofData.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#e51c56] hover:underline font-mono text-sm"
                >
                  {proofData.transactionHash.slice(0, 10)}...
                  {proofData.transactionHash.slice(-8)}
                </a>
              </div>

              <div>
                <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Anchor Transaction
                </h4>
                {proofData.anchorTx && (
                  <a
                    href={`https://${proofData.network === "flare" ? "" : "coston-"}flare-explorer.com/tx/${proofData.anchorTx}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#e51c56] hover:underline font-mono text-sm"
                  >
                    {proofData.anchorTx.slice(0, 10)}...
                    {proofData.anchorTx.slice(-8)}
                  </a>
                )}
                {!proofData.anchorTx && (
                  <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                    Pending anchor transaction
                  </span>
                )}
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
                  {proofData.status === 'anchored' 
                    ? 'This proof has been cryptographically anchored on the Flare blockchain'
                    : proofData.status === 'failed' 
                    ? 'This proof generation failed. You can try refreshing the status.'
                    : proofData.status === 'pending'
                    ? 'This proof is being generated and will be anchored shortly.'
                    : `Proof status: ${proofData.status}`
                  }
                </p>
              </div>

              <div className="flex gap-3 flex-wrap">
                {(proofData.status === 'pending' || proofData.status === 'failed') && (
                  <Button
                    variant="outline"
                    onClick={refreshProofStatus}
                    disabled={refreshing}
                  >
                    {refreshing ? 'Refreshing...' : 'Refresh Status'}
                  </Button>
                )}
                <Button variant="outline" onClick={() => {
                  // Download ISO XML
                  const isoXml = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.053.001.08">
  <BkToCstmrStmt>
    <Stmt>
      <Id>STATEMENT-${proofData.id}</Id>
      <CreDtTm>${new Date(proofData.createdAt).toISOString()}</CreDtTm>
      <Ntry>
        <Amt Ccy="FLR">${proofData.amount}</Amt>
        <CdtDbtInd>DBIT</CdtDbtInd>
        <BookgDt>
          <Dt>${new Date(proofData.createdAt).toISOString().split('T')[0]}</Dt>
        </BookgDt>
        <RltdPties>
          <Dbtr><Nm>${proofData.from}</Nm></Dbtr>
          <Cdtr><Nm>${proofData.to}</Nm></Cdtr>
        </RltdPties>
        <RmtInf>
          <Ustrd>${proofData.purpose}</Ustrd>
        </RmtInf>
      </Ntry>
    </Stmt>
  </BkToCstmrStmt>
</Document>`;
                  const dataUri = 'data:application/xml;charset=utf-8,' + encodeURIComponent(isoXml);
                  const linkElement = document.createElement("a");
                  linkElement.setAttribute("href", dataUri);
                  linkElement.setAttribute("download", `iso-20022-${receiptId}.xml`);
                  linkElement.click();
                }}>
                  Download ISO XML
                </Button>
                <Button variant="outline" onClick={() => window.print()}>
                  Print Proof
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    // Download proof as JSON
                    const dataStr = JSON.stringify(proofData, null, 2);
                    const dataUri =
                      "data:application/json;charset=utf-8," +
                      encodeURIComponent(dataStr);
                    const exportFileDefaultName = `proof-${receiptId}.json`;
                    const linkElement = document.createElement("a");
                    linkElement.setAttribute("href", dataUri);
                    linkElement.setAttribute("download", exportFileDefaultName);
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
