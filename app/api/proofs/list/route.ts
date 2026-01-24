import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const proofs = db.prepare(`
      SELECT p.receiptId, p.txHash, p.status, p.createdAt, p.recordHash,
             t.value, t.category
      FROM proofs p
      JOIN transactions t ON p.txHash = t.hash
      ORDER BY p.createdAt DESC
    `).all();

    // Format data
    const formattedProofs = proofs.map((proof: any) => ({
      receiptId: proof.receiptId,
      txHash: proof.txHash,
      amount: `${proof.value} FLR`,
      category: proof.category,
      status: proof.status,
      createdAt: proof.createdAt,
      views: 0 // Could be implemented with analytics later
    }));

    return NextResponse.json({
      success: true,
      proofs: formattedProofs,
      total: formattedProofs.length
    });

  } catch (error: any) {
    console.error("Error fetching proofs:", error);
    return NextResponse.json(
      { error: "Failed to fetch proofs", details: error.message },
      { status: 500 }
    );
  }
}