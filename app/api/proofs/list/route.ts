import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { proofs, transactions } from "@/lib/schema";
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const allProofs = await db.select({
      receiptId: proofs.receiptId,
      txHash: proofs.txHash,
      status: proofs.status,
      createdAt: proofs.createdAt,
      recordHash: proofs.recordHash,
      value: transactions.value,
      category: transactions.category
    })
    .from(proofs)
    .leftJoin(transactions, eq(proofs.txHash, transactions.hash))
    .orderBy(desc(proofs.createdAt));

    // Format data
    const formattedProofs = allProofs.map((proof: any) => ({
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