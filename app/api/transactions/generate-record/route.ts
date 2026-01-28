import { NextRequest, NextResponse } from "next/server";
import { getTransactionByHash } from "@/lib/transactions";
import { upsertProof, markProofAsAnchored } from "@/lib/proofs";
import { markAsRecorded } from "@/lib/transactions";
import ProofRails from "@proofrails/sdk";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hash, description } = body;

    if (!hash) {
      return NextResponse.json(
        { error: "Transaction hash required" },
        { status: 400 }
      );
    }

    // Get transaction from DB
    const tx = await getTransactionByHash(hash);
    if (!tx) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Initialize ProofRails SDK with increased timeout
    const apiKey = process.env.PROOFRAILS_API_KEY || "";
    if (!apiKey) {
      return NextResponse.json(
        { error: "ProofRails API key not configured" },
        { status: 500 }
      );
    }

    console.log(" Connecting to ProofRails with increased timeout...");
    
    const proofrails = new ProofRails({
      apiKey,
      network: parseFloat(tx.value) > 0 ? "flare" : "coston2",
      timeout: 120000 // 2 minutes timeout
    });

    // Create ISO 20022 payment receipt
    console.log(" Creating ISO 20022 payment receipt...");
    const receipt = await proofrails.templates.payment({
      amount: parseFloat(tx.value),
      from: tx.fromAddress,
      to: tx.toAddress || "",
      purpose: description || tx.category || "Payment",
      transactionHash: tx.hash
    });

    console.log(" ProofRails receipt created:", receipt.id, "status:", receipt.status);

    // Store proof in database with actual status from ProofRails
    await upsertProof({
      txHash: tx.hash,
      receiptId: receipt.id,
      isoType: "payment",
      status: (receipt as any).status || "pending",
      recordHash: (receipt as any).recordHash || null,
      anchorTxHash: (receipt as any).anchorTx || null
    });

    // If anchor transaction exists, mark as anchored
    if ((receipt as any).anchorTx && (receipt as any).recordHash) {
      await markProofAsAnchored(receipt.id, (receipt as any).anchorTx, (receipt as any).recordHash);
    }

 // Mark transaction as recorded
     await markAsRecorded(tx.hash, receipt.id);

    return NextResponse.json({
      success: true,
      receipt: {
        id: receipt.id,
        status: receipt.status,
        anchorTx: receipt.anchorTx
      }
    });
  } catch (error: any) {
    console.error("Error generating proof:", error);
    return NextResponse.json(
      { error: "Failed to generate proof", details: error.message },
      { status: 500 }
    );
  }
}
