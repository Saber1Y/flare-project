import { NextRequest, NextResponse } from "next/server";
import { getTransactionByHash, upsertProof, markProofAsAnchored } from "@/lib/db";
import ProofRails from "@proofrails/sdk";
import db from "@/lib/db";

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
    const tx = getTransactionByHash(hash);
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
      network: tx.value > "0" ? "flare" : "coston2",
      timeout: 120000 // 2 minutes timeout
    });

    // Create ISO 20022 payment receipt
    console.log(" Creating ISO 20022 payment receipt...");
    const receipt = await proofrails.templates.payment({
      amount: parseFloat(tx.value),
      from: tx.from_address,
      to: tx.to_address || "",
      purpose: description || tx.category || "Payment",
      transactionHash: tx.hash
    });

    console.log(" ProofRails receipt created:", receipt.id);

    // Store proof in database
    upsertProof({
      txHash: tx.hash,
      receiptId: receipt.id,
      isoType: "payment",
      status: receipt.status || "anchored",
      createdAt: new Date().toISOString()
    });

    // Mark transaction as recorded
    const markAsRecordedStmt = db.prepare(`
      UPDATE transactions
      SET recorded = 1, proof_id = ?
      WHERE hash = ?
    `);
    markAsRecordedStmt.run(receipt.id, tx.hash);

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
