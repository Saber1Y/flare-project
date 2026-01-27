import { NextRequest, NextResponse } from "next/server";
import { getProofByReceiptId, markProofAsAnchored } from "@/lib/db";
import ProofRails from "@proofrails/sdk";
import db from "@/lib/db";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();
    const { receiptId } = body;

    if (!receiptId) {
      return NextResponse.json(
        { error: "Receipt ID required" },
        { status: 400 }
      );
    }

    // Get existing proof from database
    const proof = getProofByReceiptId(receiptId);
    if (!proof) {
      return NextResponse.json(
        { error: "Proof not found" },
        { status: 404 }
      );
    }

    // Initialize ProofRails SDK
    const apiKey = process.env.PROOFRAILS_API_KEY || "";
    if (!apiKey) {
      return NextResponse.json(
        { error: "ProofRails API key not configured" },
        { status: 500 }
      );
    }

    const proofrails = new ProofRails({
      apiKey,
      timeout: 30000 // 30 seconds timeout
    });

    
    const proofData = proof;


    const receipt = await proofrails.receipts.get(receiptId);
    console.log("Receipt status from ProofRails:", receipt.status);

   
    const actualStatus = (receipt.bundleHash || receipt.xmlUrl) ? "anchored" : receipt.status;
    console.log("Actual status (working around SDK bug):", actualStatus);

    // Update proof status in database if it has changed
    let updated = false;
    
    if (actualStatus && actualStatus !== proof.status) {
      if (actualStatus === 'anchored' && (receipt.bundleHash || receipt.xmlUrl)) {
        // Use the original transaction hash as the anchor (since this is anchored on Flare)
        const anchorTx = proof.txHash; // The original transaction IS the anchor
        const recordHash = receipt.bundleHash || receipt.recordHash;
        markProofAsAnchored(receiptId, anchorTx, recordHash);
        console.log("Proof marked as anchored with anchor tx:", anchorTx, "record hash:", recordHash);
      } else {
        // Update status if not anchored yet
        const updateStmt = db.prepare(`
          UPDATE proofs 
          SET status = ?
          WHERE receiptId = ?
        `);
        updateStmt.run(actualStatus, receiptId);
        console.log("Proof status updated to:", actualStatus);
      }
      updated = true;
    }

    return NextResponse.json({
      success: true,
      updated,
      currentStatus: actualStatus,
      anchorTx: receipt.anchorTx,
      recordHash: receipt.recordHash || receipt.bundleHash,
      bundleUrl: receipt.bundleUrl,
      xmlUrl: receipt.xmlUrl
    });

  } catch (error: any) {
    console.error("Error refreshing proof status:", error);
    return NextResponse.json(
      { error: "Failed to refresh proof status", details: error.message },
      { status: 500 }
    );
  }
}