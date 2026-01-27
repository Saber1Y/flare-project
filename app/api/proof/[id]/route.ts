import { NextRequest, NextResponse } from "next/server";
import { getProofByReceiptId, getTransactionByHash } from "@/lib/db-operations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: receiptId } = await params;

    if (!receiptId) {
      return NextResponse.json(
        { error: "Receipt ID required" },
        { status: 400 }
      );
    }

    // Get proof from database
    const proof = await getProofByReceiptId(receiptId);
    if (!proof) {
      return NextResponse.json(
        { error: "Proof not found" },
        { status: 404 }
      );
    }

    // Get associated transaction
    const transaction = await getTransactionByHash(proof.txHash);
    if (!transaction) {
      return NextResponse.json(
        { error: "Associated transaction not found" },
        { status: 404 }
      );
    }

    // Use stored network, fallback to detection for existing data
    const network = transaction.network || (parseFloat(transaction.value) > 0 ? "flare" : "coston2");

    return NextResponse.json({
      success: true,
      proof: {
        id: proof.receiptId,
        status: proof.status,
        isoType: proof.isoType,
        createdAt: proof.createdAt,
        anchorTx: proof.anchorTxHash,
        recordHash: proof.recordHash,
        network: network,
        amount: `${transaction.value} FLR`,
        from: transaction.fromAddress,
        to: transaction.toAddress || "",
        purpose: transaction.category || "uncategorized",
        transactionHash: transaction.hash,
        blockNumber: transaction.blockNumber,
        timestamp: transaction.timestamp
      }
    });

  } catch (error: any) {
    console.error("Error fetching proof:", error);
    return NextResponse.json(
      { error: "Failed to fetch proof", details: error.message },
      { status: 500 }
    );
  }
}